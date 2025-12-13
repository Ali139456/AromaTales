# Vercel Deployment Guide

## Quick Start

### Option 1: Deploy Frontend Only (Backend on Separate Service)

1. **Push your code to GitHub**

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

3. **Set Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Example: `https://your-backend-api.railway.app/api` or `https://your-backend-api.render.com/api`

4. **Deploy Backend Separately:**
   - Deploy backend to Railway, Render, or any Node.js hosting
   - Update `VITE_API_URL` in Vercel with your backend URL

### Option 2: Full Stack on Vercel (Serverless Functions)

If you want everything on Vercel, you'll need to convert Express routes to Vercel serverless functions.

## Environment Variables Needed

### Frontend (Vercel)
- `VITE_API_URL` - Your backend API URL

### Backend (Separate Hosting - Railway/Render/Heroku)
- `PORT` - Server port (usually auto-set)
- `MONGODB_URI` - MongoDB connection string (use MongoDB Atlas for cloud)
- `EMAIL_USER` - info.aromatales@gmail.com
- `EMAIL_PASSWORD` - Gmail App Password
- `NODE_ENV` - production

## Recommended Setup

1. **Frontend:** Deploy to Vercel (this repo)
2. **Backend:** Deploy to Railway.app or Render.com (server folder)
3. **Database:** Use MongoDB Atlas (free tier available)

## Steps to Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select your repository and the `server` folder
4. Add environment variables:
   - `MONGODB_URI` (from MongoDB Atlas)
   - `EMAIL_USER=info.aromatales@gmail.com`
   - `EMAIL_PASSWORD` (Gmail App Password)
   - `NODE_ENV=production`
5. Railway will provide a URL like `https://your-app.up.railway.app`
6. Use this URL in Vercel's `VITE_API_URL`: `https://your-app.up.railway.app/api`

## Steps to Deploy Frontend to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Follow prompts, or connect via GitHub
4. Set environment variable `VITE_API_URL`
5. Deploy!

## MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all, or specific IPs)
5. Get connection string
6. Use in `MONGODB_URI` environment variable

## Important Notes

- Make sure `public/assets` folder is included (images)
- Backend must be deployed separately or converted to serverless functions
- MongoDB Atlas recommended for production database
- Gmail App Password required for email functionality
