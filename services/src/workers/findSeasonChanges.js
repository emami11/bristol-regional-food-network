
const { listProducts } = require('./productStore');

// Determine the expected availability status for a product.
function expectedStatus(product, today) {
  if (
    !Number.isSafeInteger(product.currentQuantity) ||
    product.currentQuantity < 0
  ) {
    return 'REJECTED';
  }

  if (today < product.seasonStart) {
    return 'NOT_YET_IN_SEASON';
  }

  if (today > product.seasonEnd) {
    return 'OUT_OF_SEASON';
  }

  if (product.currentQuantity === 0) {
    return 'OUT_OF_STOCK';
  }

  return 'AVAILABLE';
}

// F2 T3: Find products requiring seasonal availability updates.
async function findSeasonChangesHandler(job) {
  // Use today's UTC date unless a test date is provided.
  const today =
    job.variables?.checkDate ??
    new Date().toISOString().slice(0, 10);

  // Validate the date before attempting to format it.
  const parsedDate = new Date(today);

  if (
    typeof today !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(today) ||
    !Number.isFinite(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== today
  ) {
    return job.fail({
      errorMessage: 'Invalid seasonal check date',
      retries: 0
    });
  }

  // Find products whose stored availability is outdated.
  const productsToCheck = listProducts()
    .filter(
      product =>
        expectedStatus(product, today) !== product.currentStatus
    )
    .map(product => ({
      productId: product.productId,
      productName: product.productName,
      quantity: product.currentQuantity,
      currentStatus: product.currentStatus,
      seasonStart: product.seasonStart,
      seasonEnd: product.seasonEnd
    }));

  console.log(
    `[find-season-changes] Date=${today}, ` +
    `products requiring update=${productsToCheck.length}`
  );

  // Return variables to the Camunda process.
  return job.complete({
    productsToCheck,
    checkDate: today,
    seasonalCheckDate: today,
    seasonalCheckCount: productsToCheck.length
  });
}

module.exports = {
  findSeasonChangesHandler,
  expectedStatus
};
