# Deployment Guide - Vercel + Render

This guide will help you deploy your Quads Poker app with the frontend on Vercel and the backend + database on Render.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- Your code pushed to a GitHub repository

## Part 1: Push Your Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Part 2: Deploy Backend + Database on Render

### Step 1: Create Render Account
1. Go to https://render.com and sign up (you can use your GitHub account)

### Step 2: Deploy from Dashboard
1. Click **"New +"** button in the top right
2. Select **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file automatically
5. Click **"Apply"**

### Step 3: Wait for Deployment
- Render will create:
  - A PostgreSQL database (quads-poker-db)
  - A web service (quads-poker-api)
- This takes about 5-10 minutes

### Step 4: Run Database Schema
1. Once the database is created, go to the database in your Render dashboard
2. Click **"Connect"** and copy the **External Database URL**
3. On your local machine, run:
```bash
psql "YOUR_EXTERNAL_DATABASE_URL" -f backend/config/schema.sql
```

Alternative: Use Render's built-in psql shell:
1. Click the **"PSQL"** button in your database dashboard
2. Copy and paste the contents of `backend/config/schema.sql` and run it

### Step 5: Configure Environment Variables
1. Go to your web service (quads-poker-api) in Render
2. Click **"Environment"** in the left sidebar
3. Add/update these environment variables:
   - `FRONTEND_URL`: (leave blank for now, we'll update after Vercel deployment)
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (or leave placeholder)
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (or leave placeholder)
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (or leave placeholder)
   - `PORT`: 5000 (should be set automatically)

4. Click **"Save Changes"** (this will redeploy)

### Step 6: Get Your Backend URL
- After deployment completes, copy your backend URL (e.g., `https://quads-poker-api.onrender.com`)
- You'll need this for the frontend configuration

## Part 3: Deploy Frontend on Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com and sign up with GitHub

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Vercel will detect it's a Vite project

### Step 3: Configure Build Settings
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (should be auto-detected)
4. **Output Directory**: `dist` (should be auto-detected)

### Step 4: Add Environment Variable
1. Click **"Environment Variables"**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api` (use the URL from Render Step 6)
3. Click **"Deploy"**

### Step 5: Get Your Frontend URL
- After deployment completes, Vercel will give you a URL (e.g., `https://quads-poker.vercel.app`)

## Part 4: Update Backend CORS

1. Go back to Render dashboard
2. Open your web service (quads-poker-api)
3. Click **"Environment"**
4. Update `FRONTEND_URL` to your Vercel URL (e.g., `https://quads-poker.vercel.app`)
5. Save changes (this will redeploy)

## Part 5: Test Your Deployment

1. Visit your Vercel URL
2. Try creating an account
3. Test logging in
4. Verify all features work

## Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set
- Make sure database schema was applied successfully

### Frontend Issues
- Check Vercel deployment logs
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors

### CORS Errors
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Don't include trailing slashes

### Database Connection Issues
- Verify the database is running in Render
- Check that the schema was applied correctly
- Test connection using the PSQL button in Render

## Updating Your App

### Frontend Updates
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel will automatically redeploy.

### Backend Updates
```bash
git add .
git commit -m "Update backend"
git push
```
Render will automatically redeploy.

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Backend will spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Database has 90-day expiration (you'll need to recreate it)
- 750 hours/month of usage

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- No sleep/spin-down issues

### Stripe Configuration
To enable payment features:
1. Get your Stripe API keys from https://dashboard.stripe.com
2. Add them to Render environment variables
3. Update the Stripe price IDs in your frontend code

### Custom Domain (Optional)
Both Vercel and Render allow custom domains on free tier:
- **Vercel**: Settings → Domains
- **Render**: Settings → Custom Domain

## Cost Estimates

**Current Setup: $0/month**
- Both services are on free tier
- Suitable for development and small-scale production

**To Upgrade (if needed):**
- Render Pro: $7/month (no spin-down, better performance)
- Vercel Pro: $20/month (more bandwidth, better support)

## Getting Help

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Check the logs in both platforms for error messages
