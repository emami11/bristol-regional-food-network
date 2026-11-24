
// BRFN Sprint 3 - Load Product Worker
//
// Loads product information from the shared demonstration store.
// The store is held in memory and will be replaced with persistent
// storage when the system is developed further in Task 2.

const { getProduct } = require('./productStore');

/**
 * Loads a product into the Camunda process variables.
 *
 * The product ID is provided by the process.
 * A demonstration product is used when no ID is supplied.
 */
async function loadProductHandler(job) {
  const productId =
    job.variables?.productId || 'BRFN-DEMO-001';

  const product = getProduct(productId);

  // Stop the process if the requested product does not exist.
  if (!product) {
    return job.fail({
      errorMessage: `Product not found: ${productId}`,
      retries: 0
    });
  }

  // Return product details for the remaining BPMN activities.
  return job.complete({
    ...product,
    quantity: product.currentQuantity,
    dataSource: 'SIMULATED_PRODUCT_CATALOG'
  });
}

module.exports = {
  loadProductHandler
};
