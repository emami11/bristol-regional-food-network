import fs from 'node:fs';
import assert from 'node:assert/strict';
import { BpmnModdle } from 'bpmn-moddle';
import { Injector } from 'didi';
import EventBus from 'diagram-js/lib/core/EventBus';
import SimulatorModule from 'bpmn-js-token-simulation/lib/simulator';

async function setup(name) {
  const {rootElement, warnings} = await new BpmnModdle().fromXML(fs.readFileSync(`../bpmn/operational/ayo/BRFN-${name}-Executable.bpmn`, 'utf8'));
  assert.equal(warnings.length, 0, JSON.stringify(warnings));
  const process = rootElement.rootElements.find(e => e.$type === 'bpmn:Process');
  const map = new Map([process, ...process.flowElements].map(businessObject => [businessObject.id, {
    id: businessObject.id, type: businessObject.$type, businessObject, incoming: [], outgoing: [], children: [], attachers: []
  }]));
  const root = map.get(process.id);
  root.children = process.flowElements.map(e => map.get(e.id));
  for (const node of root.children) {
    node.parent = root;
    if (node.type === 'bpmn:SequenceFlow') {
      node.source = map.get(node.businessObject.sourceRef.id);node.target = map.get(node.businessObject.targetRef.id);
      node.source.outgoing.push(node);node.target.incoming.push(node);
    }
    if (node.businessObject.attachedToRef) {
      node.host = map.get(node.businessObject.attachedToRef.id);node.host.attachers.push(node);
    }
  }
  const eventBus = new EventBus();
  const injector = new Injector([{ eventBus:['value', eventBus], elementRegistry:['value', {get:id=>map.get(id),forEach:fn=>map.forEach(fn)}]}, SimulatorModule]);
  injector.init();
  const sim = injector.get('simulator');
  const history = [];
  sim.on('trace', e => { if (e.action === 'enter' || e.action === 'exit') history.push(e.element.id); });
  const branch = (from, to) => sim.setConfig(map.get(from), {activeOutgoing:map.get(from).outgoing.find(f=>f.target.id===to)});
  for (const node of root.children.filter(n=>n.type==='bpmn:ExclusiveGateway')) sim.setConfig(node,{activeOutgoing:node.outgoing[0]});
  const trigger = id => {
    const subscription = sim.findSubscription(s=>s.element.id===id);
    assert.ok(subscription, `Waiting subscription: ${id}`);
    sim.trigger({event:subscription.event,scope:subscription.scope});
  };
  const start = () => {sim.reset();sim.signal({element:root,startEvent:map.get(`${name}_Start`)});};
  return {sim,map,history,branch,start,trigger};
}
async function run() {
  let c = await setup('F1');c.branch('F1_Organic','F1_Availability');c.start();assert.ok(c.history.includes('F1_End'));console.log('PASS F1 token path to publication');
  c = await setup('F1');c.branch('F1_DataValid','F1_Correct');c.branch('F1_Continue','F1_Reject');c.start();assert.ok(c.history.includes('F1_Rejected'));console.log('PASS F1 token path to withdrawal');
  c = await setup('F1');c.branch('F1_DataValid','F1_Correct');c.sim.waitAtElement(c.map.get('F1_Correct'));c.start();c.trigger('F1_Abandoned');assert.ok(c.history.includes('F1_Archived'));console.log('PASS F1 timer token path to archive');
  c = await setup('F2');c.branch('F2_StatusChanged','F2_Wait');c.start();assert.ok(c.history.includes('F2_Wait'));c.trigger('F2_Order');assert.ok(c.history.includes('F2_ApplyOrder'));c.trigger('F2_Request');assert.ok(c.history.includes('F2_StockForm'));c.trigger('F2_Daily');assert.ok(c.history.includes('F2_Refresh'));c.trigger('F2_Stop');assert.ok(c.history.includes('F2_End'));console.log('PASS F2 token subscriptions: order, producer, timer and stop');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
