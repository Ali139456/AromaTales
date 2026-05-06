import { randomUUID } from 'crypto';
import { defaultProducts } from './data/defaultProducts.js';

const carts = new Map();

const resolveProduct = (productId) =>
  defaultProducts.find((p) => p.id === productId || p._id === productId);

const formatProduct = (product) => {
  if (!product) return product;
  return {
    _id: product.id,
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    description: product.description,
    image: product.image,
    inStock: product.inStock
  };
};

const buildItemsPayload = (sessionId) => {
  const rows = carts.get(sessionId) || [];
  return rows.map((row) => ({
    _id: row.itemId,
    id: row.itemId,
    quantity: row.quantity,
    product: formatProduct(resolveProduct(row.productId))
  }));
};

export const getMemoryCart = (sessionId) => ({
  sessionId,
  items: buildItemsPayload(sessionId)
});

export const addMemoryCartItem = (sessionId, productId, quantity = 1) => {
  const product = resolveProduct(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  if (!product.inStock) {
    const err = new Error('Product is out of stock');
    err.status = 400;
    throw err;
  }
  const rows = carts.get(sessionId) || [];
  const existing = rows.find((r) => r.productId === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    rows.push({ itemId: randomUUID(), productId: product.id, quantity });
  }
  carts.set(sessionId, rows);
  return getMemoryCart(sessionId);
};

export const updateMemoryCartItem = (sessionId, itemId, quantity) => {
  let rows = carts.get(sessionId) || [];
  if (quantity <= 0) {
    rows = rows.filter((r) => r.itemId !== itemId);
    carts.set(sessionId, rows);
    return getMemoryCart(sessionId);
  }
  const row = rows.find((r) => r.itemId === itemId);
  if (!row) {
    const err = new Error('Cart item not found');
    err.status = 404;
    throw err;
  }
  row.quantity = quantity;
  carts.set(sessionId, rows);
  return getMemoryCart(sessionId);
};

export const removeMemoryCartItem = (sessionId, itemId) => {
  const rows = (carts.get(sessionId) || []).filter((r) => r.itemId !== itemId);
  carts.set(sessionId, rows);
  return getMemoryCart(sessionId);
};

export const clearMemoryCart = (sessionId) => {
  carts.delete(sessionId);
};
