// Simulated producer notification for BRFN Sprint 3.
// No real emails are sent: the message is logged and stored as process variables.
//
// One job type, notify-producer, is used by four send tasks. The task header "template"
// says which message to send:
//   STATUS_CHANGED       F2a "Notify producer of new status"
//   PRODUCT_LIVE         F1  "Notify producer product live"
//   CORRECTION_REMINDER  F1  "Send correction reminder"
//   LISTING_ARCHIVED     F1  "Notify producer listing archieved"
// If a task has no template header, it is worked out from the listing status instead.

const F1_TEMPLATES = ['PRODUCT_LIVE', 'CORRECTION_REMINDER', 'LISTING_ARCHIVED'];

function chooseTemplate(job) {
  const fromHeader = job.customHeaders?.template;
  if (fromHeader) return fromHeader;
  const listingStatus = job.variables?.listingStatus;
  if (listingStatus === 'PUBLISHED') return 'PRODUCT_LIVE';
  if (listingStatus === 'DRAFT') return 'CORRECTION_REMINDER';
  if (listingStatus === 'ARCHIVED') return 'LISTING_ARCHIVED';
  return 'STATUS_CHANGED';
}

function f1Message(template, variables) {
  const name = variables.productName || 'your product';
  const ref = variables.listingId;
  switch (template) {
    case 'PRODUCT_LIVE':
      return `${name} (${ref}) is now live on BRFN. Availability: ${variables.availability?.status ?? 'not set'}.`;
    case 'CORRECTION_REMINDER':
      return `Reminder: your listing ${name} (${ref}) still needs corrections. ` +
        'It will be archived if it is not corrected in time.';
    case 'LISTING_ARCHIVED':
      return `Your draft listing ${name} (${ref}) was archived because it was not corrected in time. ` +
        'You can submit it again at any time.';
    default:
      return null;
  }
}

async function notifyProducerHandler(job) {
  const variables = job.variables || {};
  const template = chooseTemplate(job);

  let message;

  if (F1_TEMPLATES.includes(template)) {
    // F1 messages are about a listing.
    if (!variables.listingId) {
      return job.fail({ errorMessage: `Missing listingId for ${template} notification`, retries: 0 });
    }
    message = f1Message(template, variables);
  } else {
    // F2a STATUS_CHANGED: the product's availability has changed.
    const productId = variables.productId;
    const productName = variables.productName || productId;
    const status = variables.availability?.status;

    if (!productId || !status) {
      return job.fail({
        errorMessage: 'Missing product or availability status',
        retries: 0
      });
    }

    message = `${productName} (${productId}) is now ${status}.`;
  }

  message = `BRFN notification: ${message}`;
  console.log(`[notify-producer] ${template}: ${message}`);

  return job.complete({
    notificationSent: false,
    notificationSimulated: true,
    notificationTemplate: template,
    notificationMessage: message
  });
}

module.exports = { notifyProducerHandler };
