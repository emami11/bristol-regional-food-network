// Business rules for F1 (Product Listing and Validation).
// Pure functions with no Camunda code in them, so they can be unit tested on their own
// and explained line by line.
//
// Field names are the keys of the Camunda forms in camunda/forms/product-submission.form
// and product-correction.form. If a form key changes, change it here too.

// Values of the "Category" select on the submission form.
const CATEGORIES = ['vegetables', 'fruit', 'dairy', 'bakery', 'preserves', 'meat', 'seasonal'];

// Values of the "Sold per" select.
const UNITS = ['kg', 'each', '500g', 'bunch', 'jar', 'loaf', 'dozen', 'litre'];

// Values of the "Allergens present" checklist: the 14 allergens UK food information
// rules require to be declared.
const ALLERGENS = [
  'celery', 'gluten', 'crustaceans', 'eggs', 'fish', 'lupin', 'milk',
  'molluscs', 'mustard', 'peanuts', 'nuts', 'sesame', 'soya', 'sulphites'
];

// Values of the "Certification body" select.
const CERT_BODIES = ['soil-association', 'ofg', 'off', 'other'];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// UK postcode, e.g. BS1 4DJ or BS14DJ (case and the space don't matter).
const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

// True when value is a real calendar date written as YYYY-MM-DD.
function isDate(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

// Camunda Forms send numbers as numbers, but accept numeric strings too.
function toNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return NaN;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Checks a product submission against every F1 validation rule.
 * Returns ALL problems at once, so the producer can fix everything in one go.
 *
 * @param {object} p      process variables from the product form
 * @param {string} today  YYYY-MM-DD; passed in so tests can fix the date
 * @returns {{ isValid: boolean, validationErrors: {field: string, message: string}[] }}
 */
function validateProduct(p, today = todayISO()) {
  const errors = [];
  const add = (field, message) => errors.push({ field, message });

  // Product name, description, category
  if (isBlank(p.productName)) add('productName', 'Product name is required.');
  else if (String(p.productName).trim().length < 3 || String(p.productName).length > 80) {
    add('productName', 'Product name must be 3 to 80 characters.');
  }

  if (isBlank(p.description)) add('description', 'Description is required.');
  else if (String(p.description).length > 1000) add('description', 'Description must be 1000 characters or fewer.');

  if (isBlank(p.category)) add('category', 'Category is required.');
  else if (!CATEGORIES.includes(p.category)) add('category', 'Choose a category from the list.');

  // Price: above zero, pounds and pence only
  const price = toNumber(p.price);
  if (isBlank(p.price)) add('price', 'Price is required.');
  else if (!Number.isFinite(price) || price <= 0) add('price', 'Price must be more than £0.00.');
  else if (Math.round(price * 100) !== price * 100) add('price', 'Price can have at most 2 decimal places.');

  if (isBlank(p.unit)) add('unit', 'Choose what the price is per (e.g. kg, each).');
  else if (!UNITS.includes(p.unit)) add('unit', 'Choose a unit from the list.');

  // Quantity: a whole number, zero or more
  const qty = toNumber(p.quantity);
  if (isBlank(p.quantity)) add('quantity', 'Available quantity is required.');
  else if (!Number.isInteger(qty) || qty < 0) add('quantity', 'Available quantity must be a whole number, 0 or more.');

  // Farm
  if (isBlank(p.farmOrigin)) add('farmOrigin', 'Farm name is required.');
  if (isBlank(p.farmPostcode)) add('farmPostcode', 'Farm postcode is required.');
  else if (!POSTCODE_RE.test(String(p.farmPostcode).trim())) add('farmPostcode', 'Farm postcode must be a valid UK postcode.');

  // Dates
  const dateFields = {
    seasonStart: 'Available from', seasonEnd: 'Available until',
    harvestDate: 'Harvest date', bestBefore: 'Best-before date'
  };
  for (const [field, label] of Object.entries(dateFields)) {
    if (isBlank(p[field])) add(field, `${label} is required.`);
    else if (!isDate(p[field])) add(field, `${label} must be a real date.`);
  }
  if (isDate(p.seasonStart) && isDate(p.seasonEnd) && p.seasonEnd < p.seasonStart) {
    add('seasonEnd', 'Available until must be on or after Available from.');
  }
  if (isDate(p.harvestDate) && p.harvestDate > today) add('harvestDate', 'Harvest date cannot be in the future.');
  if (isDate(p.bestBefore) && p.bestBefore < today) add('bestBefore', 'Best-before date has already passed.');
  if (isDate(p.harvestDate) && isDate(p.bestBefore) && p.bestBefore <= p.harvestDate) {
    add('bestBefore', 'Best-before date must be after the harvest date.');
  }

  // Allergens. The form hides the checklist unless the producer answers "yes",
  // and hidden fields aren't sent, so "no" arrives without an allergens list.
  if (p.containsAllergens === 'yes') {
    if (!Array.isArray(p.allergens) || p.allergens.length === 0) {
      add('allergens', 'You said the product contains allergens: tick which ones.');
    } else {
      const unknown = p.allergens.filter(a => !ALLERGENS.includes(a));
      if (unknown.length) add('allergens', `Unknown allergen(s): ${unknown.join(', ')}.`);
    }
  } else if (p.containsAllergens !== 'no') {
    add('containsAllergens', 'Say whether the product contains any of the 14 major allergens.');
  }

  // Organic certificate details, only when organic is claimed
  if (p.organicClaimed === true) {
    if (isBlank(p.certBody)) add('certBody', 'Certification body is required for organic products.');
    else if (!CERT_BODIES.includes(p.certBody)) add('certBody', 'Choose a certification body from the list.');
    if (isBlank(p.certNumber)) add('certNumber', 'Certificate number is required for organic products.');
    if (isBlank(p.certExpiry)) add('certExpiry', 'Certificate expiry date is required for organic products.');
    else if (!isDate(p.certExpiry)) add('certExpiry', 'Certificate expiry date must be a real date.');
    else if (p.certExpiry < today) add('certExpiry', 'This certificate has already expired.');
  }

  return { isValid: errors.length === 0, validationErrors: errors };
}

/**
 * Turns the certification service's answer into the variables F1a uses:
 * certVerified (true/false) and certReason (a sentence the producer can read).
 *
 * @param {object|null} record     the certificate from the service, or null if not found
 * @param {string}      certNumber what the producer entered
 * @param {string}      certBody   the body the producer chose on the form
 */
function interpretCertificate(record, certNumber, certBody, today = todayISO()) {
  if (!record) {
    return { certVerified: false, certStatus: 'NOT_FOUND', certReason: `Certificate ${certNumber} was not found by the certification service.` };
  }
  if (record.status === 'REVOKED') {
    return { certVerified: false, certStatus: 'REVOKED', certReason: `Certificate ${certNumber} has been revoked by ${record.body}.` };
  }
  if (record.status === 'EXPIRED' || (record.expiry && record.expiry < today)) {
    return { certVerified: false, certStatus: 'EXPIRED', certReason: `Certificate ${certNumber} expired on ${record.expiry}.` };
  }
  if (certBody && record.bodyCode && certBody !== record.bodyCode) {
    return { certVerified: false, certStatus: 'BODY_MISMATCH', certReason: `Certificate ${certNumber} was issued by ${record.body}, not the certification body you chose.` };
  }
  if (record.status === 'VALID') {
    return { certVerified: true, certStatus: 'VALID', certReason: `Certificate ${certNumber} is valid until ${record.expiry}.` };
  }
  return { certVerified: false, certStatus: 'UNKNOWN', certReason: `The certification service could not confirm certificate ${certNumber}.` };
}

module.exports = {
  CATEGORIES, UNITS, ALLERGENS, CERT_BODIES,
  isDate, validateProduct, interpretCertificate, todayISO
};
