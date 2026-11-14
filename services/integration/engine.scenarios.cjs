// These checks deploy no fake engine: they drive real Camunda instances, user
// tasks, workers, BPMN errors, message subscriptions, timers and the shared DMN.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { engineRequest, searchTasks, completeTask } = require('../src/demo/engine-api');
const base = process.env.BRFN_DEMO_URL || 'http://127.0.0.1:8790';
const used = new Set(), instances = [], products = [], evidence = [];
const day = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
async function api(route, data) {
  const res = await fetch(base + route, data === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result = await res.json();if (!res.ok) throw new Error(JSON.stringify(result));return result;
}
async function wait(fn, label, timeout = 35000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) { const result = await fn();if (result) return result;await new Promise(r => setTimeout(r, 250)); }
  throw new Error('Timed out: ' + label);
}
async function task(key, element) {
  return wait(async () => (await searchTasks(key)).items.find(t => t.elementId === element && !used.has(t.userTaskKey)), element);
}
async function complete(t, variables = {}) { await completeTask(t.userTaskKey, variables);used.add(t.userTaskKey); }
async function listing(variables = {}) {
  const p = await api('/api/start-listing', { name: 'Engine test carrots', ...variables });
  instances.push(p.processInstanceKey);products.push(p.productId);
  await complete(await task(p.processInstanceKey, 'F1_Submit'));
  return p;
}
async function product(id, predicate = () => true) {
  return wait(async () => (await api('/api/products')).find(p => p.productId === id && predicate(p)), 'catalogue update ' + id);
}
async function published(p) { return product(p.productId, r => r.listingState === 'PUBLISHED' && r.inventoryInstanceKey); }
async function stock(p, changes) {
  await api(`/api/products/${p.productId}/update`, {});
  const t = await task(p.inventoryInstanceKey, 'F2_StockForm');
  const v = (await product(p.productId)).version;
  await complete(t, changes);
  return product(p.productId, r => r.version > v);
}
async function check(name, fn) {
  const started = Date.now();await fn();evidence.push({ name, passed: true, durationMs: Date.now() - started });console.log('PASS ' + name);
}
async function main() {
  await api('/health');
  let current;
  await check('F1: non-organic publication and asynchronous F2 start', async () => {
    current = await published(await listing());assert.equal(current.availabilityStatus, 'AVAILABLE');assert.equal(current.orderable, true);
  });
  await check('F1: invalid details wait for correction before publication', async () => {
    const p = await listing({ name: 'X' });const t = await task(p.processInstanceKey, 'F1_Correct');
    assert.equal((await api('/api/products')).some(r => r.productId === p.productId), false);
    await complete(t, { name: 'Corrected carrots', correctionAction: 'RESUBMIT' });await published(p);
  });
  await check('F1: valid organic certificate is verified by the mock service', async () => {
    const p = await published(await listing({ organicClaimed: true }));assert.equal(p.certValid, true);assert.equal(p.certVerifiedBy, 'SERVICE');
  });
  await check('F1: revoked certificate loops back; removing the organic claim allows publication', async () => {
    const p = await listing({ organicClaimed: true, certNumber: 'WCO-3001' });
    await complete(await task(p.processInstanceKey, 'F1_Correct'), { organicClaimed: false, correctionAction: 'RESUBMIT' });
    const r = await published(p);assert.equal(r.organicClaimed, false);assert.equal(r.certStatus, 'NOT_CLAIMED');
  });
  await check('F1: outage is caught and admin approval resumes the process', async () => {
    await fetch('http://127.0.0.1:4010/admin/outage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"down":true}' });
    try {
      const p = await listing({ organicClaimed: true });
      await complete(await task(p.processInstanceKey, 'F1_Admin'), { adminDecision: 'APPROVE', adminReason: 'Evidence reviewed for the local demonstration.' });
      const r = await published(p);assert.equal(r.certStatus, 'ADMIN_APPROVED');assert.equal(r.certVerifiedBy, 'ADMIN');
    } finally { await fetch('http://127.0.0.1:4010/admin/outage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"down":false}' }); }
  });
  await check('F1: a producer can withdraw an invalid listing', async () => {
    const p = await listing({ name: 'X' });await complete(await task(p.processInstanceKey, 'F1_Correct'), { correctionAction: 'WITHDRAW' });
    await product(p.productId, r => r.listingState === 'WITHDRAWN' && r.orderable === false);
  });
  await check('F1: abandoned correction is archived by a real timer', async () => {
    const p = await listing({ name: 'X', correctionTimeout: 'PT2S' });await task(p.processInstanceKey, 'F1_Correct');
    await product(p.productId, r => r.listingState === 'ARCHIVED');
  });
  await check('F2: zero stock closes orders', async () => {
    current = await stock(current, { newQuantity: 0, availableFrom: day(-5), availableTo: day(20) });
    await product(current.productId, r => r.availabilityStatus === 'OUT_OF_STOCK' && !r.orderable);
  });
  await check('F2: in-season restocking restores availability', async () => {
    current = await stock(current, { newQuantity: 7, availableFrom: day(-5), availableTo: day(20) });
    await product(current.productId, r => r.availabilityStatus === 'AVAILABLE' && r.orderable);
  });
  await check('F2: restocking outside season remains unavailable', async () => {
    current = await stock(current, { newQuantity: 9, availableFrom: day(-20), availableTo: day(-1) });
    await product(current.productId, r => r.availabilityStatus === 'OUT_OF_SEASON' && !r.orderable);
  });
  await check('F2: future seasons are not yet orderable', async () => {
    current = await stock(current, { newQuantity: 9, availableFrom: day(2), availableTo: day(20) });
    await product(current.productId, r => r.availabilityStatus === 'NOT_YET_IN_SEASON' && !r.orderable);
  });
  await check('F2: invalid stock is rejected and the producer corrects it', async () => {
    await api(`/api/products/${current.productId}/update`, {});
    const before = await product(current.productId);
    await complete(await task(current.inventoryInstanceKey, 'F2_StockForm'), { newQuantity: -4, availableFrom: day(20), availableTo: day(2) });
    const correction = await task(current.inventoryInstanceKey, 'F2_StockForm');
    assert.equal((await product(current.productId)).version, before.version);
    await complete(correction, { newQuantity: 7, availableFrom: day(-5), availableTo: day(20) });
    current = await product(current.productId, r => r.version > before.version && r.availabilityStatus === 'AVAILABLE');
  });
  await check('F2: the stock form preserves current stock after an order', async () => {
    const before = current.quantity;
    await api(`/api/products/${current.productId}/stock-changed`, { orderId: randomUUID(), quantityChange: -2 });
    current = await product(current.productId, r => r.quantity === before - 2);
    current = await stock(current, {});
    assert.equal(current.quantity, before - 2);
  });
  await check('F2: order messages apply once and overselling is flagged', async () => {
    const orderId = randomUUID();const v = current.version;
    await api(`/api/products/${current.productId}/stock-changed`, { orderId, quantityChange: -20 });
    current = await product(current.productId, r => r.version > v && r.availabilityStatus === 'OUT_OF_STOCK');assert.equal(current.quantity, 0);
    await wait(async () => (await api('/api/notifications')).some(n => n.productId === current.productId && n.oversold), 'overselling notification');
    const v2 = current.version;
    await api(`/api/products/${current.productId}/stock-changed`, { orderId, quantityChange: -20 });
    current = await product(current.productId, r => r.version > v2);assert.equal(current.quantity, 0);
    assert.equal(current.processedOrderIds.filter(x => x === orderId).length, 1);
  });
  await check('F2: the daily timer actually fires and schedules the next check', async () => {
    const p = await published(await listing({ seasonCheckDelayMs: 1200 }));
    await wait(async () => (await api('/api/trace')).some(t => t.productId === p.productId && t.elementId === 'F2_Refresh' && t.state === 'COMPLETED'), 'daily timer');
  });
  await check('F2: stop message completes inventory monitoring', async () => {
    await api(`/api/products/${current.productId}/stop`, {});
    await wait(async () => (await engineRequest('/v2/process-instances/search', { filter: { processInstanceKey: current.inventoryInstanceKey, state: 'COMPLETED' } })).items.length, 'F2 completed');
  });
  await check('Both deployed processes have no active incidents', async () => {
    for (const id of ['BRFN_F1_Executable', 'BRFN_F2_Executable']) {
      const r = await engineRequest('/v2/incidents/search', { filter: { processDefinitionId: id, state: 'ACTIVE' }, page: { limit: 100 } });
      assert.equal(r.items.length, 0, JSON.stringify(r.items));
    }
  });
}
main().catch(e => { console.error(e);evidence.push({ passed: false, error: e.message });process.exitCode = 1; }).finally(async () => {
  await fetch('http://127.0.0.1:4010/admin/outage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"down":false}' }).catch(() => {});
  for (const id of products) {
    const p = (await api('/api/products').catch(() => [])).find(p => p.productId === id);
    if (p?.inventoryInstanceKey) await api(`/api/instances/${p.inventoryInstanceKey}/cancel`, {}).catch(() => {});
  }
  for (const key of instances) await api(`/api/instances/${key}/cancel`, {}).catch(() => {});
  const output = path.resolve(__dirname, '../data/engine-test-results.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });fs.writeFileSync(output, JSON.stringify({ checkedAt: new Date().toISOString(), evidence }, null, 2));
  console.log(`${evidence.filter(x => x.passed).length} real-engine checks passed.`);
});
