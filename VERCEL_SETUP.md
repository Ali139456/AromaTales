# Vercel Deployment Quick Guide

## 🚀 Deploy to Vercel (5 Steps)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings ✅

### Step 3: Deploy Backend (Choose one)

#### Option A: Railway.app (Recommended)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository → Choose `server` folder
4. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   EMAIL_USER=info.aromatales@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   NODE_ENV=production
   PORT=5001
   ```
5. Railway provides URL: `https://your-app.up.railway.app`

#### Option B: Render.com
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub → Select `server` folder
4. Build: `npm install`
5. Start: `npm start`
6. Add same environment variables as above

### Step 4: Set Vercel Environment Variables
In Vercel Dashboard → Your Project → Settings → Environment Variables:

**Add:**
```
VITE_API_URL = https://your-backend-url.railway.app/api
```

Example:
```
VITE_API_URL = https://aroma-backend.up.railway.app/api
```

### Step 5: Redeploy
Vercel will auto-deploy, or click "Redeploy" after adding environment variables.

## 📧 Email Setup (Gmail)
1. Go to [Google Account](https://myaccount.google.com)
2. Security → 2-Step Verification (enable it)
3. Security → App Passwords
4. Generate new app password for "Mail"
5. Use this password in `EMAIL_PASSWORD` (not your regular password!)

## 🗄️ MongoDB Atlas Setup
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create free cluster (M0)
4. Database Access → Create database user
5. Network Access → Add IP (0.0.0.0/0 for all)
6. Connect → Get connection string
7. Use in `MONGODB_URI`:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/aroma-tales
   ```

## ✅ After Deployment
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.railway.app`
- WhatsApp: +92 333 1290243
- Email: info.aromatales@gmail.com

## 🔧 Troubleshooting

**API not working?**
- Check `VITE_API_URL` in Vercel environment variables
- Make sure backend URL includes `/api` at the end
- Check backend logs on Railway/Render

**Images not loading?**
- Images are in `public/assets` - Vercel handles this automatically
- Make sure `setup-images.sh` was run before deploying

**Email not sending?**
- Check Gmail App Password is correct
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in backend env vars

## 📝 Environment Variables Summary

### Frontend (Vercel)
- `VITE_API_URL` = Backend API URL

### Backend (Railway/Render)
- `MONGODB_URI` = MongoDB connection string
- `EMAIL_USER` = info.aromatales@gmail.com
- `EMAIL_PASSWORD` = Gmail App Password
- `NODE_ENV` = production
- `PORT` = 5001 (or auto-set by hosting)
