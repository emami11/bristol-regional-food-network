// A small persistent catalogue for the local execution demo. Writes are synchronous
// and atomic inside one Node process so two jobs cannot interleave a stock update.
const fs = require('node:fs');
const path = require('node:path');
const { isDate, todayISO } = require('../rules/productRules');

class Catalogue {
  constructor(filename) {
    this.filename = filename;
    this.data = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, 'utf8')) : { products: {}, notifications: [] };
  }
  save() {
    fs.mkdirSync(path.dirname(this.filename), { recursive: true });
    const tmp = this.filename + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    fs.renameSync(tmp, this.filename);
  }
  get(id) {
    const p = this.data.products[id];
    if (!p) throw new Error(`Unknown product: ${id}`);
    return structuredClone(p);
  }
  list() { return Object.values(this.data.products).map(p => structuredClone(p)); }
  publish(v) {
    // Retrying publication must not reset inventory already changed by F2.
    if (this.data.products[v.productId]?.listingState === 'PUBLISHED') return this.get(v.productId);
    const fields = ['productId', 'name', 'description', 'category', 'price', 'quantity', 'farmOrigin', 'harvestDate', 'bestBeforeDate',
      'availableFrom', 'availableTo', 'allergens', 'organicClaimed', 'certNumber', 'certBody', 'certExpiry', 'certValid', 'certStatus',
      'certVerifiedBy', 'certCheckedAt', 'availabilityStatus'];
    const product = Object.fromEntries(fields.filter(k => v[k] !== undefined).map(k => [k, v[k]]));
    if (v.organicClaimed === true && v.certValid !== true) throw new Error('Publication blocked: organic claim has not been accepted.');
    Object.assign(product, { quantity: Number(v.quantity), price: Number(v.price), listingState: 'PUBLISHED',
      orderable: v.availabilityStatus === 'AVAILABLE', processedOrderIds: [], version: 1, updatedAt: new Date().toISOString() });
    this.data.products[v.productId] = product;
    this.save(); return this.get(v.productId);
  }
  close(v, listingState) {
    this.data.products[v.productId] = { ...(this.data.products[v.productId] || {}), productId: v.productId,
      name: v.name || 'Unpublished listing', listingState, orderable: false, updatedAt: new Date().toISOString() };
    this.save(); return { listingState };
  }
  apply(v) {
    const product = this.get(v.productId);
    let quantity = product.quantity, from = product.availableFrom, to = product.availableTo;
    let duplicateOrder = false, oversold = false;
    const errors = [];
    if (v.updateKind === 'PRODUCER') {
      if (!Number.isInteger(v.newQuantity) || v.newQuantity < 0) errors.push('Quantity must be a whole number, zero or more.');
      if (!isDate(v.availableFrom) || !isDate(v.availableTo) || v.availableTo < v.availableFrom) errors.push('Enter real seasonal dates with end on or after start.');
      if (!errors.length) { quantity = v.newQuantity; from = v.availableFrom; to = v.availableTo; }
    } else if (v.updateKind === 'ORDER') {
      if (typeof v.orderId !== 'string' || !v.orderId.trim()) errors.push('An orderId is required.');
      if (!Number.isInteger(v.quantityChange) || v.quantityChange === 0) errors.push('quantityChange must be a nonzero whole number.');
      duplicateOrder = product.processedOrderIds.includes(v.orderId);
      if (!errors.length && !duplicateOrder) {
        oversold = quantity + v.quantityChange < 0;
        quantity = Math.max(0, quantity + v.quantityChange);
        product.processedOrderIds.push(v.orderId);
      }
    } else errors.push('Unknown inventory update kind.');
    if (errors.length) return { stockUpdateValid: false, validationSummary: errors.join('\n'), oversold: false, duplicateOrder: false };
    const previousStatus = product.availabilityStatus;
    Object.assign(product, { quantity, availableFrom: from, availableTo: to, version: product.version + 1,
      updatedAt: new Date().toISOString() });
    // Close ordering immediately; reopening waits for the DMN evaluation.
    const today = todayISO();
    if (quantity === 0 || today < from || today > to) product.orderable = false;
    this.data.products[v.productId] = product; this.save();
    return { stockUpdateValid: true, validationSummary: '', quantity, availableFrom: from, availableTo: to,
      previousStatus, inventoryVersion: product.version, today: todayISO(), oversold, duplicateOrder };
  }
  availability(v) {
    const product = this.get(v.productId);
    if (product.version !== v.inventoryVersion) throw new Error('Inventory changed during evaluation; reload before committing.');
    const statusChanged = product.availabilityStatus !== v.availabilityStatus;
    Object.assign(product, { availabilityStatus: v.availabilityStatus, orderable: v.availabilityStatus === 'AVAILABLE', updatedAt: new Date().toISOString() });
    this.data.products[v.productId] = product; this.save();
    return { statusChanged, orderable: product.orderable };
  }
  notify(jobKey, v) {
    const id = String(jobKey);
    if (!this.data.notifications.some(n => n.id === id)) {
      this.data.notifications.push({ id, productId: v.productId, at: new Date().toISOString(), listingState: v.listingState,
        availabilityStatus: v.availabilityStatus, oversold: v.oversold === true, message: v.validationSummary || v.adminReason || 'Product status updated.' });
      this.save();
    }
    return { notificationRecorded: true };
  }
}
module.exports = { Catalogue };
