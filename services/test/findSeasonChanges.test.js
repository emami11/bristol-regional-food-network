const test = require('node:test');
const assert = require('node:assert/strict');

const {
  findSeasonChangesHandler
} = require('../src/workers/findSeasonChanges');

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

test('no seasonal changes during active season', async () => {
  const job = fakeJob({
    checkDate: '2026-11-22'
  });

  await findSeasonChangesHandler(job);

  assert.equal(job.result.seasonalCheckCount, 0);
  assert.deepEqual(job.result.productsToCheck, []);
});

test('product requires update after season ends', async () => {
  const job = fakeJob({
    checkDate: '2027-01-01'
  });

  await findSeasonChangesHandler(job);

  assert.equal(job.result.seasonalCheckCount, 1);
  assert.equal(job.result.productsToCheck[0].productId, 'BRFN-DEMO-001');
  assert.equal(job.result.productsToCheck[0].quantity, 25);
});

test('product requires update before season begins', async () => {
  const job = fakeJob({
    checkDate: '2025-12-01'
  });

  await findSeasonChangesHandler(job);

  assert.equal(job.result.seasonalCheckCount, 1);
  assert.equal(job.result.productsToCheck[0].currentStatus, 'AVAILABLE');
});

test('invalid seasonal check date is rejected', async () => {
  const job = fakeJob({
    checkDate: '2026-99-99'
  });

  await findSeasonChangesHandler(job);

  assert.match(job.failure.errorMessage, /Invalid seasonal check date/);
});
