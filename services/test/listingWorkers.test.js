// The F1 listing workers against the simulated listing store, using a fake Camunda job.
const test = require('node:test');
const assert = require('node:assert/strict');
const store = require('../src/store/listings');
const { saveDraftListingHandler, publishProductHandler, archiveListingHandler } = require('../src/workers/listingWorkers');

function fakeJob(variables) {
  const job = { key: 'test', variables, outcome: null };
  job.complete = async (vars) => { job.outcome = { type: 'complete', vars }; return 'JOB_ACTION_ACKNOWLEDGEMENT'; };
  job.error = async (e) => { job.outcome = { type: 'error', ...e }; return 'JOB_ACTION_ACKNOWLEDGEMENT'; };
  job.fail = async (e) => { job.outcome = { type: 'fail', ...e }; return 'JOB_ACTION_ACKNOWLEDGEMENT'; };
  return job;
}

test.beforeEach(() => store.reset());

test('save-draft-listing creates a draft and gives it a listing ID', async () => {
  const job = fakeJob({ productName: 'Heritage carrots', price: 2.5, someOtherVariable: 'ignored' });
  await saveDraftListingHandler(job);
  assert.equal(job.outcome.type, 'complete');
  assert.deepEqual(job.outcome.vars, { listingId: 'LST-0001', listingStatus: 'DRAFT' });
  const saved = store.getListing('LST-0001');
  assert.equal(saved.productName, 'Heritage carrots');
  assert.equal(saved.someOtherVariable, undefined);
});

test('a corrected resubmission updates the same listing instead of creating a new one', async () => {
  await saveDraftListingHandler(fakeJob({ productName: 'Carots', price: 0 }));
  const again = fakeJob({ listingId: 'LST-0001', productName: 'Carrots', price: 2.5 });
  await saveDraftListingHandler(again);
  assert.equal(again.outcome.vars.listingId, 'LST-0001');
  assert.equal(store.getListing('LST-0001').productName, 'Carrots');
  assert.equal(store.getListing('LST-0002'), null);
});

test('publish-product publishes the listing with the decided availability', async () => {
  await saveDraftListingHandler(fakeJob({ productName: 'Carrots' }));
  const job = fakeJob({ listingId: 'LST-0001', availability: { status: 'AVAILABLE', ordersOpen: true } });
  await publishProductHandler(job);
  assert.equal(job.outcome.type, 'complete');
  assert.equal(job.outcome.vars.listingStatus, 'PUBLISHED');
  assert.equal(job.outcome.vars.productId, 'LST-0001');
  assert.equal(job.outcome.vars.availabilityStatus, 'AVAILABLE');
  assert.equal(job.outcome.vars.ordersOpen, true);
  assert.equal(store.getListing('LST-0001').status, 'PUBLISHED');
});

test('publish-product raises an incident when the listing does not exist', async () => {
  const job = fakeJob({ listingId: 'LST-9999', availability: { status: 'AVAILABLE', ordersOpen: true } });
  await publishProductHandler(job);
  assert.equal(job.outcome.type, 'fail');
  assert.equal(job.outcome.retries, 0);
});

test('archive keeps the listing but marks it ARCHIVED', async () => {
  await saveDraftListingHandler(fakeJob({ productName: 'Carrots' }));
  const job = fakeJob({ listingId: 'LST-0001' });
  await archiveListingHandler(job);
  assert.equal(job.outcome.vars.listingStatus, 'ARCHIVED');
  assert.equal(store.getListing('LST-0001').status, 'ARCHIVED');
  assert.equal(store.getListing('LST-0001').productName, 'Carrots');
});
