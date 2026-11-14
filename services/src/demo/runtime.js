const path = require('node:path');
const fs = require('node:fs');
const { randomUUID } = require('node:crypto');
const { Camunda8 } = require('@camunda8/sdk');
const { validateProductHandler, makeVerifyCertificateHandler } = require('../workers/handlers');
const { todayISO } = require('../rules/productRules');
const { Catalogue } = require('./store');

const modelDirectory = path.resolve(__dirname, '../../../bpmn/operational/ayo');
function nextCheck(v) {
  const now = new Date();
  if (Number.isInteger(v.seasonCheckDelayMs) && v.seasonCheckDelayMs >= 1000) return new Date(now.getTime() + v.seasonCheckDelayMs).toISOString();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString();
}
function createRuntime(options = {}) {
  const store = options.store || new Catalogue(path.resolve(__dirname, '../../data/catalogue.json'));
  const c8 = new Camunda8({ CAMUNDA_AUTH_STRATEGY: 'NONE', CAMUNDA_SECURE_CONNECTION: false,
    ZEEBE_GRPC_ADDRESS: process.env.BRFN_GRPC_ADDRESS || '127.0.0.1:26500' });
  const zeebe = c8.getZeebeGrpcApiClient();
  const trace = [];
  function record(job, state, extra = {}) {
    trace.push({ at: new Date().toISOString(), processInstanceKey: String(job.processInstanceKey), elementId: job.elementId,
      jobKey: String(job.key), productId: job.variables.productId, state, ...extra });
    if (trace.length > 2000) trace.shift();
  }
  const tasks = {
    'brfn-initialise-listing': async job => job.complete({ productId: job.variables.productId || randomUUID(),
      listingState: 'DRAFT', organicClaimed: job.variables.organicClaimed ?? false, allergens: job.variables.allergens ?? [],
      today: todayISO(), certValid: false, certStatus: 'NOT_CLAIMED', validationSummary: '', adminValidationMessage: '',
      correctionAction: 'RESUBMIT', correctionTimeout: /^P(?=\d|T\d)[\dDTHMS.]+$/.test(job.variables.correctionTimeout || '') ? job.variables.correctionTimeout : 'P7D' }),
    'validate-product': validateProductHandler,
    'verify-certificate': makeVerifyCertificateHandler(options.certificateOptions),
    'brfn-record-admin': async job => {
      const v = job.variables;
      if (!['APPROVE', 'REJECT'].includes(v.adminDecision) || (v.adminDecision === 'REJECT' && !String(v.adminReason || '').trim())) {
        return job.complete({ adminReviewValid: false, adminValidationMessage: 'Choose APPROVE or REJECT and give a reason for rejection.' });
      }
      return job.complete({ adminReviewValid: true, adminValidationMessage: '', certValid: v.adminDecision === 'APPROVE',
        certStatus: v.adminDecision === 'APPROVE' ? 'ADMIN_APPROVED' : 'ADMIN_REJECTED', certVerifiedBy: 'ADMIN', certCheckedAt: new Date().toISOString() });
    },
    'brfn-publish-listing': async job => {
      const product = store.publish(job.variables);
      await zeebe.publishMessage({ name: 'brfn-inventory-start', correlationKey: product.productId, messageId: 'inventory:' + product.productId,
        timeToLive: 60000, variables: { productId: product.productId, seasonCheckDelayMs: job.variables.seasonCheckDelayMs || 0 } });
      return job.complete({ listingState: 'PUBLISHED', orderable: product.orderable });
    },
    'brfn-reject-listing': async job => job.complete(store.close(job.variables, 'WITHDRAWN')),
    'brfn-archive-listing': async job => job.complete(store.close(job.variables, 'ARCHIVED')),
    'brfn-load-inventory': async job => {
      const p = store.get(job.variables.productId);
      if (store.data.products[p.productId].inventoryInstanceKey !== String(job.processInstanceKey)) {
        store.data.products[p.productId].inventoryInstanceKey = String(job.processInstanceKey);
        store.save();
      }
      return job.complete({ quantity: p.quantity, newQuantity: p.quantity, availableFrom: p.availableFrom, availableTo: p.availableTo,
        previousStatus: p.availabilityStatus, inventoryVersion: p.version, today: todayISO(), oversold: false,
        validationSummary: '', nextSeasonCheckAt: job.variables.dailyCheck || !job.variables.nextSeasonCheckAt ? nextCheck(job.variables) : job.variables.nextSeasonCheckAt });
    },
    'apply-stock-change': async job => job.complete(store.apply(job.variables)),
    'brfn-save-availability': async job => job.complete(store.availability(job.variables)),
    'brfn-stop-inventory': async job => job.complete({ monitoringStopped: true }),
    'notify-producer': async job => job.complete(store.notify(job.key, job.variables))
  };
  const workers = Object.entries(tasks).map(([taskType, handler]) => zeebe.createWorker({ taskType, timeout: 60000,
    taskHandler: async job => {
      record(job, 'ACTIVE');
      try { const result = await handler(job); record(job, 'COMPLETED'); return result; }
      catch (error) { record(job, 'FAILED', { message: error.message }); return job.fail({ errorMessage: error.message, retries: Math.max(0, job.retries - 1), retryBackOff: 1000 }); }
    }
  }));
  async function deploy() {
    const resources = fs.readdirSync(modelDirectory).filter(f => /\.(bpmn|dmn|form)$/.test(f))
      .map(name => ({ [name.endsWith('.bpmn') ? 'processFilename' : name.endsWith('.dmn') ? 'decisionFilename' : 'formFilename']: path.join(modelDirectory, name) }));
    return zeebe.deployResources(resources);
  }
  async function message(name, productId, variables = {}, messageId = randomUUID()) {
    store.get(productId);
    return zeebe.publishMessage({ name, correlationKey: productId, messageId, timeToLive: 60000, variables });
  }
  return { zeebe, store, trace, workers, deploy, message, async close() { await zeebe.close(); } };
}
module.exports = { createRuntime, modelDirectory, nextCheck };
