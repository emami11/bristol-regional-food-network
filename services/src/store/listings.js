// Simulated listing store for F1.
// Keeps product listings in memory while the workers run, so the demo can show a listing
// moving from DRAFT to PUBLISHED or ARCHIVED. It is emptied when the workers restart.
// Task 2 replaces this with the marketplace database; the functions below are the interface
// the workers use, so only this file needs to change.

const listings = new Map();
let nextNumber = 1;

// The product fields from the submission form that are kept on a listing.
const LISTING_FIELDS = [
  'productName', 'description', 'category', 'price', 'unit', 'quantity',
  'seasonStart', 'seasonEnd', 'farmOrigin', 'farmPostcode', 'harvestDate', 'bestBefore',
  'containsAllergens', 'allergens', 'organicClaimed', 'certBody', 'certNumber', 'certExpiry'
];

function pickFields(variables) {
  const out = {};
  for (const f of LISTING_FIELDS) if (variables[f] !== undefined) out[f] = variables[f];
  return out;
}

function newListingId() {
  return `LST-${String(nextNumber++).padStart(4, '0')}`;
}

// Creates a draft, or updates it if the listing already exists (a resubmission after correction).
function saveDraft(variables, now = new Date().toISOString()) {
  const listingId = variables.listingId || newListingId();
  const existing = listings.get(listingId);
  const listing = {
    ...(existing || { createdAt: now }),
    ...pickFields(variables),
    listingId,
    status: 'DRAFT',
    updatedAt: now
  };
  listings.set(listingId, listing);
  return listing;
}

// Changes the status of an existing listing. Returns null if there is no such listing.
function setStatus(listingId, status, extra = {}, now = new Date().toISOString()) {
  const listing = listings.get(listingId);
  if (!listing) return null;
  const updated = { ...listing, ...extra, status, updatedAt: now };
  listings.set(listingId, updated);
  return updated;
}

function getListing(listingId) {
  return listings.get(listingId) || null;
}

// For tests only.
function reset() {
  listings.clear();
  nextNumber = 1;
}

module.exports = { saveDraft, setStatus, getListing, reset, LISTING_FIELDS };
