/**
 * BRFN Sprint 3 — F1a Certificate Verification Audit
 *
 * Records a simulated audit entry for a completed
 * organic certification verification.
 *
 * This is a demonstration service, not persistent storage.
 */

const auditRecords = [];

async function recordVerificationAuditHandler(job) {
  const variables = job.variables || {};

  const {
    productId,
    productName,
    certNumber,
    certValid,
    certStatus,
    certCheckedAt,
    certVerifiedBy
  } = variables;

  if (
    typeof certStatus !== 'string' ||
    certStatus.trim() === '' ||
    (certValid !== true && certValid !== false)
  ) {
    return job.fail({
      errorMessage: 'Missing or invalid certificate verification result',
      retries: 0
    });
  }

  const auditRecord = {
    productId: productId || null,
    productName: productName || null,
    certNumber: certNumber || null,
    certValid,
    certStatus,
    certCheckedAt: certCheckedAt || null,
    certVerifiedBy: certVerifiedBy || 'MANUAL',
    recordedAt: new Date().toISOString()
  };

  auditRecords.push(auditRecord);

  console.log(
    `[record-verification-audit] ` +
    `product=${auditRecord.productId || 'UNKNOWN'}, ` +
    `status=${certStatus}, valid=${certValid}`
  );

  return job.complete({
    auditRecorded: true,
    auditRecordedAt: auditRecord.recordedAt,
    certValid,
    certStatus
  });
}

function getAuditRecords() {
  return auditRecords.map(record => ({ ...record }));
}

module.exports = {
  recordVerificationAuditHandler,
  getAuditRecords
};
