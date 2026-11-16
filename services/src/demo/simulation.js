import Viewer from 'bpmn-js/lib/NavigatedViewer';
import TokenSimulation from 'bpmn-js-token-simulation/lib/viewer';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

const viewer = new Viewer({ container: '#canvas', additionalModules: [TokenSimulation] });
const status = document.querySelector('#status');
let watching = null;
let marked = [];
let products = [];
async function request(url, body) {
  const response = await fetch(url, body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Request failed');
  return result;
}
function clearMarkers() {
  for (const id of marked) if (viewer.get('elementRegistry').get(id)) viewer.get('canvas').removeMarker(id, 'engine-active');
  marked = [];
}
async function watch(key, model) {
  watching = null;
  await showModel(model);
  viewer.get('toggleMode').toggleMode(false);
  document.querySelector('#process').value = model;
  watching = key;
  await refreshState();
}
async function refreshState() {
  if (!watching) return;
  const key = watching;
  try {
    const result = await request(`/api/instances/${key}/elements`);
    if (watching !== key) return;
    clearMarkers();
    const active = result.items.filter(e => e.state === 'ACTIVE');
    for (const e of active) if (viewer.get('elementRegistry').get(e.elementId)) {
      viewer.get('canvas').addMarker(e.elementId, 'engine-active');marked.push(e.elementId);
    }
    status.textContent = `Live Camunda instance ${key}: ${active.length ? active.map(e => e.elementName || e.elementId).join(', ') : 'no active element (indexing or completed)'}.`;
  } catch (error) { status.textContent = error.message; }
}
async function refreshProducts() {
  products = await request('/api/inventory');
  const select = document.querySelector('#product');
  const selected = select.value;
  select.replaceChildren(new Option('Choose a published product', ''), ...products.map(p => new Option(`${p.name} · ${p.productId.slice(0, 8)} · stock ${p.quantity} · ${p.availabilityStatus}`, p.productId)));
  if (products.some(p => p.productId === selected)) select.value = selected;
}
function selectedProduct() {
  const product = products.find(p => p.productId === document.querySelector('#product').value);
  if (!product) throw new Error('Choose a published product first.');
  return product;
}
function action(id, handler) {
  document.querySelector(id).onclick = () => handler().catch(error => status.textContent = error.message);
}
async function showModel(name) {
  watching = null;
  clearMarkers();
  const result = await viewer.importXML(await (await fetch(`/models/BRFN-${name}-Executable.bpmn`)).text());
  viewer.get('canvas').zoom('fit-viewport');
  document.querySelector('#download').href = `/models/BRFN-${name}-Executable.bpmn`;
  status.textContent = `${name} loaded. ${result.warnings.length ? result.warnings.length + ' import warnings.' : 'No import warnings.'} Toggle simulation to animate tokens.`;
}
document.querySelector('#process').addEventListener('change', e => showModel(e.target.value).catch(error => status.textContent = error.message));
document.querySelector('#fit').onclick = () => viewer.get('canvas').zoom('fit-viewport');
action('#simulate', async () => {
  watching = null;clearMarkers();viewer.get('toggleMode').toggleMode(true);
  status.textContent = 'Token simulation: click the play arrow at the start event. Choose gateway branches to explore different paths.';
});
viewer.get('eventBus').on('tokenSimulation.toggleMode', ({active}) => {
  if (active) { watching = null;clearMarkers(); }
});
action('#start', async () => {
  const result = await request('/api/start-listing', {});
  await watch(result.processInstanceKey, 'F1');
});
action('#refresh', refreshProducts);
action('#watch', async () => watch(selectedProduct().inventoryInstanceKey, 'F2'));
action('#update', async () => {
  const product = selectedProduct();
  await request(`/api/products/${product.productId}/update`, {});
  await watch(product.inventoryInstanceKey, 'F2');
});
action('#order', async () => {
  const product = selectedProduct();
  const amount = Number(document.querySelector('#quantity-change').value);
  if (!Number.isInteger(amount) || amount <= 0) throw new Error('Enter a positive whole number of units.');
  await request(`/api/products/${product.productId}/stock-changed`, { orderId: crypto.randomUUID(), quantityChange: -amount });
  await watch(product.inventoryInstanceKey, 'F2');
});
setInterval(refreshState, 2000);
refreshProducts().catch(error => status.textContent = error.message);
showModel('F1').catch(error => status.textContent = error.message);
