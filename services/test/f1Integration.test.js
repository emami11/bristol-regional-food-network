// notify-producer and record-verification-audit with the variables F1 and F1a actually pass.
const test = require('node:test');
const assert = require('node:assert/strict');
const { notifyProducerHandler } = require('../src/workers/notifyProducer');
const { recordVerificationAuditHandler, getAuditRecords } = require('../src/workers/recordVerificationAudit');

function fakeJob(variables, customHeaders = {}) {
  const job = { key: 'test', variables, customHeaders, outcome: null };
  job.complete = async (vars) => { job.outcome = { type: 'complete', vars }; };
  job.fail = async (e) => { job.outcome = { type: 'fail', ...e }; };
  return job;
}

const listing = { listingId: 'LST-0001', productName: 'Heritage carrots' };

test('notify-producer: F1 product live, by template header', async () => {
  const job = fakeJob({ ...listing, productId: 'LST-0001', listingStatus: 'PUBLISHED', availability: { status: 'AVAILABLE', ordersOpen: true } },
    { template: 'PRODUCT_LIVE' });
  await notifyProducerHandler(job);
  assert.equal(job.outcome.type, 'complete');
  assert.equal(job.outcome.vars.notificationTemplate, 'PRODUCT_LIVE');
  assert.match(job.outcome.vars.notificationMessage, /Heritage carrots \(LST-0001\) is now live/);
});

test('notify-producer: F1 correction reminder works without a productId or availability', async () => {
  const job = fakeJob({ ...listing, listingStatus: 'DRAFT' }, { template: 'CORRECTION_REMINDER' });
  await notifyProducerHandler(job);
  assert.equal(job.outcome.type, 'complete');
  assert.match(job.outcome.vars.notificationMessage, /still needs corrections/);
});

test('notify-producer: with no header, the template comes from the listing status', async () => {
  const reminder = fakeJob({ ...listing, listingStatus: 'DRAFT' });
  await notifyProducerHandler(reminder);
  assert.equal(reminder.outcome.vars.notificationTemplate, 'CORRECTION_REMINDER');

  const archived = fakeJob({ ...listing, listingStatus: 'ARCHIVED' });
  await notifyProducerHandler(archived);
  assert.equal(archived.outcome.vars.notificationTemplate, 'LISTING_ARCHIVED');
  assert.match(archived.outcome.vars.notificationMessage, /was archived/);
});

test('notify-producer: an F1 message without a listingId raises an incident', async () => {
  const job = fakeJob({ productName: 'X' }, { template: 'LISTING_ARCHIVED' });
  await notifyProducerHandler(job);
  assert.equal(job.outcome.type, 'fail');
  assert.equal(job.outcome.retries, 0);
});

test('record-verification-audit: automatic route (certVerified, no certStatus)', async () => {
  const job = fakeJob({ ...listing, certNumber: 'BOS-1001', certVerified: true, certReason: 'valid until 2027-12-31', verificationMethod: 'AUTOMATIC' });
  await recordVerificationAuditHandler(job);
  assert.equal(job.outcome.type, 'complete');
  assert.equal(job.outcome.vars.certStatus, 'VALID');
  const rec = getAuditRecords().at(-1);
  assert.equal(rec.productId, 'LST-0001');
  assert.equal(rec.certVerifiedBy, 'SERVICE');
});

test('record-verification-audit: manual route is recorded as a manual decision', async () => {
  const approved = fakeJob({ ...listing, certVerified: true, certReason: 'Checked certificate copy', verificationMethod: 'MANUAL', certStatus: 'SERVICE_UNAVAILABLE' });
  await recordVerificationAuditHandler(approved);
  assert.equal(approved.outcome.vars.certStatus, 'MANUAL_APPROVED');

  const rejected = fakeJob({ ...listing, certVerified: false, certReason: 'Not on the register', verificationMethod: 'MANUAL' });
  await recordVerificationAuditHandler(rejected);
  assert.equal(rejected.outcome.vars.certStatus, 'MANUAL_REJECTED');
  assert.equal(getAuditRecords().at(-1).certVerifiedBy, 'MANUAL');
});
