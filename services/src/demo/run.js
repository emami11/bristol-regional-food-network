require('dotenv').config();
const express = require('express');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { createApp } = require('../cert-mock/server');
const { createRuntime, modelDirectory } = require('./runtime');
const { searchTasks, completeTask, engineRequest } = require('./engine-api');
function sampleProduct(overrides = {}) {
  const day = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  return { productId: randomUUID(), name: 'Bristol carrots', description: 'Fresh local carrots for the BRFN demonstration.', category: 'Vegetables',
    farmOrigin: 'Test Farm A', price: 2.30, quantity: 10, harvestDate: day(-1), bestBeforeDate: day(30), availableFrom: day(-10), availableTo: day(60),
    allergens: [], organicClaimed: false, certNumber: 'BOS-1001', certBody: 'Bristol Organic Standards (simulated)', certExpiry: '2027-12-31', ...overrides };
}
async function startDemo(options = {}) {
  const mock = createApp().listen(Number(process.env.CERT_MOCK_PORT || 4010), '127.0.0.1');
  const runtime = createRuntime(options);
  await runtime.deploy();
  const app = express();app.use(express.json());
  app.use('/models', express.static(modelDirectory));
  app.use(express.static(path.resolve(__dirname, '../../public')));
  app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../../public/operational.html')));
  app.get('/health', async (req, res) => {
    try { await runtime.zeebe.topology();res.json({ engine: 'connected', processes: ['BRFN_F1_Executable', 'BRFN_F2_Executable'] }); }
    catch (e) { res.status(503).json({ error: e.message }); }
  });
  const route = handler => async (req, res) => { try { await handler(req, res); } catch (error) { res.status(400).json({ error: error.message }); } };
  app.post('/api/start-listing', route(async (req, res) => {
    const variables = sampleProduct(req.body || {});
    const result = await runtime.zeebe.createProcessInstance({ bpmnProcessId: 'BRFN_F1_Executable', variables });
    res.json({ processInstanceKey: String(result.processInstanceKey), productId: variables.productId });
  }));
  app.get('/api/products', (req, res) => res.json(runtime.store.list()));
  app.get('/api/inventory', route(async (req, res) => {
    const result = await engineRequest('/v2/process-instances/search', {
      filter: { processDefinitionId: 'BRFN_F2_Executable', state: 'ACTIVE' }, page: { limit: 100 }
    });
    const keys = new Set(result.items.map(p => String(p.processInstanceKey)));
    res.json(runtime.store.list().filter(p => p.listingState === 'PUBLISHED' && keys.has(p.inventoryInstanceKey)));
  }));
  app.get('/api/catalogue', (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    res.json(runtime.store.list().filter(p => p.orderable && p.quantity > 0 && p.availableFrom <= today && today <= p.availableTo));
  });
  app.get('/api/notifications', (req, res) => res.json(runtime.store.data.notifications));
  app.get('/api/trace', (req, res) => res.json(runtime.trace));
  app.get('/api/tasks/:instance', route(async (req, res) => res.json(await searchTasks(req.params.instance))));
  app.get('/api/instances/:key/elements', route(async (req, res) => res.json(await engineRequest('/v2/element-instances/search',
    { filter: { processInstanceKey: req.params.key }, page: { limit: 100 } }))));
  app.post('/api/instances/:key/cancel', route(async (req, res) => { await runtime.zeebe.cancelProcessInstance(req.params.key);res.json({ cancelled: true }); }));
  app.post('/api/tasks/:key/complete', route(async (req, res) => { await completeTask(req.params.key, req.body || {});res.json({ completed: true }); }));
  app.post('/api/products/:id/update', route(async (req, res) => res.json(await runtime.message('inventory-update-requested', req.params.id))));
  app.post('/api/products/:id/stock-changed', route(async (req, res) => res.json(await runtime.message('stock-changed', req.params.id,
    { orderId: req.body.orderId, quantityChange: req.body.quantityChange }))));
  app.post('/api/products/:id/stop', route(async (req, res) => res.json(await runtime.message('stop-inventory', req.params.id))));
  const server = app.listen(Number(process.env.BRFN_DEMO_PORT || 8790), '127.0.0.1');
  console.log('BRFN executable demo ready: http://127.0.0.1:' + (process.env.BRFN_DEMO_PORT || 8790));
  async function close() { server.close();mock.close();await runtime.close(); }
  return { app, runtime, server, mock, close };
}
if (require.main === module) startDemo().then(demo => {
  process.once('SIGINT', () => demo.close().then(() => process.exit(0)));
}).catch(e => { console.error(e.message);process.exit(1); });
module.exports = { startDemo, sampleProduct };
