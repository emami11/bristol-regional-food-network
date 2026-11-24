// Shared in-memory demonstration catalogue for BRFN Sprint 3.
// Data resets when the worker application restarts.

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

function getProduct(productId) {
  const product = products[productId];
  return product ? { ...product } : null;
}

function listProducts() {
  return Object.values(products).map(product => ({ ...product }));
}

function saveProduct(productId, changes) {
  if (!products[productId]) {
    throw new Error(`Product not found: ${productId}`);
  }

  products[productId] = {
    ...products[productId],
    ...changes
  };

  return getProduct(productId);
}

module.exports = {
  getProduct,
  listProducts,
  saveProduct
};
