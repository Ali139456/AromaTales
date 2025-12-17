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

// Seed/Update products
const seedProducts = async () => {
  try {
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
        price: 3000,
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
        price: 3000,
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
        price: 97.99,
        description: 'A fragrance that transcends time, elegant and ever-relevant.',
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedProducts();
});
