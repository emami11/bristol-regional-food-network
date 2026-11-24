// Simulated producer notification for BRFN Sprint 3.
// No real emails are sent.

async function notifyProducerHandler(job) {
  const variables = job.variables || {};

  const productId = variables.productId;
  const productName = variables.productName || productId;
  const status = variables.availability?.status;

  if (!productId || !status) {
    return job.fail({
      errorMessage: 'Missing product or availability status',
      retries: 0
    });
  }

  const message =
    `BRFN notification: ${productName} ` +
    `(${productId}) is now ${status}.`;

  console.log(`[notify-producer] ${message}`);

  return job.complete({
    notificationSent: false,
    notificationSimulated: true,
    notificationMessage: message
  });
}

module.exports = { notifyProducerHandler };
