# Aroma Tales Backend API

Backend server for Aroma Tales perfume website using Express and MongoDB.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Make sure MongoDB is running on your system. If not installed, download from [mongodb.com](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud).

3. Create a `.env` file:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/aroma-tales
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_USER=info.aromatales@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here
```

**Important:** To enable email notifications:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords (https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Use that password in EMAIL_PASSWORD (not your regular Gmail password)

4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5001`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart/:sessionId` - Get cart for session
- `POST /api/cart/:sessionId/items` - Add item to cart
- `PUT /api/cart/:sessionId/items/:itemId` - Update item quantity
- `DELETE /api/cart/:sessionId/items/:itemId` - Remove item from cart
- `DELETE /api/cart/:sessionId` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order (sends email notifications)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/session/:sessionId` - Get orders by session
- `PUT /api/orders/:id/status` - Update order status

## Email Notifications

When an order is placed, the system automatically sends:
1. **Admin notification** to `info.aromatales@gmail.com` with order details
2. **Customer confirmation** to the customer's email address

Make sure to set up Gmail App Password in `.env` file for email functionality to work.

## Database

The server automatically seeds the database with 4 products on first run:
- Black Stone (Out of Stock)
- Ocean Safari (Out of Stock)
- Red Sea (In Stock)
- Timeless (Out of Stock)
