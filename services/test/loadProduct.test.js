const test = require('node:test');
const assert = require('node:assert/strict');
const { loadProductHandler } = require('../src/workers/loadProduct');

test('load-product returns the requested demo product', async () => {
  let result;

  const job = {
    variables: { productId: 'BRFN-DEMO-001' },
    complete: (variables) => {
      result = variables;
    }
  };

  await loadProductHandler(job);

  assert.equal(result.productId, 'BRFN-DEMO-001');
  assert.equal(result.productName, 'Locally Grown Carrots');
  assert.equal(result.currentQuantity, 25);
  assert.equal(result.quantity, 25);
  assert.equal(result.currentStatus, 'AVAILABLE');
  assert.equal(result.dataSource, 'SIMULATED_PRODUCT_CATALOG');
});

test('load-product reports an unknown product', async () => {
  let failure;

  const job = {
    variables: { productId: 'UNKNOWN-001' },
    fail: (details) => {
      failure = details;
    }
  };

  await loadProductHandler(job);

  assert.match(failure.errorMessage, /Product not found/);
  assert.equal(failure.retries, 0);
});
