const { getProduct, saveProduct } = require('./productStore');

async function saveStockSeasonHandler(job) {
  const variables = job.variables || {};
  const productId = variables.productId;

  if (!productId || !getProduct(productId)) {
    return job.fail({
      errorMessage: `Product not found: ${productId}`,
      retries: 0
    });
  }

  const quantity = variables.quantity;
  const { seasonStart, seasonEnd } = variables;

  if (
    !Number.isSafeInteger(quantity) ||
    quantity < 0 ||
    typeof seasonStart !== 'string' ||
    typeof seasonEnd !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(seasonStart) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(seasonEnd) ||
    !Number.isFinite(Date.parse(seasonStart)) ||
    !Number.isFinite(Date.parse(seasonEnd)) ||
    seasonEnd < seasonStart
  ) {
    return job.fail({
      errorMessage: 'Invalid stock quantity or seasonal dates',
      retries: 0
    });
  }

  const previous = getProduct(productId);

  const updated = saveProduct(productId, {
    currentQuantity: quantity,
    seasonStart,
    seasonEnd
  });

  console.log(
    `[save-stock-season] ${productId}: ${previous.currentQuantity} -> ${updated.currentQuantity}`
  );

  return job.complete({
    saved: true,
    productId,
    quantity: updated.currentQuantity,
    seasonStart: updated.seasonStart,
    seasonEnd: updated.seasonEnd
  });
}

module.exports = { saveStockSeasonHandler };
