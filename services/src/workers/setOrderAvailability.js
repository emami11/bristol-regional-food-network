const { getProduct, saveProduct } = require('./productStore');

async function setOrderAvailabilityHandler(job) {
  const { productId, availability } = job.variables || {};

  if (!productId || !getProduct(productId)) {
    return job.fail({
      errorMessage: `Product not found: ${productId}`,
      retries: 0
    });
  }

  const validStatuses = [
    'AVAILABLE',
    'OUT_OF_STOCK',
    'NOT_YET_IN_SEASON',
    'OUT_OF_SEASON',
    'REJECTED'
  ];

  if (
    !availability ||
    !validStatuses.includes(availability.status) ||
    typeof availability.ordersOpen !== 'boolean'
  ) {
    return job.fail({
      errorMessage: 'Invalid availability decision',
      retries: 0
    });
  }

  const updated = saveProduct(productId, {
    currentStatus: availability.status,
    ordersOpen: availability.ordersOpen
  });

  console.log(
    `[set-order-availability] ${productId}: ` +
    `status=${updated.currentStatus}, ordersOpen=${updated.ordersOpen}`
  );

  return job.complete({
    orderAvailabilityUpdated: true,
    ordersOpen: updated.ordersOpen,
    updatedStatus: updated.currentStatus
  });
}

module.exports = { setOrderAvailabilityHandler };
