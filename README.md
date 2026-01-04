# Aroma Tales - Perfume Website

A modern, beautiful perfume e-commerce website built with React and Vite.

## Quick Start

### Frontend (Main Application)

**Development Mode:**
```bash
npm run dev
```
Starts the development server at `http://localhost:5173`

**Build for Production:**
```bash
npm run build
```
Creates an optimized production build in the `dist` folder.

**Preview Production Build:**
```bash
npm run preview
```
Preview the production build locally.

### Backend (API Server)

The backend is in the `server` directory. See [server/README.md](./server/README.md) for detailed instructions.

**Quick Start:**
```bash
cd server
npm install
npm run dev
```

## Project Structure

```
aroma/
├── src/              # Frontend React source code
├── server/           # Backend Express API
├── public/           # Static assets
└── dist/             # Production build (generated)
```

## Available Scripts

### Frontend (Root Directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (Server Directory)
- `npm run dev` - Start backend with auto-reload (nodemon)
- `npm start` - Start backend server

## Deployment

### Frontend on Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite and configure the build
3. The frontend will work with fallback data if backend is unavailable

### Backend
Deploy the backend separately to:
- Render (recommended - free tier)
- Railway
- Heroku
- DigitalOcean App Platform
- Or any Node.js hosting service

## Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL (optional, defaults to `/api`)

### Backend
See [server/README.md](./server/README.md) for backend environment variables.

## Features

- ✅ Modern, responsive design
- ✅ Product catalog with detailed views
- ✅ Shopping cart functionality
- ✅ Order placement system
- ✅ Email notifications (admin & customer)
- ✅ Contact form
- ✅ Fallback data when backend is offline
- ✅ Graceful error handling
- ✅ Pakistani customer reviews

## Technology Stack

- **Frontend**: React, Vite, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Email**: Nodemailer
- **Styling**: CSS3 with modern animations

## Notes

- The frontend works independently with fallback data
- Backend is optional but required for full functionality (orders, cart persistence)
- All error scenarios are handled gracefully
- The site will never crash due to backend unavailability


