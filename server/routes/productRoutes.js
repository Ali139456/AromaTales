import express from 'express';
import supabase, { isSupabaseEnabled } from '../config/supabase.js';
import { defaultProducts } from '../data/defaultProducts.js';

const router = express.Router();

export const formatProduct = (product) => {
  if (!product) return product;
  if (product.in_stock !== undefined) {
    return {
      _id: product.id,
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      description: product.description,
      image: product.image,
      inStock: product.in_stock,
      sortOrder: product.sort_order ?? 0,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
  }
  return {
    _id: product.id || product._id,
    id: product.id || product._id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    description: product.description,
    image: product.image,
    inStock: product.inStock !== false,
    sortOrder: product.sortOrder ?? product.sort_order ?? 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};

const listLocalProducts = () => defaultProducts.map((p) => formatProduct(p));

export const toDbPayload = (body) => {
  const payload = { ...body };
  if (Object.prototype.hasOwnProperty.call(payload, 'inStock')) {
    payload.in_stock = payload.inStock;
    delete payload.inStock;
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'sortOrder')) {
    payload.sort_order = payload.sortOrder
    delete payload.sortOrder
  }
  delete payload._id;
  delete payload.id;
  delete payload.createdAt;
  delete payload.updatedAt;
  return payload;
};

router.get('/', async (req, res) => {
  if (!isSupabaseEnabled()) {
    return res.json(listLocalProducts());
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) throw error;
    const rows = (data || []).map(formatProduct);
    if (rows.length === 0) {
      console.warn('Products table empty; returning local catalogue fallback');
      return res.json(listLocalProducts());
    }
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products (falling back to local):', error?.message || error);
    res.json(listLocalProducts());
  }
});

router.get('/:id', async (req, res) => {
  if (!isSupabaseEnabled()) {
    const product = defaultProducts.find(
      (p) => p.id === req.params.id || p._id === req.params.id
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(formatProduct(product));
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      const product = defaultProducts.find(
        (p) => p.id === req.params.id || p._id === req.params.id
      );
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(formatProduct(product));
    }
    res.json(formatProduct(data));
  } catch (error) {
    console.error('Error fetching product (local fallback):', error?.message || error);
    const product = defaultProducts.find(
      (p) => p.id === req.params.id || p._id === req.params.id
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(formatProduct(product));
  }
});

export default router;
