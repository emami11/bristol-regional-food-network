// Tasklist and integration checks use Camunda's real Orchestration Cluster API.
const base = () => process.env.BRFN_REST_ADDRESS || 'http://127.0.0.1:8095';
async function engineRequest(route, body, method = 'POST') {
  const response = await fetch(base() + route, { method, headers: { 'Content-Type': 'application/json',
    Authorization: 'Basic ' + Buffer.from((process.env.BRFN_ENGINE_USERNAME || 'demo') + ':' + (process.env.BRFN_ENGINE_PASSWORD || 'demo')).toString('base64') },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const text = await response.text();
  if (!response.ok) throw new Error(`Camunda ${response.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}
async function searchTasks(processInstanceKey) {
  return engineRequest('/v2/user-tasks/search', { filter: { processInstanceKey, state: 'CREATED' }, page: { limit: 100 } });
}
async function completeTask(key, variables) { return engineRequest(`/v2/user-tasks/${key}/completion`, { variables }); }
module.exports = { engineRequest, searchTasks, completeTask };
