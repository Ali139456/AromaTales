import express from 'express';
import supabase, { isSupabaseEnabled } from '../config/supabase.js';
import {
  addMemoryCartItem,
  clearMemoryCart,
  getMemoryCart,
  removeMemoryCartItem,
  updateMemoryCartItem
} from '../memoryCart.js';

const router = express.Router();

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
    inStock: product.in_stock
  };
};

const buildCartResponse = async (sessionId) => {
  const { data: items, error } = await supabase
    .from('cart_items')
    .select('id, quantity, created_at, product:products(*)')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  const formatted = (items || []).map((item) => ({
    _id: item.id,
    id: item.id,
    quantity: item.quantity,
    product: formatProduct(item.product)
  }));
  return { sessionId, items: formatted };
};

router.get('/:sessionId', async (req, res) => {
  if (!isSupabaseEnabled()) {
    return res.json(getMemoryCart(req.params.sessionId));
  }
  try {
    const cart = await buildCartResponse(req.params.sessionId);
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/:sessionId/items', async (req, res) => {
  if (!isSupabaseEnabled()) {
    try {
      const { productId, quantity = 1 } = req.body;
      if (!productId) return res.status(400).json({ message: 'productId is required' });
      const cart = addMemoryCartItem(req.params.sessionId, productId, quantity);
      return res.json(cart);
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({ message: error.message });
    }
  }
  try {
    const { productId, quantity = 1 } = req.body;
    const { sessionId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, in_stock')
      .eq('id', productId)
      .maybeSingle();
    if (productError) throw productError;
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.in_stock) return res.status(400).json({ message: 'Product is out of stock' });

    const { data: existing, error: existingError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({ session_id: sessionId, product_id: productId, quantity });
      if (insertError) throw insertError;
    }

    const cart = await buildCartResponse(sessionId);
    res.json(cart);
  } catch (error) {
    console.error('Error adding cart item:', error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/:sessionId/items/:itemId', async (req, res) => {
  if (!isSupabaseEnabled()) {
    try {
      const { quantity } = req.body;
      const { sessionId, itemId } = req.params;
      if (quantity === undefined || quantity === null) {
        return res.status(400).json({ message: 'Quantity is required' });
      }
      const cart = updateMemoryCartItem(sessionId, itemId, quantity);
      return res.json(cart);
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({ message: error.message });
    }
  }
  try {
    const { quantity } = req.body;
    const { sessionId, itemId } = req.params;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    if (quantity <= 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('session_id', sessionId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('session_id', sessionId);
      if (error) throw error;
    }

    const cart = await buildCartResponse(sessionId);
    res.json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(400).json({ message: error.message || 'Failed to update cart item' });
  }
});

router.delete('/:sessionId/items/:itemId', async (req, res) => {
  if (!isSupabaseEnabled()) {
    const cart = removeMemoryCartItem(req.params.sessionId, req.params.itemId);
    return res.json(cart);
  }
  try {
    const { sessionId, itemId } = req.params;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('session_id', sessionId);
    if (error) throw error;
    const cart = await buildCartResponse(sessionId);
    res.json(cart);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(400).json({ message: error.message || 'Failed to remove item from cart' });
  }
});

router.delete('/:sessionId', async (req, res) => {
  if (!isSupabaseEnabled()) {
    clearMemoryCart(req.params.sessionId);
    return res.json({ message: 'Cart cleared successfully' });
  }
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', req.params.sessionId);
    if (error) throw error;
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
