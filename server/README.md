# Backend Server Setup

## How to Run the Backend

### 1. Install Dependencies (if not already installed)
```bash
cd server
npm install
```

### 2. Set Up Environment Variables (Optional)
Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection (optional - defaults to localhost)
MONGODB_URI=mongodb://localhost:27017/aroma-tales

# Server Port (optional - defaults to 5001)
PORT=5001

# Email Configuration (optional - for order emails)
EMAIL_USER=info.aromatales@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Frontend URL (optional - for CORS)
FRONTEND_URL=http://localhost:5173
```

**Note:** The server will work with default values if you don't create a `.env` file, but you'll need MongoDB running locally.

### 3. Make Sure MongoDB is Running
If using local MongoDB:
```bash
# On macOS with Homebrew:
brew services start mongodb-community

# Or start MongoDB manually
mongod
```

If using MongoDB Atlas (cloud), set `MONGODB_URI` in your `.env` file.

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5001` (or the PORT you specified).

### 5. Verify It's Running
You should see:
```
MongoDB Connected: localhost
Server running on port 5001
Products seeded/updated successfully
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/cart` - Add item to cart
- `GET /api/cart/:sessionId` - Get cart
- `POST /api/orders` - Create order (sends emails)
- `POST /api/contact` - Send contact form

## Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running or check your `MONGODB_URI`
- **Port already in use**: Change the `PORT` in `.env` or kill the process using port 5001
- **Email errors**: Email functionality is optional - orders will still be saved even if emails fail

