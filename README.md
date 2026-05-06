# Aroma Tales · Premium Perfume Website

Modern e-commerce site for Aroma Tales, built with **React + Vite** on the frontend and an **Express + Supabase + Resend** API on the backend.

## Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express
- **Database**: Supabase (Postgres)
- **Email**: Resend (transactional)
- **Hosting**: Vercel (frontend); any Node host for the API

## Project Structure

```
aroma/
├── src/                  Frontend React source
│   ├── components/       UI components
│   ├── data/             Frontend fallback product data
│   ├── services/api.js   Backend HTTP client
│   └── App.jsx
├── server/               Express API
│   ├── config/supabase.js
│   ├── data/defaultProducts.js   Seed data (also used as frontend fallback)
│   ├── routes/           Express routers
│   ├── sql/schema.sql    Supabase schema (run once)
│   ├── utils/email.js    Resend integration
│   └── server.js
├── public/assets/        Images, logos
└── vercel.json
```

## Quick Start

### 1. Frontend

```bash
npm install
npm run dev    # http://localhost:5173
```

Build / preview:
```bash
npm run build
npm run preview
```

Frontend env (`.env`, optional in dev):
```env
VITE_API_URL=/api    # In production, set to your deployed API base URL
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in values
npm run dev            # http://localhost:5001
```

See [`server/README.md`](./server/README.md) for the full backend setup, including:
- Supabase project setup + running `server/sql/schema.sql`
- Resend account setup + domain verification
- All required env variables

### 3. Connecting frontend ↔ backend

In dev, Vite's proxy forwards `/api/*` to the backend at `http://localhost:5001`. So as long as the backend is running on port 5001 you don't need to set `VITE_API_URL`.

In production, set `VITE_API_URL` to your API origin (e.g. `https://api.aromatales.shop` if routes are at the root, or include `/api` only if your server is mounted that way).

Live site: **https://aromatales.shop** · contact: **info.aromatales@gmail.com**

## Features

- Responsive luxury landing page with hero, product grid, reviews carousel
- Persistent cart (Supabase-backed, session-based)
- Checkout with COD payment method
- Order confirmation email (customer) + admin notification, both via Resend
- Contact form, also via Resend
- Standalone product detail pages with image lightbox + suggested products
- Graceful offline mode: if the API is unreachable, the frontend falls back to a local product catalogue and a local cart so the site never appears broken

## Resilience

The frontend is designed to never crash if the backend is down:
- Products are seeded into the UI from `src/data/defaultProducts.js`, then replaced when the API responds
- Cart operations transparently fall back to React state if the API fails
- The order success modal displays even when the email send fails (orders are still saved)

## Deployment

### Frontend (Vercel)
1. Push the repo to GitHub
2. Import in Vercel — it detects Vite automatically
3. Add `VITE_API_URL` env var pointing to your deployed backend

### Backend
The Express app runs anywhere Node 18+ does:
- Render, Railway, Fly.io, DigitalOcean App Platform — recommended
- Vercel serverless (the app exports `default app` and skips `app.listen` when `VERCEL=1`)

Make sure to set all backend env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`, `FRONTEND_URL`) on the host. Use `FRONTEND_URL=https://aromatales.shop` in production for CORS.

## Scripts

### Root
- `npm run dev` — Vite dev server
- `npm run build` — production build → `dist/`
- `npm run preview` — preview the build locally

### `server/`
- `npm run dev` — nodemon
- `npm start` — node

## Notes

- Keep `server/data/defaultProducts.js` and `src/data/defaultProducts.js` in sync — they intentionally share the same product list.
- The Supabase service-role key bypasses RLS and must stay on the server. Never put it in a `VITE_` variable.
