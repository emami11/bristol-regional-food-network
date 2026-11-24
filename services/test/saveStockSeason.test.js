const test = require('node:test');
const assert = require('node:assert/strict');

const { saveStockSeasonHandler } = require('../src/workers/saveStockSeason');
const { getProduct, saveProduct } = require('../src/workers/productStore');

const productId = 'BRFN-DEMO-001';

function fakeJob(variables) {
  return {
    variables,
    complete(result) {
      this.result = result;
    },
    fail(details) {
      this.failure = details;
    }
  };
}

test('save-stock-season updates stored quantity from 25 to 15', async () => {
  const original = getProduct(productId);

  try {
    const job = fakeJob({
      productId,
      quantity: 15,
      seasonStart: '2026-01-01',
      seasonEnd: '2026-12-31'
    });

    await saveStockSeasonHandler(job);

    assert.equal(job.result.saved, true);
    assert.equal(job.result.quantity, 15);
    assert.equal(getProduct(productId).currentQuantity, 15);
    assert.equal(getProduct(productId).currentStatus, 'AVAILABLE');
  } finally {
    saveProduct(productId, original);
  }
});

test('save-stock-season rejects negative stock', async () => {
  const original = getProduct(productId);

  const job = fakeJob({
    productId,
    quantity: -5,
    seasonStart: '2026-01-01',
    seasonEnd: '2026-12-31'
  });

  await saveStockSeasonHandler(job);

  assert.match(job.failure.errorMessage, /Invalid stock/);
  assert.equal(getProduct(productId).currentQuantity, original.currentQuantity);
});

test('save-stock-season rejects unknown products', async () => {
  const job = fakeJob({
    productId: 'UNKNOWN-001',
    quantity: 15,
    seasonStart: '2026-01-01',
    seasonEnd: '2026-12-31'
  });

  await saveStockSeasonHandler(job);

  assert.match(job.failure.errorMessage, /Product not found/);
});
