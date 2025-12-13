# Gmail Integration Setup Guide

This guide will help you set up Gmail to receive order notifications and contact form messages.

## Step 1: Enable 2-Step Verification on Gmail

1. Go to your Google Account: https://myaccount.google.com
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", find **2-Step Verification**
4. If it's not enabled, click **Get started** and follow the setup process
5. Complete the 2-step verification setup

## Step 2: Generate Gmail App Password

1. Go back to your Google Account Security page: https://myaccount.google.com/security
2. Under "Signing in to Google", find **2-Step Verification** (should now show as "On")
3. Click on **App passwords** (you may need to verify your password)
4. Select **Mail** as the app
5. Select **Other (Custom name)** as the device
6. Type "Aroma Tales Website" or any name you prefer
7. Click **Generate**
8. **IMPORTANT:** Copy the 16-character password that appears (e.g., `abcd efgh ijkl mnop`)
   - This password will only be shown once!
   - Store it securely
   - Remove spaces when using it (should be: `abcdefghijklmnop`)

## Step 3: Set Up Environment Variables

### For Local Development:

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```

2. Create a `.env` file (if it doesn't exist):
   ```bash
   touch .env
   ```

3. Add the following to your `.env` file:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_USER=info.aromatales@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password
   ```

   Replace:
   - `your_mongodb_connection_string` with your MongoDB Atlas connection string
   - `your_16_character_app_password` with the app password you generated (without spaces)

### For Production (Vercel/Railway/Render):

1. **Vercel (Frontend):**
   - Go to your Vercel project settings
   - Navigate to **Environment Variables**
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

2. **Backend Deployment (Railway/Render):**
   - Go to your backend project settings
   - Navigate to **Environment Variables** or **Variables**
   - Add the following:
     ```
     PORT=5001 (or your assigned port)
     MONGODB_URI=your_mongodb_connection_string
     EMAIL_USER=info.aromatales@gmail.com
     EMAIL_PASSWORD=your_16_character_app_password
     FRONTEND_URL=your_frontend_url (optional, for CORS)
     ```

## Step 4: Test Email Configuration

1. Start your server:
   ```bash
   cd server
   npm run dev
   ```

2. Place a test order through your website
3. Check both:
   - Your inbox: `info.aromatales@gmail.com` (admin notification)
   - Customer's email (order confirmation)

## Troubleshooting

### Email Not Sending?

1. **Check App Password:**
   - Make sure there are NO spaces in the password
   - Use the 16-character password (not your regular Gmail password)
   - Regenerate if you lost it

2. **Check Environment Variables:**
   ```bash
   # In server folder
   node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');"
   ```

3. **Check Server Logs:**
   - Look for email-related errors in the console
   - Common errors:
     - `Invalid login` → Wrong app password
     - `Connection timeout` → Network/firewall issue
     - `Authentication failed` → 2-step verification not enabled

4. **Test Email Service:**
   - The server will continue to work even if emails fail
   - Orders will still be saved to MongoDB
   - Check MongoDB to verify orders are being created

### Still Having Issues?

1. Verify 2-Step Verification is enabled
2. Regenerate the app password
3. Double-check `.env` file formatting (no quotes, no spaces)
4. Restart your server after changing `.env`
5. Check that your Gmail account is not locked/restricted

## Security Notes

- ✅ Never commit your `.env` file to Git (it's in `.gitignore`)
- ✅ Never share your app password
- ✅ Regenerate app password if you suspect it's compromised
- ✅ Use environment variables in production, not hardcoded values

## What Emails Are Sent?

1. **Order Notification** → Sent to `info.aromatales@gmail.com`
   - Contains: Customer info, order details, products, total

2. **Order Confirmation** → Sent to customer's email
   - Contains: Order summary, order number, thank you message

3. **Contact Form** → Sent to `info.aromatales@gmail.com`
   - Contains: Name, email, phone, message from contact form

---

**Need Help?** Contact support or check the server logs for specific error messages.
