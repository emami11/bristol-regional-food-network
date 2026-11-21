// Simulated product lookup for BRFN Sprint 3.
// Replace with a database or API adapter when integration is available.

const products = {
  'BRFN-DEMO-001': {
    productId: 'BRFN-DEMO-001',
    productName: 'Locally Grown Carrots',
    currentQuantity: 25,
    currentStatus: 'AVAILABLE',
    seasonStart: '2026-01-01',
    seasonEnd: '2026-12-31'
  }
};

async function loadProductHandler(job) {
  const productId = job.variables?.productId || 'BRFN-DEMO-001';
  const product = products[productId];

  if (!product) {
    return job.fail({
      errorMessage: `Product not found: ${productId}`,
      retries: 0
    });
  }

  return job.complete({
    ...product,
    quantity: product.currentQuantity,
    dataSource: 'SIMULATED_PRODUCT_CATALOG'
  });
}

module.exports = { loadProductHandler };
