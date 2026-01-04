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

// Connect to MongoDB (non-blocking - app continues even if DB fails)
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB on startup:', err.message);
  console.log('App will continue with limited functionality');
});

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Global error handler middleware (must be after routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'An internal server error occurred. Please try again later.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Seed/Update products
const seedProducts = async () => {
  try {
      const products = [
        {
          name: 'Black Stone',
          category: 'Men',
          price: 2550,
          description: `BRIEF
Black Stone is a rich and luxurious fragrance that exudes sophistication and depth. The top notes of Woody and Agarwood provide an earthy and powerful opening, setting the tone for an unforgettable experience. The heart notes of Vanilla and Sweet create a warm and inviting core, adding a soft and creamy sweetness to the composition. The base notes of Sandalwood, Oud, and Powdery create a refined and opulent finish, with the deep richness of oud perfectly balanced by the smoothness of sandalwood. Black Stone is ideal for those who appreciate deep, exotic, and timeless scents.

Major ingredients % wise:
Woody Accord: 12%
Agarwood (Oud) Accord: 10%
Vanilla Extract: 8%
Sweet Accord: 7%
Sandalwood Oil: 9%
Oud Accord: 7%
Powdery Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 12–14 hours (measured in standard atmosphere)

Top Notes: Woody, Agarwood
Middle Notes: Vanilla, Sweet
Base Notes: Sandalwood, Oud, Powdery`,
          image: '/assets/images/products/black-stoner.jpg',
          inStock: false
        },
        {
          name: 'Ocean Safari',
          category: 'Unisex',
          price: 2300,
          description: `BRIEF
Ocean Safari is a refreshing and invigorating fragrance that embodies the spirit of the ocean. The top notes of Woody and Aromatic create a natural, fresh opening, evoking the calm and vastness of the sea breeze. The middle notes of Citrus and Earthy bring a zesty yet grounded heart, adding balance and vibrancy. The base notes of Soft Spicy and Powdery provide a smooth and comforting finish, creating a fragrance that is both energizing and serene. Ocean Safari is the perfect scent for those who enjoy a fresh, clean, and natural fragrance that lasts all day.

Major ingredients % wise:
Woody Accord: 12%
Aromatic Accord: 10%
Citrus Oil Natural: 8%
Earthy Accord: 6%
Soft Spicy Accord: 7%
Powdery Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Moderate
Lasting upto: 8–10 hours (measured in standard atmosphere)

Top Notes: Woody, Aromatic
Middle Notes: Citrus, Earthy
Base Notes: Soft Spicy, Powdery`,
          image: '/assets/images/products/ocean-safari.jpg',
          inStock: false
        },
        {
          name: 'Red Sea',
          category: 'Unisex',
        price: 2350,
        description: `BRIEF
Red Sea is a bold and captivating fragrance that exudes charm and sophistication. The top notes of Apple, Lemon, Neroli, and Bergamot create a fresh and fruity opening, offering a vibrant and energizing start. The heart notes of Rose, Teak Wood, and Patchouli add a warm, woody floral complexity, giving the scent depth and richness. The base notes of Vanilla and Musk provide a creamy, smooth, and sensual finish, leaving a lasting impression of elegance and allure. Red Sea is the perfect fragrance for the modern, confident individual.

Major ingredients % wise:
Apple Accord: 10%
Lemon Oil: 8%
Neroli Oil: 6%
Bergamot Oil: 7%
Rose Absolute: 8%
Teak Wood Accord: 7%
Patchouli Oil: 6%
Vanilla Extract: 7%
Musk Accord: 6%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 10–12 hours (measured in standard atmosphere)

Top Notes: Apple, Lemon, Neroli, Bergamot
Middle Notes: Rose, Teak Wood, Patchouli
Base Notes: Vanilla, Musk`,
          image: '/assets/images/products/Red-Sea.jpg',
          inStock: true
        },
      {
        name: 'Zephyr',
        category: 'Unisex',
        price: 2800,
        description: `BRIEF
Zephyr is a luxurious and enchanting fragrance that captivates with its radiant complexity. The top notes of Woody, Amber, and Warm Spicy create a rich and alluring opening, exuding warmth and sophistication. The middle notes of Fresh Spicy and Metallic add a unique and contemporary twist, enhancing the fragrance's intriguing character. The base notes of White Floral and Animalic provide an opulent and sensual finish, leaving an unforgettable impression of elegance and allure. Zephyr is perfect for those who seek a bold yet refined signature scent.

Major ingredients % wise:
Woody Accord: 12%
Amber Accord: 10%
Warm Spicy Accord: 8%
Fresh Spicy Accord: 7%
Metallic Accord: 6%
White Floral Accord: 8%
Animalic Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 12–14 hours (measured in standard atmosphere)

Top Notes: Woody, Amber, Warm Spicy
Middle Notes: Fresh Spicy, Metallic
Base Notes: White Floral, Animalic`,
        image: '/assets/images/products/zephyr.jpg',
        inStock: true
      },
        {
          name: 'Timeless',
          category: 'Unisex',
          price: 2500,
          description: `BRIEF
Timeless is a vibrant and daring fragrance for men. The top notes combine Citrus, Lavender, and Fresh Spicy for a refreshing and invigorating opening. The middle notes of Aromatic, Floral, and Herbal create an alluring heart with a sophisticated twist. The base notes of Woody, Earthy, Mossy, and a hint of Alcohol bring depth and character, leaving a strong and unforgettable trail. Timeless is the perfect scent for those who embrace their bold and charismatic nature.

Major ingredients % wise:
Citrus Oil Natural: 8%
Lavender Oil Natural – France: 3%
Fresh Spicy Accord: 4%
Aromatic Accord: 3%
Floral Accord: 4%
Herbal Extracts: 2%
Woody Accord: 5%
Earthy Accord: 2%
Moss Absolute: 1.5%
Alcohol: 1.5%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 8–10 hours (measured in standard atmosphere)

Top Notes: Citrus, Lavender, Fresh Spicy
Middle Notes: Aromatic, Floral, Herbal
Base Notes: Woody, Earthy, Mossy, Alcohol`,
          image: '/assets/images/products/timeless.jpg',
          inStock: false
        }
      ];
      
    // Upsert products (update if exists, insert if not) based on name
    for (const product of products) {
      await Product.findOneAndUpdate(
        { name: product.name },
        product,
        { upsert: true, new: true, runValidators: true }
      );
    }
    
    console.log('Products seeded/updated successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

const PORT = process.env.PORT || 5001;

// Only start server if not in serverless environment (Vercel)
if (process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Seed products after a short delay to ensure DB connection
    setTimeout(() => {
      seedProducts().catch(err => {
        console.error('Error seeding products:', err.message);
      });
    }, 1000);
  });

  // Handle server errors gracefully
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use!\n`);
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
  // For Vercel serverless, export the app
  console.log('Running in serverless mode (Vercel)');
}

// Export app for Vercel serverless functions
export default app;
