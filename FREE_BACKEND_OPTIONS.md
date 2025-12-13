# Free Backend Hosting Options

## Why Vercel Can't Host Your Backend Directly

**Vercel is for frontend only** - it hosts static sites and serverless functions (short-lived). Your backend needs:
- Continuous running server (to keep MongoDB connection alive)
- Background email sending
- Persistent processes

**Solution:** Use a free backend hosting service OR convert to Vercel Serverless Functions.

---

## Option 1: Render.com (FREE - Recommended)

Render.com offers **FREE web services** that stay running.

### Setup Steps:

#### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub (free)

#### Step 2: Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Select your `AromaTales` repo

#### Step 3: Configure Service
```
Name: aroma-tales-backend
Region: Choose closest to you
Branch: main
Root Directory: server
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

#### Step 4: Add Environment Variables
In Render dashboard, scroll to **Environment Variables** section:

Click **Add Environment Variable** for each:

```
Key: EMAIL_USER
Value: info.aromatales@gmail.com
```

```
Key: EMAIL_PASSWORD
Value: your_16_character_gmail_app_password
```

```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/aromatales
```

```
Key: PORT
Value: (Leave empty - Render auto-assigns)
```

#### Step 5: Deploy
1. Click **Create Web Service**
2. Wait for deployment (takes 2-3 minutes)
3. Render will give you a URL like: `https://aroma-tales-backend.onrender.com`

#### Step 6: Update Vercel
1. Go to Vercel → Settings → Environment Variables
2. Update `VITE_API_URL` to: `https://aroma-tales-backend.onrender.com/api`

**Note:** Free tier on Render spins down after 15 minutes of inactivity (first request after spin-down takes ~30 seconds to wake up)

---

## Option 2: Fly.io (FREE - Always On)

Fly.io offers **FREE tier** with always-on services.

### Setup Steps:

#### Step 1: Install Fly CLI
```bash
# macOS
curl -L https://fly.io/install.sh | sh

# Or download from: https://fly.io/docs/getting-started/installing-flyctl/
```

#### Step 2: Sign Up
```bash
fly auth signup
```

#### Step 3: Launch App
```bash
cd server
fly launch
```

Follow the prompts:
- App name: `aroma-tales-backend` (or any name)
- Region: Choose closest
- PostgreSQL: No (we use MongoDB)
- Redis: No

#### Step 4: Add Environment Variables
```bash
fly secrets set EMAIL_USER=info.aromatales@gmail.com
fly secrets set EMAIL_PASSWORD=your_16_character_password
fly secrets set MONGODB_URI=your_mongodb_connection_string
```

#### Step 5: Deploy
```bash
fly deploy
```

#### Step 6: Get URL
```bash
fly info
```
Copy the URL and update Vercel `VITE_API_URL`

---

## Option 3: Cyclic.sh (FREE - Serverless)

Cyclic.sh offers free serverless hosting for Node.js.

### Setup Steps:

#### Step 1: Sign Up
1. Go to https://cyclic.sh
2. Sign up with GitHub

#### Step 2: Create App
1. Click **Create App**
2. Connect GitHub repository
3. Select branch: `main`
4. Root directory: `server`
5. Framework: Express

#### Step 3: Add Environment Variables
In Cyclic dashboard:
- Go to **Environment** tab
- Add variables:
  - `EMAIL_USER`
  - `EMAIL_PASSWORD`
  - `MONGODB_URI`

#### Step 4: Deploy
1. Click **Deploy**
2. Cyclic gives you a URL: `https://your-app.cyclic.app`

---

## Option 4: Replit (FREE - Simple)

Replit offers free hosting with easy setup.

### Setup Steps:

#### Step 1: Sign Up
1. Go to https://replit.com
2. Sign up (free)

#### Step 2: Import Project
1. Click **Create Repl**
2. Select **Import from GitHub**
3. Enter: `Ali139456/AromaTales`
4. Select **Node.js** template

#### Step 3: Configure
1. Open `server` folder
2. Go to **Secrets** (lock icon in sidebar)
3. Add:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `MONGODB_URI`

#### Step 4: Run
1. Click **Run** button
2. Replit provides a URL

---

## Option 5: Vercel Serverless Functions (FREE - Requires Code Changes)

You CAN use Vercel Serverless Functions, but it requires refactoring your backend code. This is more complex.

**Pros:**
- Everything in one place (Vercel)
- Free tier is generous

**Cons:**
- Need to convert Express routes to serverless functions
- MongoDB connection needs to be handled differently
- More complex setup

If you want this option, I can help convert your backend to serverless functions.

---

## Comparison Table

| Service | Free Tier | Always On | Setup Difficulty | Best For |
|---------|-----------|-----------|------------------|----------|
| **Render** | ✅ Yes | ⚠️ Spins down after 15min | Easy | Beginners |
| **Fly.io** | ✅ Yes | ✅ Yes | Medium | Always-on needs |
| **Cyclic** | ✅ Yes | ✅ Yes | Easy | Serverless |
| **Replit** | ✅ Yes | ✅ Yes | Very Easy | Quick testing |
| **Vercel Functions** | ✅ Yes | ✅ Yes | Hard | Single platform |

---

## My Recommendation: Render.com

**Why Render?**
- ✅ Free forever
- ✅ Easy setup (similar to Heroku)
- ✅ Good documentation
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variable management

**Only downside:** Free tier spins down after 15 minutes of inactivity (first request takes ~30 seconds)

---

## Quick Setup: Render.com (Step-by-Step)

### 1. Go to Render
https://render.com → Sign up with GitHub

### 2. Create Web Service
```
New + → Web Service
→ Connect GitHub → Select AromaTales repo
```

### 3. Configure
```
Name: aroma-tales-backend
Root Directory: server
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 4. Add Environment Variables
Scroll down to **Environment Variables**, click **Add**:
```
EMAIL_USER = info.aromatales@gmail.com
EMAIL_PASSWORD = your_gmail_app_password
MONGODB_URI = your_mongodb_connection
```

### 5. Deploy
Click **Create Web Service** → Wait 2-3 minutes

### 6. Get Your URL
Render gives you: `https://aroma-tales-backend.onrender.com`

### 7. Update Vercel
```
Vercel → Settings → Environment Variables
VITE_API_URL = https://aroma-tales-backend.onrender.com/api
→ Redeploy
```

**Done!** Your backend is now running for FREE on Render.

---

## Need Help?

Choose one option and I can help you set it up step-by-step!
