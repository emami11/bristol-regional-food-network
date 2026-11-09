// Business rules for F1 (Product Listing and Validation).
// Pure functions with no Camunda code in them, so they can be unit tested on their own
// and explained line by line. The rules are documented in
// docs/requirements/business-rules-and-variables.md - keep the two in step.

const CATEGORIES = [
  'Vegetables', 'Fruit', 'Dairy', 'Eggs', 'Meat', 'Fish',
  'Bakery', 'Preserves', 'Drinks', 'Other'
];

// The 14 allergens that UK food information rules require to be declared.
const ALLERGENS = [
  'celery', 'cereals containing gluten', 'crustaceans', 'eggs', 'fish', 'lupin', 'milk',
  'molluscs', 'mustard', 'tree nuts', 'peanuts', 'sesame', 'soya', 'sulphites'
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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
 * @returns {{ dataValid: boolean, validationErrors: {field: string, message: string}[] }}
 */
function validateProduct(p, today = todayISO()) {
  const errors = [];
  const add = (field, message) => errors.push({ field, message });

  // Required text fields
  if (isBlank(p.name)) add('name', 'Product name is required.');
  else if (String(p.name).trim().length < 3 || String(p.name).length > 100) add('name', 'Product name must be 3 to 100 characters.');

  if (isBlank(p.description)) add('description', 'Description is required.');
  else if (String(p.description).length > 1000) add('description', 'Description must be 1000 characters or fewer.');

  if (isBlank(p.farmOrigin)) add('farmOrigin', 'Farm origin is required.');

  // Category from the marketplace's list
  if (isBlank(p.category)) add('category', 'Category is required.');
  else if (!CATEGORIES.includes(p.category)) add('category', `Category must be one of: ${CATEGORIES.join(', ')}.`);

  // Price: above zero, pounds and pence only
  const price = toNumber(p.price);
  if (isBlank(p.price)) add('price', 'Price is required.');
  else if (!Number.isFinite(price) || price <= 0) add('price', 'Price must be more than £0.00.');
  else if (Math.round(price * 100) !== price * 100) add('price', 'Price can have at most 2 decimal places.');

  // Quantity: a whole number, zero or more
  const qty = toNumber(p.quantity);
  if (isBlank(p.quantity)) add('quantity', 'Quantity is required.');
  else if (!Number.isInteger(qty) || qty < 0) add('quantity', 'Quantity must be a whole number, 0 or more.');

  // Dates
  const dateFields = {
    harvestDate: 'Harvest date', bestBeforeDate: 'Best-before date',
    availableFrom: 'Season start', availableTo: 'Season end'
  };
  for (const [field, label] of Object.entries(dateFields)) {
    if (isBlank(p[field])) add(field, `${label} is required.`);
    else if (!isDate(p[field])) add(field, `${label} must be a real date (YYYY-MM-DD).`);
  }
  if (isDate(p.harvestDate) && p.harvestDate > today) add('harvestDate', 'Harvest date cannot be in the future.');
  if (isDate(p.bestBeforeDate) && p.bestBeforeDate < today) add('bestBeforeDate', 'Best-before date has already passed.');
  if (isDate(p.harvestDate) && isDate(p.bestBeforeDate) && p.bestBeforeDate <= p.harvestDate) {
    add('bestBeforeDate', 'Best-before date must be after the harvest date.');
  }
  if (isDate(p.availableFrom) && isDate(p.availableTo) && p.availableTo < p.availableFrom) {
    add('availableTo', 'Season end must be on or after the season start.');
  }

  // Allergens: a list (empty means "contains none of the 14"), each from the UK list
  if (p.allergens === undefined || p.allergens === null) add('allergens', 'Allergens must be declared (choose none if it contains none).');
  else if (!Array.isArray(p.allergens)) add('allergens', 'Allergens must be a list.');
  else {
    const unknown = p.allergens.filter(a => !ALLERGENS.includes(a));
    if (unknown.length) add('allergens', `Unknown allergen(s): ${unknown.join(', ')}.`);
  }

  // Organic certificate details, only when organic is claimed
  if (p.organicClaimed === true) {
    if (isBlank(p.certNumber)) add('certNumber', 'Certificate number is required for organic products.');
    if (isBlank(p.certBody)) add('certBody', 'Certifying body is required for organic products.');
    if (isBlank(p.certExpiry)) add('certExpiry', 'Certificate expiry date is required for organic products.');
    else if (!isDate(p.certExpiry)) add('certExpiry', 'Certificate expiry must be a real date (YYYY-MM-DD).');
    else if (p.certExpiry < today) add('certExpiry', 'This certificate has already expired.');
  }

  return { dataValid: errors.length === 0, validationErrors: errors };
}

// One readable line per error, for showing in a Camunda Form text field.
function summariseErrors(errors) {
  return errors.map(e => `• ${e.message}`).join('\n');
}

/**
 * Turns the certification service's answer into the variables the process uses.
 * @param {object|null} record  the certificate from the service, or null if not found
 */
function interpretCertificate(record, today = todayISO()) {
  if (!record) return { certValid: false, certStatus: 'NOT_FOUND' };
  if (record.status === 'REVOKED') return { certValid: false, certStatus: 'REVOKED' };
  if (record.status === 'EXPIRED' || (record.expiry && record.expiry < today)) {
    return { certValid: false, certStatus: 'EXPIRED' };
  }
  if (record.status === 'VALID') return { certValid: true, certStatus: 'VALID' };
  return { certValid: false, certStatus: 'UNKNOWN' };
}

module.exports = { CATEGORIES, ALLERGENS, isDate, validateProduct, summariseErrors, interpretCertificate, todayISO };
