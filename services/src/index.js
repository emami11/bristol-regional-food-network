// Connects to Camunda 8 and starts the F1, F1a and F2 job workers.
// Connection settings come from .env (copy .env.example and fill it in).
//
// Start:  npm run workers

require('dotenv').config();
const { Camunda8 } = require('@camunda8/sdk');
const { validateProductHandler, makeVerifyCertificateHandler } = require('./workers/handlers');
const { loadProductHandler } = require('./workers/loadProduct');
const { saveDraftListingHandler, publishProductHandler, archiveListingHandler } = require('./workers/listingWorkers');

if (!process.env.ZEEBE_GRPC_ADDRESS && !process.env.ZEEBE_ADDRESS) {
  console.error('No Camunda connection settings found. Copy .env.example to .env and fill it in (see README).');
  process.exit(1);
}

const zeebe = new Camunda8().getZeebeGrpcApiClient();

zeebe.createWorker({
  taskType: 'validate-product',
  taskHandler: (job) => {
    console.log(`[validate-product] job ${job.key}`);
    return validateProductHandler(job);
  }
});

const verifyCertificate = makeVerifyCertificateHandler();
zeebe.createWorker({
  taskType: 'verify-certificate',
  // Our handler retries the service itself, so allow it more than the default 30 s.
  timeout: 60000,
  taskHandler: (job) => {
    console.log(`[verify-certificate] job ${job.key} cert ${job.variables.certNumber}`);
    return verifyCertificate(job);
  }
});

zeebe.createWorker({
  taskType: 'load-product',
  taskHandler: (job) => {
    console.log(`[load-product] job ${job.key}`);
    return loadProductHandler(job);
  }
});

// F1 listing workers: save, publish and archive a listing in the simulated store.
const listingWorkers = [
  ['save-draft-listing', saveDraftListingHandler],
  ['publish-product', publishProductHandler],
  // The model spells this job type "archieve-listing". "archive-listing" is registered too,
  // so correcting the spelling in the model doesn't break anything.
  ['archieve-listing', archiveListingHandler],
  ['archive-listing', archiveListingHandler]
];
for (const [taskType, handler] of listingWorkers) {
  zeebe.createWorker({
    taskType,
    taskHandler: (job) => {
      console.log(`[${taskType}] job ${job.key} listing ${job.variables.listingId ?? '(new)'}`);
      return handler(job);
    }
  });
}

console.log('Workers running: validate-product, verify-certificate, save-draft-listing, publish-product, archieve-listing, load-product. Ctrl+C to stop.');
