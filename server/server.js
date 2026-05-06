import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase, { isSupabaseEnabled } from './config/supabase.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { defaultProducts } from './data/defaultProducts.js';

dotenv.config();

const app = express();

const expandOrigins = (list) => {
  const out = new Set(list.filter(Boolean));
  for (const o of [...out]) {
    try {
      const u = new URL(o);
      const host = u.hostname;
      if (host.startsWith('www.')) {
        out.add(`${u.protocol}//${host.slice(4)}`);
      } else if (host !== 'localhost' && !host.startsWith('127.')) {
        out.add(`${u.protocol}//www.${host}`);
      }
    } catch {
      /* ignore bad URL */
    }
  }
  return [...out];
};

const buildCorsOrigin = () => {
  const raw = process.env.FRONTEND_URL;
  if (!raw || raw === '*') {
    return true;
  }
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const origins = expandOrigins(list);
  return (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (origins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  };
};

const corsOptions = {
  origin: buildCorsOrigin(),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    supabase: isSupabaseEnabled(),
    timestamp: new Date().toISOString()
  });
};

app.get('/api/health', healthHandler);

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

/* Vercel rewrites /api/* → /api; the function often sees paths without the /api prefix (e.g. /products). */
if (process.env.VERCEL) {
  app.get('/health', healthHandler);
  app.use('/products', productRoutes);
  app.use('/cart', cartRoutes);
  app.use('/orders', orderRoutes);
  app.use('/contact', contactRoutes);
  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
}

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An internal server error occurred. Please try again later.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const seedProducts = async () => {
  if (!isSupabaseEnabled()) {
    console.log('Skipping product seed - Supabase not configured');
    return;
  }
  try {
    for (let index = 0; index < defaultProducts.length; index += 1) {
      const product = defaultProducts[index];
      const { error } = await supabase
        .from('products')
        .upsert(
          {
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            image: product.image,
            in_stock: product.inStock,
            sort_order: index
          },
          { onConflict: 'name' }
        );
      if (error) {
        console.error(`Failed to seed ${product.name}:`, error.message);
      }
    }
    console.log('Products seeded/updated successfully');
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};

const PORT = process.env.PORT || 5001;

if (process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    setTimeout(() => {
      seedProducts().catch((err) => {
        console.error('Error seeding products:', err.message);
      });
    }, 1000);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is already in use!\n`);
      console.log('To fix this, you can:');
      console.log(`1. Kill the process using port ${PORT}:`);
      console.log(`   lsof -ti:${PORT} | xargs kill -9\n`);
      console.log('2. Or use a different port:');
      console.log(`   PORT=5002 npm run dev\n`);
      process.exit(1);
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });
} else {
  console.log('Running in serverless mode (Vercel)');
}

export default app;
