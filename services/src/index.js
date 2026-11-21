// Connects to Camunda 8 and starts the F1 job workers.
// Connection settings come from .env (copy .env.example and fill it in).
//
// Start:  npm run workers

require('dotenv').config();
const { Camunda8 } = require('@camunda8/sdk');
const { validateProductHandler, makeVerifyCertificateHandler } = require('./workers/handlers');

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

console.log('Workers running: validate-product, verify-certificate. Ctrl+C to stop.');
