const test = require('node:test');
const assert = require('node:assert/strict');

const { getProduct, saveProduct } = require('../src/workers/productStore');
const { setOrderAvailabilityHandler } = require('../src/workers/setOrderAvailability');
const { notifyProducerHandler } = require('../src/workers/notifyProducer');

const productId = 'BRFN-DEMO-001';

function fakeJob(variables) {
  return {
    variables,
    complete(result) {
      this.result = result;
    },
    fail(error) {
      this.failure = error;
    }
  };
}

test('out-of-stock decision closes orders', async () => {
  const original = getProduct(productId);

  try {
    const job = fakeJob({
      productId,
      availability: {
        status: 'OUT_OF_STOCK',
        ordersOpen: false
      }
    });

    await setOrderAvailabilityHandler(job);

    assert.equal(job.result.orderAvailabilityUpdated, true);
    assert.equal(job.result.ordersOpen, false);
    assert.equal(getProduct(productId).currentStatus, 'OUT_OF_STOCK');
    assert.equal(getProduct(productId).ordersOpen, false);
  } finally {
    saveProduct(productId, original);
  }
});

test('invalid availability decision is rejected', async () => {
  const job = fakeJob({
    productId,
    availability: {
      status: 'INVALID_STATUS',
      ordersOpen: false
    }
  });

  await setOrderAvailabilityHandler(job);

  assert.match(job.failure.errorMessage, /Invalid availability/);
});

test('producer receives a simulated out-of-stock notification', async () => {
  const job = fakeJob({
    productId,
    productName: 'Locally Grown Carrots',
    availability: {
      status: 'OUT_OF_STOCK',
      ordersOpen: false
    }
  });

  await notifyProducerHandler(job);

  assert.equal(job.result.notificationSimulated, true);
  assert.equal(job.result.notificationSent, false);
  assert.match(job.result.notificationMessage, /OUT_OF_STOCK/);
  assert.match(job.result.notificationMessage, /Locally Grown Carrots/);
});

test('notification fails when availability status is missing', async () => {
  const job = fakeJob({ productId });

  await notifyProducerHandler(job);

  assert.match(job.failure.errorMessage, /Missing product or availability/);
});
