const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Catalogue } = require('../src/demo/store');
const { validateProduct } = require('../src/rules/productRules');

function catalogue(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'brfn-stock-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const filename = path.join(dir, 'catalogue.json');
  const store = new Catalogue(filename);
  store.publish({ productId: 'p1', name: 'Carrots', quantity: 5, price: 2.3, organicClaimed: false,
    availableFrom: '2026-01-01', availableTo: '2026-12-31', availabilityStatus: 'AVAILABLE' });
  return { store, filename };
}
test('stock messages apply once, including after a store restart', t => {
  let { store, filename } = catalogue(t);
  store.apply({ productId: 'p1', updateKind: 'ORDER', orderId: 'order-1', quantityChange: -2 });
  store = new Catalogue(filename);
  const result = store.apply({ productId: 'p1', updateKind: 'ORDER', orderId: 'order-1', quantityChange: -2 });
  assert.equal(result.duplicateOrder, true);
  assert.equal(store.get('p1').quantity, 3);
});
test('overselling clamps quantity to zero and flags the producer', t => {
  const { store } = catalogue(t);
  const result = store.apply({ productId: 'p1', updateKind: 'ORDER', orderId: 'order-2', quantityChange: -9 });
  assert.equal(result.oversold, true);
  assert.equal(result.quantity, 0);
  assert.equal(store.get('p1').orderable, false);
});
test('moving a product out of season closes ordering before DMN finishes', t => {
  const { store } = catalogue(t);
  store.apply({ productId: 'p1', updateKind: 'PRODUCER', newQuantity: 9, availableFrom: '2000-01-01', availableTo: '2000-12-31' });
  assert.equal(store.get('p1').orderable, false);
});
test('invalid producer stock or seasons never mutate stored inventory', t => {
  const { store } = catalogue(t);
  for (const input of [{ newQuantity: -1, availableFrom: '2026-01-01', availableTo: '2026-12-31' },
    { newQuantity: 9, availableFrom: '2026-12-31', availableTo: '2026-01-01' }]) {
    assert.equal(store.apply({ productId: 'p1', updateKind: 'PRODUCER', ...input }).stockUpdateValid, false);
    assert.equal(store.get('p1').quantity, 5);
  }
});
test('retrying F1 publication does not overwrite subsequent stock changes', t => {
  const { store } = catalogue(t);
  store.apply({ productId: 'p1', updateKind: 'ORDER', orderId: 'o3', quantityChange: -2 });
  store.publish({ productId: 'p1', quantity: 5, organicClaimed: false });
  assert.equal(store.get('p1').quantity, 3);
});
test('publication blocks an unaccepted organic claim', t => {
  const { store } = catalogue(t);
  assert.throws(() => store.publish({ productId: 'p2', organicClaimed: true, certValid: false }), /blocked/);
});
test('normal decimal prices are accepted without floating-point false rejections', () => {
  for (const price of [0.29, 2.3, 4.1, '3.10']) {
    const result = validateProduct({ price, organicClaimed: false });
    assert.equal(result.validationErrors.some(e => e.field === 'price'), false, String(price));
  }
});
test('text organic flags cannot silently skip certification validation', () => {
  const result = validateProduct({ organicClaimed: 'true' });
  assert.ok(result.validationErrors.some(e => e.field === 'organicClaimed'));
});
