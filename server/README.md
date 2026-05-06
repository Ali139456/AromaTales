# Aroma Tales · Backend (Express + Supabase + Resend)

## Quick Start

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

```env
# Server
PORT=5001
FRONTEND_URL=http://localhost:5173   # production: https://aromatales.shop

# Supabase
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY

# Resend
RESEND_API_KEY=re_xxx_your_api_key
RESEND_FROM_EMAIL=Aroma Tales <onboarding@resend.dev>
ADMIN_EMAIL=info.aromatales@gmail.com
```

> The server will still boot without these variables, but data and email features will be disabled until they're set.

### 3. Initialise the Supabase schema
Open the Supabase SQL editor and paste the contents of [`server/sql/schema.sql`](./sql/schema.sql), then run it. This creates the `products`, `cart_items`, `orders` and `order_items` tables (plus updated_at triggers and a public read policy on the catalogue).

### 4. Run the server
```bash
npm run dev      # auto-reload via nodemon
# or
npm start
```

When everything's wired up you'll see:
```
Supabase client initialised
Resend email client initialised
Server running on port 5001
Products seeded/updated successfully
```

The first run will upsert the five demo products into Supabase using the canonical list at `server/data/defaultProducts.js`.

## Where to get the keys

| Variable | Where |
| --- | --- |
| `SUPABASE_URL` | Supabase dashboard → Project Settings → API → "Project URL" |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → "service_role" key (server-only, never expose to the browser) |
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `RESEND_FROM_EMAIL` | A verified domain on Resend, e.g. `Aroma Tales <hello@aromatales.com>`. Until a domain is verified, you can use `onboarding@resend.dev` |
| `ADMIN_EMAIL` | Where order/contact form notifications should land |

## API Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check (also reports Supabase connection) |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/cart/:sessionId` | Get cart |
| POST | `/api/cart/:sessionId/items` | Add item |
| PUT | `/api/cart/:sessionId/items/:itemId` | Update quantity |
| DELETE | `/api/cart/:sessionId/items/:itemId` | Remove item |
| DELETE | `/api/cart/:sessionId` | Empty cart |
| POST | `/api/orders` | Place order (sends 2 Resend emails) |
| GET | `/api/orders` | List all orders (admin) |
| GET | `/api/orders/:id` | Order detail |
| GET | `/api/orders/session/:sessionId` | Orders for a session |
| PUT | `/api/orders/:id/status` | Update order status |
| POST | `/api/contact` | Send a contact form message |

## Troubleshooting

- **"Database not configured" 503**: `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` missing or wrong. Restart server after fixing `.env`.
- **No emails arriving**: Resend rejects sends from unverified domains. Use `onboarding@resend.dev` while you're setting up DNS, then switch to your own domain.
- **Port already in use**: change `PORT` in `.env`, or kill the existing process (`netstat -ano | findstr :5001` on Windows).
