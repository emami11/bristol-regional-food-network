/**
 * BRFN Sprint 3 — F1a Certificate Verification Audit
 *
 * Records a simulated audit entry for a completed
 * organic certification verification.
 *
 * This is a demonstration service, not persistent storage.
 *
 * F1a "Record verification outcome" runs after either route:
 *   automatic: "Request certificate verification" maps certVerified, certReason and
 *              verificationMethod = "AUTOMATIC"
 *   manual:    "Review certificate manually" maps certVerified (certDecision = "APPROVED"),
 *              certReason (certNotes) and verificationMethod = "MANUAL"
 * Older callers that send certValid / certStatus / certVerifiedBy are still accepted.
 */

const auditRecords = [];

// Works out a status word when the process doesn't pass certStatus in.
function deriveStatus(verified, method) {
  if (method === 'MANUAL') return verified ? 'MANUAL_APPROVED' : 'MANUAL_REJECTED';
  return verified ? 'VALID' : 'NOT_VERIFIED';
}

async function recordVerificationAuditHandler(job) {
  const variables = job.variables || {};

  const {
    productId,
    listingId,
    productName,
    certNumber,
    certReason,
    certCheckedAt
  } = variables;

  // F1a sends certVerified; earlier callers send certValid.
  const verified = typeof variables.certVerified === 'boolean'
    ? variables.certVerified
    : variables.certValid;
  const method = variables.verificationMethod || variables.certVerifiedBy || null;

  if (verified !== true && verified !== false) {
    return job.fail({
      errorMessage: 'Missing or invalid certificate verification result',
      retries: 0
    });
  }

  // A manual decision is recorded as manual, even if the automatic check left a status behind.
  const certStatus = method === 'MANUAL' || typeof variables.certStatus !== 'string' || variables.certStatus.trim() === ''
    ? deriveStatus(verified, method)
    : variables.certStatus;

  const auditRecord = {
    productId: productId || listingId || null,
    productName: productName || null,
    certNumber: certNumber || null,
    certValid: verified,
    certStatus,
    certReason: certReason || null,
    certCheckedAt: certCheckedAt || null,
    certVerifiedBy: method === 'AUTOMATIC' ? 'SERVICE' : (method || 'MANUAL'),
    recordedAt: new Date().toISOString()
  };

  auditRecords.push(auditRecord);

  console.log(
    `[record-verification-audit] ` +
    `product=${auditRecord.productId || 'UNKNOWN'}, ` +
    `status=${certStatus}, valid=${verified}, by=${auditRecord.certVerifiedBy}`
  );

  return job.complete({
    auditRecorded: true,
    auditRecordedAt: auditRecord.recordedAt,
    certValid: verified,
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
