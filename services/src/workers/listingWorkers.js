// Job handlers for the F1 service tasks that store a listing:
//   save-draft-listing  F1 "Save draft listing"
//   publish-product     F1 "Publish product listing"
//   archieve-listing    F1 "Archive draft listing" (job type spelled as in the model)
// They use the simulated listing store in ../store/listings.js.

const store = require('../store/listings');

// Job type: save-draft-listing
// Runs on the first submission and again after every correction, so the listing keeps
// the same listingId. Writes listingId and listingStatus.
async function saveDraftListingHandler(job) {
  const listing = store.saveDraft(job.variables);
  return job.complete({ listingId: listing.listingId, listingStatus: listing.status });
}

// Job type: publish-product
// Marks the listing PUBLISHED with the availability decided by the availability-status
// decision ("Determine initial availability", result variable availability).
// productId is set to the listing ID so F2 can find the product later.
async function publishProductHandler(job) {
  const { listingId, availability } = job.variables;
  const availabilityStatus = availability?.status ?? null;
  const ordersOpen = availability?.ordersOpen ?? false;
  const listing = store.setStatus(listingId, 'PUBLISHED', {
    availabilityStatus, ordersOpen, publishedAt: new Date().toISOString()
  });
  if (!listing) {
    // Not a business outcome: something is wrong with the data, so raise an incident in Operate.
    return job.fail({ errorMessage: `No listing ${listingId} to publish`, retries: 0 });
  }
  return job.complete({
    listingStatus: listing.status,
    productId: listing.listingId,
    availabilityStatus,
    ordersOpen,
    publishedAt: listing.publishedAt
  });
}

// Job type: archieve-listing
// The producer didn't correct the listing in time. The draft is kept, marked ARCHIVED,
// so it isn't shown to customers but could be resubmitted.
async function archiveListingHandler(job) {
  const { listingId } = job.variables;
  const listing = store.setStatus(listingId, 'ARCHIVED', { archivedAt: new Date().toISOString() });
  if (!listing) {
    return job.fail({ errorMessage: `No listing ${listingId} to archive`, retries: 0 });
  }
  return job.complete({ listingStatus: listing.status, archivedAt: listing.archivedAt });
}

module.exports = { saveDraftListingHandler, publishProductHandler, archiveListingHandler };
