const test = require('node:test');
const assert = require('node:assert/strict');

const {
  recordVerificationAuditHandler,
  getAuditRecords
} = require('../src/workers/recordVerificationAudit');

test('records a valid certificate verification outcome', async () => {
  let result;

  const job = {
    variables: {
      productId: 'BRFN-DEMO-001',
      productName: 'Locally Grown Carrots',
      certNumber: 'CERT-001',
      certValid: true,
      certStatus: 'VALID',
      certVerifiedBy: 'SERVICE'
    },
    complete: async (variables) => {
      result = variables;
    },
    fail: async () => {
      assert.fail('Valid verification must not fail');
    }
  };

  await recordVerificationAuditHandler(job);

  assert.equal(result.auditRecorded, true);
  assert.equal(result.certValid, true);
  assert.equal(result.certStatus, 'VALID');

  const records = getAuditRecords();
  assert.equal(records.at(-1).productId, 'BRFN-DEMO-001');
  assert.equal(records.at(-1).certStatus, 'VALID');
});

test('rejects an incomplete verification result', async () => {
  let failure;

  const job = {
    variables: {
      certStatus: 'VALID'
    },
    complete: async () => {
      assert.fail('Incomplete verification must not complete');
    },
    fail: async (details) => {
      failure = details;
    }
  };

  await recordVerificationAuditHandler(job);

  assert.equal(failure.retries, 0);
  assert.match(failure.errorMessage, /invalid certificate/i);
});
