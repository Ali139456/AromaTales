# ✅ Vercel Deployment Checklist

## Pre-Deployment

- [x] All images copied to `public/assets`
- [x] Environment variables configured
- [x] MongoDB Atlas account created
- [x] Gmail App Password generated

## Step-by-Step Deployment

### 1. Frontend on Vercel

1. [ ] Push code to GitHub
2. [ ] Go to vercel.com → Add New Project
3. [ ] Import GitHub repository
4. [ ] Vercel auto-detects Vite ✅
5. [ ] Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api`
6. [ ] Deploy!

### 2. Backend on Railway/Render

**Railway.app (Recommended):**
1. [ ] Go to railway.app → New Project
2. [ ] Deploy from GitHub → Select repo
3. [ ] Select `server` folder as root
4. [ ] Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aroma-tales
   EMAIL_USER=info.aromatales@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   NODE_ENV=production
   ```
5. [ ] Copy Railway URL (e.g., `https://xxx.up.railway.app`)
6. [ ] Update `VITE_API_URL` in Vercel: `https://xxx.up.railway.app/api`

### 3. MongoDB Atlas

1. [ ] Create account at mongodb.com/cloud/atlas
2. [ ] Create free cluster (M0)
3. [ ] Create database user
4. [ ] Network Access → Add IP: `0.0.0.0/0`
5. [ ] Connect → Get connection string
6. [ ] Update `MONGODB_URI` in backend env vars

### 4. Gmail Setup

1. [ ] Enable 2-Step Verification
2. [ ] Generate App Password for "Mail"
3. [ ] Use App Password in `EMAIL_PASSWORD` env var

## Post-Deployment

- [ ] Test frontend loads
- [ ] Test products display
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Verify order saved to MongoDB
- [ ] Check email notifications work
- [ ] Test WhatsApp button
- [ ] Test responsive design

## Your URLs

- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-backend.railway.app`
- **Contact:** info.aromatales@gmail.com
- **WhatsApp:** +92 333 1290243

## Quick Commands

```bash
# Deploy to Vercel via CLI
npm i -g vercel
vercel

# Or connect GitHub repo in Vercel dashboard (easier!)
```
