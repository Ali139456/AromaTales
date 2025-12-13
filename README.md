# Aroma Tales - Premium Perfume Website

A beautiful, modern one-page perfume e-commerce website built with React and Vite.

## Features

- ✨ **Modern UI/UX Design** - Elegant and responsive design with smooth animations
- 🛍️ **Product Catalog** - Display of premium perfume products with images and descriptions
- 🛒 **Shopping Cart** - Full cart functionality with add, remove, and quantity management
- 📱 **Responsive Design** - Optimized for all devices (desktop, tablet, mobile)
- 🎨 **Beautiful Banner** - Eye-catching hero section with call-to-action
- 📄 **About Section** - Brand story and information
- 🔗 **Footer** - Contact information and quick links

## Tech Stack

- React 18
- Vite
- CSS3 (Modern styling with animations)
- Google Fonts (Playfair Display & Inter)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
cd ..
```

3. **Setup images (if not already done):**
```bash
./setup-images.sh
```
This script copies all product images, banners, and logos to the `public/assets` folder for Vite to serve them.

4. **Start MongoDB:**
   - If using local MongoDB, make sure it's running:
   ```bash
   mongod
   ```
   - Or use MongoDB Atlas (cloud) and update the connection string in `server/.env`

5. **Start the backend server:**
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:5000`

6. **In a new terminal, start the frontend:**
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

**Note:** 
- Images have been automatically set up, but if you add new images to the source folders, run `./setup-images.sh` again.
- The backend server automatically seeds the database with 4 products on first run.
- The frontend will fall back to local state if the API is not available.

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Project Structure

```
aroma/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header with cart
│   │   ├── Banner.jsx          # Hero banner section
│   │   ├── Products.jsx        # Product listing component
│   │   ├── ProductCard.jsx     # Individual product card
│   │   ├── CartModal.jsx       # Shopping cart modal
│   │   └── Footer.jsx          # Footer component
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── drive-download-20251213T060439Z-3-001/
│   ├── Website Banners/        # Banner images
│   ├── For Website /           # Product images
│   └── Logo/                   # Logo files
├── index.html
├── package.json
└── vite.config.js
```

## Customization

### Adding Products

Edit the `products` array in `src/components/Products.jsx` to add or modify products:

```javascript
{
  id: 13,
  name: 'New Perfume',
  category: 'Unisex',
  price: 89.99,
  description: 'Product description here',
  image: '/path/to/image.jpg'
}
```

### Styling

Colors and design tokens are defined in `src/index.css` using CSS variables:

```css
:root {
  --primary-gold: #d4af37;
  --primary-dark: #1a1a1a;
  --primary-light: #f5f5f5;
  /* ... */
}
```

### Images

Make sure product and banner images are placed in the appropriate folders:
- Banner images: `drive-download-20251213T060439Z-3-001/Website Banners/`
- Product images: `drive-download-20251213T060439Z-3-001/For Website /`
- Logo: `drive-download-20251213T060439Z-3-001/Logo/`

## Features in Detail

### Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- View total price
- Responsive cart modal

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px
- Touch-friendly interactions
- Optimized images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy Frontend:**
```bash
vercel
```

Or connect your GitHub repository to Vercel dashboard.

3. **Set Environment Variables in Vercel:**
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.railway.app/api`)

4. **Deploy Backend Separately:**
   - Recommended: Railway.app or Render.com
   - See `VERCEL_DEPLOYMENT.md` for detailed instructions

**For detailed deployment instructions, see `VERCEL_DEPLOYMENT.md`**

## License

This project is created for Aroma Tales.

---

**Aroma Tales** - Once Upon A Scent
