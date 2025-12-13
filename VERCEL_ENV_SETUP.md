# Vercel Environment Variables Setup Guide

This guide will walk you through setting up environment variables on Vercel for your Aroma Tales website.

## Important: Frontend vs Backend

- **Frontend (Vercel)**: Only needs `VITE_API_URL` (your backend API URL)
- **Backend (Railway/Render)**: Needs email and MongoDB credentials

**Note:** Vercel is for your React frontend. Your backend (Node.js server) should be deployed separately on Railway or Render, where you'll add the email and MongoDB credentials.

---

## Part 1: Frontend Environment Variables on Vercel

### Step 1: Go to Your Vercel Project

1. Log in to [Vercel](https://vercel.com)
2. Click on your **AromaTales** project (or import it if not already deployed)

### Step 2: Navigate to Settings

1. Click on the **Settings** tab (at the top of the project page)
2. In the left sidebar, click on **Environment Variables**

### Step 3: Add Frontend Environment Variable

**For Frontend (Vercel):**

1. Click **Add New** button
2. Fill in:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.railway.app/api` (or your backend URL)
     - Replace `your-backend-url` with your actual backend deployment URL
     - Example: `https://aroma-tales-backend.railway.app/api`
   - **Environment:** Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Click **Save**

**Note:** If your backend is not yet deployed, you can:
- Deploy backend first on Railway/Render
- Get the backend URL
- Then add this variable

---

## Part 2: Backend Environment Variables (Railway or Render)

Since Vercel is for frontend only, your backend needs to be deployed separately. Here are the options:

### Option A: Railway.app (Recommended - Easy Setup)

#### Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up/Log in with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Select your `AromaTales` repository
6. Select the **server** folder (or configure root directory)
7. Railway will auto-detect Node.js

#### Step 2: Add Environment Variables on Railway

1. In your Railway project, click on the service
2. Click on the **Variables** tab
3. Click **+ New Variable** for each:

   **Variable 1:**
   - Key: `EMAIL_USER`
   - Value: `info.aromatales@gmail.com`
   - Click **Add**

   **Variable 2:**
   - Key: `EMAIL_PASSWORD`
   - Value: `your_16_character_app_password`
   - (Get this from Gmail App Passwords - see GMAIL_SETUP.md)
   - Click **Add**

   **Variable 3:**
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/aromatales`
   - (Your MongoDB Atlas connection string)
   - Click **Add**

   **Variable 4:**
   - Key: `PORT`
   - Value: Railway will auto-assign, but you can set `PORT` (optional)

   **Variable 5 (Optional):**
   - Key: `FRONTEND_URL`
   - Value: `https://your-vercel-url.vercel.app`
   - (Your Vercel frontend URL)

4. Railway will automatically redeploy with new variables

#### Step 3: Get Backend URL from Railway

1. In Railway, click on your service
2. Go to **Settings** → **Networking**
3. Click **Generate Domain** (or use provided domain)
4. Copy the URL (e.g., `https://aroma-tales-backend.railway.app`)
5. **Go back to Vercel** and update `VITE_API_URL` to: `https://your-railway-url.railway.app/api`

---

### Option B: Render.com

#### Step 1: Deploy Backend to Render

1. Go to [Render.com](https://render.com)
2. Sign up/Log in with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name:** `aroma-tales-backend`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

#### Step 2: Add Environment Variables on Render

1. In your Render service, scroll to **Environment Variables**
2. Click **Add Environment Variable** for each:

   **Variable 1:**
   - Key: `EMAIL_USER`
   - Value: `info.aromatales@gmail.com`

   **Variable 2:**
   - Key: `EMAIL_PASSWORD`
   - Value: `your_16_character_app_password`

   **Variable 3:**
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/aromatales`

   **Variable 4 (Optional):**
   - Key: `FRONTEND_URL`
   - Value: `https://your-vercel-url.vercel.app`

3. Click **Save Changes**
4. Render will automatically redeploy

#### Step 3: Get Backend URL from Render

1. In Render, your service will have a URL like: `https://aroma-tales-backend.onrender.com`
2. **Go back to Vercel** and update `VITE_API_URL` to: `https://your-render-url.onrender.com/api`

---

## Step-by-Step: Complete Vercel Setup

### Step 1: Add Environment Variable in Vercel Dashboard

1. **Login to Vercel:**
   - Go to https://vercel.com/login
   - Sign in with your GitHub account

2. **Open Your Project:**
   - Click on **AromaTales** project
   - Or click **Add New** → **Project** → Import from GitHub → Select `AromaTales`

3. **Go to Settings:**
   - Click **Settings** tab (top navigation)

4. **Open Environment Variables:**
   - Click **Environment Variables** in left sidebar

5. **Add New Variable:**
   ```
   Click: "Add New"
   
   Key: VITE_API_URL
   Value: https://your-backend-url.railway.app/api
   (Or your actual backend URL + /api)
   
   Environments: Select all
   ☑️ Production
   ☑️ Preview  
   ☑️ Development
   
   Click: "Save"
   ```

6. **Redeploy (Important!):**
   - Go to **Deployments** tab
   - Click the **three dots** (⋯) on latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger redeploy

---

## Visual Guide: Vercel Environment Variables

### Where to Find Environment Variables:

```
Vercel Dashboard
└── Your Project (AromaTales)
    └── Settings (top nav)
        └── Environment Variables (left sidebar)
            └── Add New
```

### What to Add:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-backend.railway.app/api` | All (Production, Preview, Development) |

---

## Verification Steps

### 1. Check Frontend (Vercel)
- After redeploy, visit your Vercel URL
- Open browser console (F12)
- Check if API calls are going to correct backend URL

### 2. Check Backend (Railway/Render)
- Check backend logs for startup messages
- Test endpoint: `https://your-backend-url.com/api/products`
- Should return products JSON

### 3. Test Checkout
- Add item to cart
- Complete checkout
- Check your email: `info.aromatales@gmail.com`
- Should receive order notification

---

## Troubleshooting

### Environment Variable Not Working?

1. **Redeploy After Adding Variables:**
   - Vercel doesn't apply env vars to existing deployments
   - You MUST redeploy after adding variables

2. **Check Variable Name:**
   - Frontend: Must start with `VITE_` (e.g., `VITE_API_URL`)
   - Backend: Regular names (e.g., `EMAIL_USER`)

3. **Check Backend URL:**
   - Must include `/api` at the end
   - Example: `https://backend.railway.app/api` ✅
   - Example: `https://backend.railway.app` ❌

4. **Check Backend Logs:**
   - Railway/Render logs will show if env vars are loaded
   - Look for "Server running on port..." message

### Common Issues:

**Issue:** Frontend can't connect to backend
- **Fix:** Check `VITE_API_URL` is correct and includes `/api`
- **Fix:** Ensure backend is deployed and running
- **Fix:** Check CORS settings on backend

**Issue:** Emails not sending
- **Fix:** Check `EMAIL_PASSWORD` on backend (Railway/Render)
- **Fix:** Verify Gmail App Password is correct (16 chars, no spaces)
- **Fix:** Check backend logs for email errors

**Issue:** MongoDB connection fails
- **Fix:** Check `MONGODB_URI` on backend
- **Fix:** Ensure MongoDB Atlas allows connections from Railway/Render IPs
- **Fix:** Check MongoDB connection string format

---

## Quick Checklist

### Frontend (Vercel):
- [ ] `VITE_API_URL` added
- [ ] Redeployed after adding variable
- [ ] Backend URL includes `/api`

### Backend (Railway/Render):
- [ ] `EMAIL_USER` = `info.aromatales@gmail.com`
- [ ] `EMAIL_PASSWORD` = Gmail App Password (16 chars)
- [ ] `MONGODB_URI` = MongoDB connection string
- [ ] Backend deployed and running
- [ ] Backend URL copied to Vercel `VITE_API_URL`

### Testing:
- [ ] Frontend loads on Vercel
- [ ] Products load from backend
- [ ] Can add items to cart
- [ ] Checkout works
- [ ] Emails received at `info.aromatales@gmail.com`

---

## Need Help?

1. Check backend logs on Railway/Render
2. Check Vercel deployment logs
3. Verify all environment variables are set
4. Ensure all services are deployed and running
5. Test endpoints manually (e.g., `/api/products`)

---

**Remember:** 
- ✅ Vercel = Frontend only (needs `VITE_API_URL`)
- ✅ Railway/Render = Backend (needs email & MongoDB credentials)
- ✅ Always redeploy after adding environment variables!
