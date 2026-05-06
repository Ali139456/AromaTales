import express from 'express';
import supabase, { isSupabaseEnabled } from '../config/supabase.js';
import { sendOrderEmail, sendOrderConfirmationEmail } from '../utils/email.js';
import { optionalAuth, requireAuth, requireAdmin, getProfile } from '../middleware/auth.js';

const router = express.Router();

const requireSupabase = (res) => {
  if (!isSupabaseEnabled()) {
    res.status(503).json({ message: 'Database not configured' });
    return false;
  }
  return true;
};

const generateOrderNumber = async () => {
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true });
  const sequence = String((count || 0) + 1).padStart(4, '0');
  return `AR-${Date.now()}-${sequence}`;
};

const fetchOrderById = async (id) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

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

const formatOrderForClient = (order) => {
  if (!order) return order;
  return {
    _id: order.id,
    id: order.id,
    orderNumber: order.order_number,
    sessionId: order.session_id,
    userId: order.user_id || null,
    customer: order.customer,
    items: (order.items || []).map((item) => ({
      _id: item.id,
      id: item.id,
      product: formatProduct(item.product),
      quantity: item.quantity,
      price: Number(item.price)
    })),
    paymentMethod: order.payment_method,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    total: Number(order.total),
    status: order.status,
    notes: order.notes,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
};

router.post('/', optionalAuth, async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { sessionId, customer, paymentMethod, notes } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address) {
      return res.status(400).json({ message: 'Complete customer information is required' });
    }

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('id, quantity, product:products(*)')
      .eq('session_id', sessionId);
    if (cartError) throw cartError;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        message: 'Cart is empty or not found. Please add items to your cart before checkout.'
      });
    }

    for (const item of cartItems) {
      if (!item.product) {
        return res.status(400).json({
          message: 'One or more products in cart are invalid or no longer available'
        });
      }
      if (!item.product.price || item.product.price <= 0) {
        return res.status(400).json({ message: 'Invalid product price found in cart' });
      }
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * (item.quantity || 0),
      0
    );
    const shipping = 0;
    const total = subtotal + shipping;

    const orderNumber = await generateOrderNumber();

    const userId = req.user?.id || null;

    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        session_id: sessionId,
        user_id: userId,
        customer,
        payment_method: paymentMethod || 'COD',
        subtotal,
        shipping,
        total,
        status: 'Pending',
        notes
      })
      .select()
      .single();
    if (orderError) throw orderError;

    const orderItemsPayload = cartItems.map((item) => ({
      order_id: orderRow.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
    if (itemsError) throw itemsError;

    await supabase.from('cart_items').delete().eq('session_id', sessionId);

    const fullOrder = await fetchOrderById(orderRow.id);
    const formatted = formatOrderForClient(fullOrder);

    try {
      await sendOrderEmail(formatted);
      await sendOrderConfirmationEmail(formatted);
    } catch (emailError) {
      console.error('Email sending failed (order still saved):', emailError);
    }

    res.status(201).json(formatted);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: error.message || 'An error occurred while creating the order. Please try again.'
    });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(formatOrderForClient));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/session/:sessionId', async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('session_id', req.params.sessionId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(formatOrderForClient));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(formatOrderForClient));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', requireAdmin, async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Order not found' });
    const fullOrder = await fetchOrderById(req.params.id);
    res.json(formatOrderForClient(fullOrder));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const order = await fetchOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const profile = await getProfile(req.user.id);
    const isAdmin = profile?.role === 'admin';
    const isOwner = order.user_id && order.user_id === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You do not have access to this order' });
    }

    res.json(formatOrderForClient(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
