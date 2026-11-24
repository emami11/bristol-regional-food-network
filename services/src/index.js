
/**
 * BRFN Sprint 3 - Camunda Job Workers
 *
 * Connects to Camunda 8 and registers workers for:
 * F1  - Product Listing and Validation
 * F1a - Verify Organic Certification
 * F2  - Inventory and Seasonal Availability
 * F2a - Evaluate Product Availability
 *
 * Connection settings are loaded from services/.env.
 *
 * Start with:
 * npm --prefix services run workers
 */

require('dotenv').config();

const { Camunda8 } = require('@camunda8/sdk');

// F1: Product validation and organic certification
const {
  validateProductHandler,
  makeVerifyCertificateHandler
} = require('./workers/handlers');

// F1: Save, publish and archive product listings
const {
  saveDraftListingHandler,
  publishProductHandler,
  archiveListingHandler
} = require('./workers/listingWorkers');

// F2: Load product information
const {
  loadProductHandler
} = require('./workers/loadProduct');

// F2: Find products requiring seasonal reevaluation
const {
  findSeasonChangesHandler
} = require('./workers/findSeasonChanges');

// F2a: Save updated stock and seasonal information
const {
  saveStockSeasonHandler
} = require('./workers/saveStockSeason');

// F2a: Update whether a product can accept new orders
const {
  setOrderAvailabilityHandler
} = require('./workers/setOrderAvailability');

// F2a: Simulate producer notifications
const {
  notifyProducerHandler
} = require('./workers/notifyProducer');

// F1a: Record organic certification verification results
const {
  recordVerificationAuditHandler
} = require('./workers/recordVerificationAudit');

// --------------------------------------------------
// Validate Camunda connection settings
// --------------------------------------------------

if (
  !process.env.ZEEBE_GRPC_ADDRESS &&
  !process.env.ZEEBE_ADDRESS
) {
  console.error(
    'No Camunda connection settings found. ' +
    'Copy services/.env.example to services/.env ' +
    'and configure the connection.'
  );

  process.exit(1);
}

// --------------------------------------------------
// Connect to Camunda 8
// --------------------------------------------------

const zeebe = new Camunda8().getZeebeGrpcApiClient();

// --------------------------------------------------
// F1: Validate product details
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'validate-product',

  taskHandler: (job) => {
    console.log(`[validate-product] job ${job.key}`);

    return validateProductHandler(job);
  }
});

// --------------------------------------------------
// F1a: Verify organic certification
// --------------------------------------------------

const verifyCertificate = makeVerifyCertificateHandler();

zeebe.createWorker({
  taskType: 'verify-certificate',

  // Allow extra time for certification service retries.
  timeout: 60000,

  taskHandler: (job) => {
    console.log(
      `[verify-certificate] job ${job.key} cert ${job.variables?.certNumber}`
    );

    return verifyCertificate(job);
  }
});

// --------------------------------------------------
// F1: Save draft listing
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'save-draft-listing',

  taskHandler: (job) => {
    console.log(`[save-draft-listing] job ${job.key}`);

    return saveDraftListingHandler(job);
  }
});

// --------------------------------------------------
// F1: Publish product listing
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'publish-product',

  taskHandler: (job) => {
    console.log(`[publish-product] job ${job.key}`);

    return publishProductHandler(job);
  }
});

// --------------------------------------------------
// F1: Archive product listing
// --------------------------------------------------

// Both spellings are supported because the existing
// BPMN model uses "archieve-listing".

const archiveJobTypes = [
  'archieve-listing',
  'archive-listing'
];

for (const taskType of archiveJobTypes) {
  zeebe.createWorker({
    taskType,

    taskHandler: (job) => {
      console.log(`[${taskType}] job ${job.key}`);

      return archiveListingHandler(job);
    }
  });
}

// --------------------------------------------------
// F2: Load product listing
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'load-product',

  taskHandler: (job) => {
    console.log(`[load-product] job ${job.key}`);

    return loadProductHandler(job);
  }
});

// --------------------------------------------------
// F2: Find seasonal changes
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'find-season-changes',

  taskHandler: (job) => {
    console.log(`[find-season-changes] job ${job.key}`);

    return findSeasonChangesHandler(job);
  }
});

// --------------------------------------------------
// F2a: Save stock and seasonal dates
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'save-stock-season',

  taskHandler: (job) => {
    console.log(`[save-stock-season] job ${job.key}`);

    return saveStockSeasonHandler(job);
  }
});

// --------------------------------------------------
// F2a: Open or close product to new orders
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'set-order-availability',

  taskHandler: (job) => {
    console.log(`[set-order-availability] job ${job.key}`);

    return setOrderAvailabilityHandler(job);
  }
});

// --------------------------------------------------
// F2a: Notify producer of availability changes
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'notify-producer',

  taskHandler: (job) => {
    console.log(`[notify-producer] job ${job.key}`);

    return notifyProducerHandler(job);
  }
});

// --------------------------------------------------
// F1a: Record certificate verification outcome
// --------------------------------------------------

zeebe.createWorker({
  taskType: 'record-verification-audit',

  taskHandler: (job) => {
    console.log(`[record-verification-audit] job ${job.key}`);

    return recordVerificationAuditHandler(job);
  }
});

// --------------------------------------------------
// Startup confirmation
// --------------------------------------------------

const registeredJobTypes = [
  'validate-product',
  'verify-certificate',
  'save-draft-listing',
  'publish-product',
  'archieve-listing',
  'archive-listing',
  'load-product',
  'find-season-changes',
  'save-stock-season',
  'set-order-availability',
  'notify-producer',
  'record-verification-audit'
];

console.log('----------------------------------------');
console.log('BRFN Sprint 3 - Camunda Workers');
console.log('----------------------------------------');

console.log('Registered job types:');

for (const taskType of registeredJobTypes) {
  console.log(`  - ${taskType}`);
}

console.log('----------------------------------------');
console.log(
  `${registeredJobTypes.length} job types registered. Ctrl+C to stop.`
);
