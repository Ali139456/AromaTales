import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import Product from './models/Product.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Seed initial products
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = [
        {
          name: 'Black Stone',
          category: 'Men',
          price: 91.99,
          description: 'Strong and sophisticated, like polished black stone - mysterious and powerful.',
          image: '/assets/images/products/black-stoner.jpg',
          inStock: false
        },
        {
          name: 'Ocean Safari',
          category: 'Unisex',
          price: 93.99,
          description: 'An adventurous journey through oceanic notes that invigorate the senses.',
          image: '/assets/images/products/ocean-safari.jpg',
          inStock: false
        },
        {
          name: 'Red Sea',
          category: 'Unisex',
          price: 95.99,
          description: 'Deep and captivating, like the mysterious depths of the Red Sea.',
          image: '/assets/images/products/Red-Sea.jpg',
          inStock: true
        },
        {
          name: 'Timeless',
          category: 'Unisex',
          price: 97.99,
          description: 'A fragrance that transcends time, elegant and ever-relevant.',
          image: '/assets/images/products/timeless.jpg',
          inStock: false
        }
      ];
      
      await Product.insertMany(products);
      console.log('Products seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedProducts();
});
