// Job handlers for the F1 and F1a service tasks that check a product.
// Each handler receives a Camunda job and must finish it with job.complete(...),
// job.error(...) (a BPMN error the model can catch) or job.fail(...) (an incident).
// They are kept separate from the Camunda connection so they can be tested with a fake job.
//
// Variable names match the models in bpmn/operational:
//   F1 "Details valid" gateway tests isValid
//   F1a "Request certificate verification" maps certVerified and certReason
//   F1a "Service Unavailable" error boundary catches CERT_SERVICE_UNAVAILABLE

const { validateProduct, interpretCertificate } = require('../rules/productRules');

// Job type: validate-product (F1 "Validate product details")
// Writes isValid, validationErrors (a list of messages, shown on the correction form)
// and validationFields (the form keys that need fixing).
async function validateProductHandler(job, { today } = {}) {
  const result = validateProduct(job.variables, today);
  return job.complete({
    isValid: result.isValid,
    validationErrors: result.validationErrors.map(e => e.message),
    validationFields: result.validationErrors.map(e => e.field)
  });
}

// Job type: verify-certificate (F1a "Request certificate verification")
// Asks the simulated certification service about certNumber and writes certVerified,
// certReason, certStatus and certCheckedAt. If the service can't be reached after a few
// tries it throws the BPMN error CERT_SERVICE_UNAVAILABLE, which F1a catches and sends
// to "Review certificate manually".
function makeVerifyCertificateHandler({
  baseUrl = process.env.CERT_SERVICE_URL || 'http://localhost:4010',
  attempts = Number(process.env.CERT_SERVICE_ATTEMPTS || 3),
  timeoutMs = Number(process.env.CERT_SERVICE_TIMEOUT_MS || 3000),
  retryDelayMs = Number(process.env.CERT_SERVICE_RETRY_DELAY_MS || 1000),
  fetchFn = fetch,
  today
} = {}) {
  return async function verifyCertificateHandler(job) {
    const { organicClaimed, certNumber, certBody } = job.variables;
    if (organicClaimed !== true) {
      // F1 only calls F1a when organic is claimed, but don't break if it's reached anyway.
      return job.complete({ certVerified: false, certStatus: 'NOT_CLAIMED', certReason: 'No organic claim was made.' });
    }

    let lastProblem = 'no attempt made';
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const res = await fetchFn(`${baseUrl}/certificates/${encodeURIComponent(certNumber)}`, {
          signal: AbortSignal.timeout(timeoutMs)
        });
        if (res.status === 404) return finish(job, interpretCertificate(null, certNumber, certBody, today));
        if (res.ok) return finish(job, interpretCertificate(await res.json(), certNumber, certBody, today));
        lastProblem = `service replied ${res.status}`;
      } catch (err) {
        lastProblem = err.name === 'TimeoutError' ? `no reply within ${timeoutMs} ms` : err.message;
      }
      if (attempt < attempts) await new Promise(r => setTimeout(r, retryDelayMs));
    }

    return job.error({
      errorCode: 'CERT_SERVICE_UNAVAILABLE',
      errorMessage: `Certification service unavailable after ${attempts} attempts: ${lastProblem}`,
      variables: { certStatus: 'SERVICE_UNAVAILABLE', certCheckedAt: new Date().toISOString() }
    });
  };
}

function finish(job, outcome) {
  return job.complete({ ...outcome, certCheckedAt: new Date().toISOString() });
}

module.exports = { validateProductHandler, makeVerifyCertificateHandler };
