// Job handlers for the F1 service tasks.
// Each handler receives a Camunda job and must finish it with job.complete(...),
// job.error(...) (a BPMN error the model can catch) or job.fail(...) (an incident).
// They are kept separate from the Camunda connection so they can be tested with a fake job.

const { validateProduct, summariseErrors, interpretCertificate } = require('../rules/productRules');

// Job type: validate-product
// Reads the product form variables, writes dataValid, validationErrors, validationSummary.
async function validateProductHandler(job, { today } = {}) {
  const result = validateProduct(job.variables, today);
  return job.complete({
    dataValid: result.dataValid,
    validationErrors: result.validationErrors,
    validationSummary: summariseErrors(result.validationErrors)
  });
}

// Job type: verify-certificate
// Asks the certification service about certNumber and writes certValid, certStatus,
// certCheckedAt, certVerifiedBy. If the service can't be reached after a few tries it throws
// the BPMN error CERT_SERVICE_DOWN, which an error boundary event in the model can catch.
function makeVerifyCertificateHandler({
  baseUrl = process.env.CERT_SERVICE_URL || 'http://localhost:4010',
  attempts = Number(process.env.CERT_SERVICE_ATTEMPTS || 3),
  timeoutMs = Number(process.env.CERT_SERVICE_TIMEOUT_MS || 3000),
  retryDelayMs = Number(process.env.CERT_SERVICE_RETRY_DELAY_MS || 1000),
  fetchFn = fetch,
  today
} = {}) {
  return async function verifyCertificateHandler(job) {
    const { organicClaimed, certNumber } = job.variables;
    if (organicClaimed !== true) {
      // Shouldn't be reached if the model skips this task, but don't break if it is.
      return job.complete({ certValid: null, certStatus: 'NOT_CLAIMED' });
    }

    let lastProblem = 'no attempt made';
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const res = await fetchFn(`${baseUrl}/certificates/${encodeURIComponent(certNumber)}`, {
          signal: AbortSignal.timeout(timeoutMs)
        });
        if (res.status === 404) return finish(job, interpretCertificate(null, today));
        if (res.ok) return finish(job, interpretCertificate(await res.json(), today));
        lastProblem = `service replied ${res.status}`;
      } catch (err) {
        lastProblem = err.name === 'TimeoutError' ? `no reply within ${timeoutMs} ms` : err.message;
      }
      if (attempt < attempts) await new Promise(r => setTimeout(r, retryDelayMs));
    }

    return job.error({
      errorCode: 'CERT_SERVICE_DOWN',
      errorMessage: `Certification service unavailable after ${attempts} attempts: ${lastProblem}`,
      variables: { certStatus: 'SERVICE_DOWN', certCheckedAt: new Date().toISOString() }
    });
  };
}

function finish(job, outcome) {
  return job.complete({ ...outcome, certCheckedAt: new Date().toISOString(), certVerifiedBy: 'SERVICE' });
}

module.exports = { validateProductHandler, makeVerifyCertificateHandler };
