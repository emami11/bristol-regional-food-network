const test = require('node:test');
const assert = require('node:assert/strict');
const { validateProduct, interpretCertificate } = require('../src/rules/productRules');

const TODAY = '2026-11-03';
const good = () => ({
  name: 'Heritage carrots', description: 'Mixed colour carrots, unwashed.', category: 'Vegetables',
  price: 2.5, quantity: 40, farmOrigin: 'Chew Valley', harvestDate: '2026-11-01', bestBeforeDate: '2026-11-20',
  availableFrom: '2026-09-01', availableTo: '2027-02-28', allergens: [], organicClaimed: false
});
const fields = (r) => r.validationErrors.map(e => e.field);

test('a complete, sensible product is valid', () => {
  const r = validateProduct(good(), TODAY);
  assert.equal(r.dataValid, true);
  assert.deepEqual(r.validationErrors, []);
});

test('every missing required field is reported at once', () => {
  const r = validateProduct({}, TODAY);
  assert.equal(r.dataValid, false);
  for (const f of ['name', 'description', 'farmOrigin', 'category', 'price', 'quantity', 'harvestDate', 'bestBeforeDate', 'availableFrom', 'availableTo', 'allergens']) {
    assert.ok(fields(r).includes(f), `expected an error for ${f}`);
  }
});

test('price must be above zero with at most 2 decimal places', () => {
  assert.ok(fields(validateProduct({ ...good(), price: 0 }, TODAY)).includes('price'));
  assert.ok(fields(validateProduct({ ...good(), price: -1 }, TODAY)).includes('price'));
  assert.ok(fields(validateProduct({ ...good(), price: 1.999 }, TODAY)).includes('price'));
  assert.equal(validateProduct({ ...good(), price: '3.10' }, TODAY).dataValid, true);
});

test('quantity must be a whole number, 0 or more', () => {
  assert.ok(fields(validateProduct({ ...good(), quantity: -5 }, TODAY)).includes('quantity'));
  assert.ok(fields(validateProduct({ ...good(), quantity: 2.5 }, TODAY)).includes('quantity'));
  assert.equal(validateProduct({ ...good(), quantity: 0 }, TODAY).dataValid, true);
});

test('best-before must be after harvest, and not already passed', () => {
  assert.ok(fields(validateProduct({ ...good(), bestBeforeDate: '2026-10-30' }, TODAY)).includes('bestBeforeDate'));
  assert.ok(fields(validateProduct({ ...good(), harvestDate: '2026-11-02', bestBeforeDate: '2026-11-02' }, TODAY)).includes('bestBeforeDate'));
});

test('harvest date cannot be in the future', () => {
  assert.ok(fields(validateProduct({ ...good(), harvestDate: '2026-12-01', bestBeforeDate: '2026-12-20' }, TODAY)).includes('harvestDate'));
});

test('season end must not be before season start', () => {
  assert.ok(fields(validateProduct({ ...good(), availableFrom: '2027-03-01', availableTo: '2027-02-01' }, TODAY)).includes('availableTo'));
});

test('impossible calendar dates are rejected', () => {
  assert.ok(fields(validateProduct({ ...good(), harvestDate: '2026-02-30' }, TODAY)).includes('harvestDate'));
});

test('category and allergens must come from the lists', () => {
  assert.ok(fields(validateProduct({ ...good(), category: 'Cakes' }, TODAY)).includes('category'));
  assert.ok(fields(validateProduct({ ...good(), allergens: ['milk', 'glitter'] }, TODAY)).includes('allergens'));
  assert.equal(validateProduct({ ...good(), allergens: ['milk', 'eggs'] }, TODAY).dataValid, true);
});

test('certificate details are required only when organic is claimed', () => {
  const r = validateProduct({ ...good(), organicClaimed: true }, TODAY);
  assert.deepEqual(fields(r).sort(), ['certBody', 'certExpiry', 'certNumber']);
  const ok = validateProduct({ ...good(), organicClaimed: true, certNumber: 'BOS-1001', certBody: 'BOS', certExpiry: '2027-12-31' }, TODAY);
  assert.equal(ok.dataValid, true);
  const expired = validateProduct({ ...good(), organicClaimed: true, certNumber: 'BOS-1001', certBody: 'BOS', certExpiry: '2026-01-01' }, TODAY);
  assert.ok(fields(expired).includes('certExpiry'));
});

test('certificate answers map to certValid and certStatus', () => {
  assert.deepEqual(interpretCertificate({ status: 'VALID', expiry: '2027-12-31' }, TODAY), { certValid: true, certStatus: 'VALID' });
  assert.deepEqual(interpretCertificate({ status: 'VALID', expiry: '2026-01-01' }, TODAY), { certValid: false, certStatus: 'EXPIRED' });
  assert.deepEqual(interpretCertificate({ status: 'EXPIRED', expiry: '2025-09-30' }, TODAY), { certValid: false, certStatus: 'EXPIRED' });
  assert.deepEqual(interpretCertificate({ status: 'REVOKED', expiry: '2027-03-31' }, TODAY), { certValid: false, certStatus: 'REVOKED' });
  assert.deepEqual(interpretCertificate(null, TODAY), { certValid: false, certStatus: 'NOT_FOUND' });
});
