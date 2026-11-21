// Runs the job handlers against the real mock service, using a fake Camunda job.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/cert-mock/server');
const { validateProductHandler, makeVerifyCertificateHandler } = require('../src/workers/handlers');

// A stand-in for a Camunda job: records how the handler finished it.
function fakeJob(variables) {
  const job = { key: 'test', variables, outcome: null };
  job.complete = async (vars) => { job.outcome = { type: 'complete', vars }; return 'JOB_ACTION_ACKNOWLEDGEMENT'; };
  job.error = async (e) => { job.outcome = { type: 'error', ...e }; return 'JOB_ACTION_ACKNOWLEDGEMENT'; };
  job.fail = async (e) => { job.outcome = { type: 'fail', e }; return 'JOB_ACTION_ACKNOWLEDGEMENT'; };
  return job;
}

async function withMock(options, fn) {
  const server = createApp(options).listen(0);
  await new Promise(r => server.once('listening', r));
  const baseUrl = `http://localhost:${server.address().port}`;
  try { await fn(baseUrl); } finally { server.close(); }
}

const TODAY = '2026-11-03';
const quick = (baseUrl) => makeVerifyCertificateHandler({ baseUrl, attempts: 2, timeoutMs: 500, retryDelayMs: 10, today: TODAY });

test('validate-product completes with dataValid and a readable summary', async () => {
  const job = fakeJob({ name: 'X', organicClaimed: false });
  await validateProductHandler(job, { today: TODAY });
  assert.equal(job.outcome.type, 'complete');
  assert.equal(job.outcome.vars.dataValid, false);
  assert.ok(job.outcome.vars.validationSummary.includes('Product name must be 3 to 100 characters.'));
});

test('verify-certificate: valid certificate', async () => {
  await withMock({}, async (baseUrl) => {
    const job = fakeJob({ organicClaimed: true, certNumber: 'BOS-1001' });
    await quick(baseUrl)(job);
    assert.equal(job.outcome.type, 'complete');
    assert.equal(job.outcome.vars.certValid, true);
    assert.equal(job.outcome.vars.certStatus, 'VALID');
    assert.equal(job.outcome.vars.certVerifiedBy, 'SERVICE');
  });
});

test('verify-certificate: expired, revoked and unknown certificates are not valid', async () => {
  await withMock({}, async (baseUrl) => {
    for (const [cert, status] of [['BOS-2001', 'EXPIRED'], ['WCO-3001', 'REVOKED'], ['NOPE-9', 'NOT_FOUND']]) {
      const job = fakeJob({ organicClaimed: true, certNumber: cert });
      await quick(baseUrl)(job);
      assert.equal(job.outcome.type, 'complete');
      assert.equal(job.outcome.vars.certValid, false);
      assert.equal(job.outcome.vars.certStatus, status);
    }
  });
});

test('verify-certificate: outage throws the BPMN error CERT_SERVICE_DOWN after retrying', async () => {
  await withMock({ down: true }, async (baseUrl) => {
    const job = fakeJob({ organicClaimed: true, certNumber: 'BOS-1001' });
    await quick(baseUrl)(job);
    assert.equal(job.outcome.type, 'error');
    assert.equal(job.outcome.errorCode, 'CERT_SERVICE_DOWN');
    assert.match(job.outcome.errorMessage, /after 2 attempts/);
  });
});

test('verify-certificate: no service running at all also counts as down', async () => {
  const job = fakeJob({ organicClaimed: true, certNumber: 'BOS-1001' });
  await quick('http://localhost:1')(job);
  assert.equal(job.outcome.errorCode, 'CERT_SERVICE_DOWN');
});

test('verify-certificate: a slow service times out and counts as down', async () => {
  await withMock({ delayMs: 1500 }, async (baseUrl) => {
    const job = fakeJob({ organicClaimed: true, certNumber: 'BOS-1001' });
    await quick(baseUrl)(job);
    assert.equal(job.outcome.errorCode, 'CERT_SERVICE_DOWN');
    assert.match(job.outcome.errorMessage, /no reply within 500 ms/);
  });
});

test('outage can be switched on and off while running', async () => {
  await withMock({}, async (baseUrl) => {
    await fetch(`${baseUrl}/admin/outage`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ down: true }) });
    assert.equal((await fetch(`${baseUrl}/health`)).status, 503);
    await fetch(`${baseUrl}/admin/outage`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ down: false }) });
    assert.equal((await fetch(`${baseUrl}/health`)).status, 200);
  });
});
