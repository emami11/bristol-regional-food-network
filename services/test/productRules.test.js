const test = require('node:test');
const assert = require('node:assert/strict');
const { validateProduct, interpretCertificate } = require('../src/rules/productRules');

const TODAY = '2026-11-24';
// A complete submission, using the submission form's field keys and option values.
const good = () => ({
  productName: 'Heritage carrots', description: 'Mixed colour carrots, unwashed.', category: 'vegetables',
  price: 2.5, unit: 'kg', quantity: 40, seasonStart: '2026-09-01', seasonEnd: '2027-02-28',
  farmOrigin: 'Chew Valley Farm', farmPostcode: 'BS40 8XQ', harvestDate: '2026-11-22', bestBefore: '2026-12-10',
  containsAllergens: 'no', organicClaimed: false
});
const fields = (r) => r.validationErrors.map(e => e.field);

test('a complete, sensible product is valid', () => {
  const r = validateProduct(good(), TODAY);
  assert.equal(r.isValid, true);
  assert.deepEqual(r.validationErrors, []);
});

test('every missing required field is reported at once', () => {
  const r = validateProduct({}, TODAY);
  assert.equal(r.isValid, false);
  for (const f of ['productName', 'description', 'category', 'price', 'unit', 'quantity', 'farmOrigin', 'farmPostcode',
    'seasonStart', 'seasonEnd', 'harvestDate', 'bestBefore', 'containsAllergens']) {
    assert.ok(fields(r).includes(f), `expected an error for ${f}`);
  }
});

test('price must be above zero with at most 2 decimal places', () => {
  assert.ok(fields(validateProduct({ ...good(), price: 0 }, TODAY)).includes('price'));
  assert.ok(fields(validateProduct({ ...good(), price: -1 }, TODAY)).includes('price'));
  assert.ok(fields(validateProduct({ ...good(), price: 1.999 }, TODAY)).includes('price'));
  assert.equal(validateProduct({ ...good(), price: '3.10' }, TODAY).isValid, true);
});

test('quantity must be a whole number, 0 or more', () => {
  assert.ok(fields(validateProduct({ ...good(), quantity: -5 }, TODAY)).includes('quantity'));
  assert.ok(fields(validateProduct({ ...good(), quantity: 2.5 }, TODAY)).includes('quantity'));
  assert.equal(validateProduct({ ...good(), quantity: 0 }, TODAY).isValid, true);
});

test('best-before must be after harvest, and not already passed', () => {
  assert.ok(fields(validateProduct({ ...good(), bestBefore: '2026-11-20' }, TODAY)).includes('bestBefore'));
  assert.ok(fields(validateProduct({ ...good(), harvestDate: '2026-11-24', bestBefore: '2026-11-24' }, TODAY)).includes('bestBefore'));
});

test('harvest date cannot be in the future', () => {
  assert.ok(fields(validateProduct({ ...good(), harvestDate: '2026-12-01', bestBefore: '2026-12-20' }, TODAY)).includes('harvestDate'));
});

test('season end must not be before season start', () => {
  assert.ok(fields(validateProduct({ ...good(), seasonStart: '2027-03-01', seasonEnd: '2027-02-01' }, TODAY)).includes('seasonEnd'));
});

test('impossible calendar dates are rejected', () => {
  assert.ok(fields(validateProduct({ ...good(), harvestDate: '2026-02-30' }, TODAY)).includes('harvestDate'));
});

test('category, unit and postcode must be valid', () => {
  assert.ok(fields(validateProduct({ ...good(), category: 'cakes' }, TODAY)).includes('category'));
  assert.ok(fields(validateProduct({ ...good(), unit: 'tonne' }, TODAY)).includes('unit'));
  assert.ok(fields(validateProduct({ ...good(), farmPostcode: 'NOT A CODE' }, TODAY)).includes('farmPostcode'));
  assert.equal(validateProduct({ ...good(), farmPostcode: 'bs14dj' }, TODAY).isValid, true);
});

test('allergens: "yes" needs at least one ticked, from the 14', () => {
  assert.ok(fields(validateProduct({ ...good(), containsAllergens: 'yes' }, TODAY)).includes('allergens'));
  assert.ok(fields(validateProduct({ ...good(), containsAllergens: 'yes', allergens: [] }, TODAY)).includes('allergens'));
  assert.ok(fields(validateProduct({ ...good(), containsAllergens: 'yes', allergens: ['milk', 'glitter'] }, TODAY)).includes('allergens'));
  assert.equal(validateProduct({ ...good(), containsAllergens: 'yes', allergens: ['milk', 'eggs'] }, TODAY).isValid, true);
  assert.equal(validateProduct({ ...good(), containsAllergens: 'no' }, TODAY).isValid, true);
});

test('certificate details are required only when organic is claimed', () => {
  const r = validateProduct({ ...good(), organicClaimed: true }, TODAY);
  assert.deepEqual(fields(r).sort(), ['certBody', 'certExpiry', 'certNumber']);
  const ok = validateProduct({ ...good(), organicClaimed: true, certNumber: 'BOS-1001', certBody: 'soil-association', certExpiry: '2027-12-31' }, TODAY);
  assert.equal(ok.isValid, true);
  const expired = validateProduct({ ...good(), organicClaimed: true, certNumber: 'BOS-1001', certBody: 'soil-association', certExpiry: '2026-01-01' }, TODAY);
  assert.ok(fields(expired).includes('certExpiry'));
});

test('certificate answers map to certVerified, certStatus and a readable certReason', () => {
  const valid = { status: 'VALID', expiry: '2027-12-31', body: 'Soil Association Certification (simulated)', bodyCode: 'soil-association' };
  let r = interpretCertificate(valid, 'BOS-1001', 'soil-association', TODAY);
  assert.equal(r.certVerified, true);
  assert.equal(r.certStatus, 'VALID');
  assert.match(r.certReason, /valid until 2027-12-31/);

  assert.equal(interpretCertificate({ ...valid, expiry: '2026-01-01' }, 'BOS-1001', 'soil-association', TODAY).certStatus, 'EXPIRED');
  assert.equal(interpretCertificate({ ...valid, status: 'EXPIRED' }, 'BOS-1001', 'soil-association', TODAY).certStatus, 'EXPIRED');
  assert.equal(interpretCertificate({ ...valid, status: 'REVOKED' }, 'BOS-1001', 'soil-association', TODAY).certStatus, 'REVOKED');
  assert.equal(interpretCertificate(valid, 'BOS-1001', 'ofg', TODAY).certStatus, 'BODY_MISMATCH');

  r = interpretCertificate(null, 'NOPE-1', 'ofg', TODAY);
  assert.equal(r.certVerified, false);
  assert.equal(r.certStatus, 'NOT_FOUND');
  assert.match(r.certReason, /NOPE-1 was not found/);
});
