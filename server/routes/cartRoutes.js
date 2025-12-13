import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get or create cart
router.get('/:sessionId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ sessionId: req.params.sessionId })
      .populate('items.product');
    
    if (!cart) {
      cart = new Cart({ sessionId: req.params.sessionId, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/:sessionId/items', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.inStock) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }
    
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });
    
    if (!cart) {
      cart = new Cart({ sessionId: req.params.sessionId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item quantity
router.put('/:sessionId/items/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ message: 'Quantity is required' });
    }
    
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemId = req.params.itemId;
    const item = cart.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(400).json({ message: error.message || 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/:sessionId/items/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemId = req.params.itemId;
    const item = cart.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    item.remove();
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(400).json({ message: error.message || 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/:sessionId', async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ sessionId: req.params.sessionId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
