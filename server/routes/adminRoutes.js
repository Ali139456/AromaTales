import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import supabase, { isSupabaseEnabled } from '../config/supabase.js';
import { requireAdmin } from '../middleware/auth.js';
import { formatProduct, toDbPayload } from './productRoutes.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype);
    cb(null, ok);
  }
});

const requireSupabase = (res) => {
  if (!isSupabaseEnabled()) {
    res.status(503).json({ message: 'Database not configured' });
    return false;
  }
  return true;
};

router.use(requireAdmin);

router.get('/products', async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json((data || []).map(formatProduct));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/products', async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(toDbPayload(req.body))
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(formatProduct(data));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { data, error } = await supabase
      .from('products')
      .update(toDbPayload(req.body))
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Product not found' });
    res.json(formatProduct(data));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/upload-image', upload.single('image'), async (req, res) => {
  if (!requireSupabase(res)) return;
  if (!req.file?.buffer) {
    return res.status(400).json({ message: 'Image file required (field name: image)' });
  }
  const ext = (req.file.mimetype.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from('product-images')
    .upload(path, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false
    });
  if (upErr) {
    return res.status(400).json({ message: upErr.message });
  }
  const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path);
  res.json({ url: pub.publicUrl });
});

export default router;
