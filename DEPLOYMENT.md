# SplitMint Deployment Guide

## Overview

This guide will help you deploy SplitMint to Vercel with a Supabase backend.

## Step-by-Step Deployment

### Part 1: Set Up Supabase (5 minutes)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub (recommended) or email

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Project name: `splitmint` (or any name)
   - Database password: Create a strong password (save it!)
   - Region: Choose closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Set Up Database**
   - Click "SQL Editor" in left sidebar
   - Click "+ New query"
   - Open the `supabase-schema.sql` file from the project
   - Copy ALL content and paste into the SQL editor
   - Click "Run" (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

4. **Get API Credentials**
   - Click Settings (gear icon) in left sidebar
   - Click "API"
   - Copy these values:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: Long string starting with `eyJ...`
   - Keep these safe - you'll need them!

5. **Configure Email Authentication** (Optional but recommended)
   - Click "Authentication" in left sidebar
   - Click "Email Templates"
   - Customize confirmation email if desired
   - Note: Email confirmation is required by default

### Part 2: Deploy to Vercel (10 minutes)

#### Option A: Deploy via GitHub (Recommended)

1. **Install Git** (if not already installed)
   - Download from https://git-scm.com/
   - Install with default settings

2. **Create GitHub Repository**
   - Go to https://github.com
   - Click "+" → "New repository"
   - Name: `splitmint`
   - Keep it public or private
   - Don't initialize with README
   - Click "Create repository"

3. **Push Code to GitHub**
   - Open terminal in the `splitmint` folder
   - Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SplitMint app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/splitmint.git
   git push -u origin main
   ```
   - Replace `YOUR_USERNAME` with your GitHub username

4. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "Sign Up" and choose "Continue with GitHub"
   - Click "Add New..." → "Project"
   - Import your `splitmint` repository
   - Click "Import"

5. **Configure Environment Variables**
   - In the "Configure Project" screen:
   - Click "Environment Variables"
   - Add these variables:
     
     Name: `NEXT_PUBLIC_SUPABASE_URL`
     Value: Paste your Supabase Project URL
     
     Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     Value: Paste your Supabase anon key
   
   - Click "Add" for each

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Click "Visit" to see your live app!

#### Option B: Deploy without Git

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from Terminal**
   ```bash
   cd splitmint
   vercel
   ```

3. **Follow Prompts**
   - Link to your Vercel account
   - Confirm project settings
   - Add environment variables when prompted

### Part 3: Test Your Deployment

1. **Visit Your App**
   - Your app will be at: `https://your-project.vercel.app`
   - Vercel will show you the URL after deployment

2. **Test Registration**
   - Click "Register"
   - Enter email and password
   - Check email for verification link
   - Click verification link
   - Log in

3. **Test Features**
   - Create a group
   - Add participants
   - Add an expense
   - Check balances

### Part 4: Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your domain
   - Follow DNS configuration instructions

2. **Update DNS**
   - Add CNAME record pointing to Vercel
   - Wait for propagation (5-30 minutes)

## Troubleshooting

### Build Fails

**Error**: "Module not found"
**Fix**: Make sure all dependencies are in package.json
```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working

**Error**: "supabaseUrl is required"
**Fix**: 
1. Go to Vercel project settings
2. Environment Variables
3. Make sure variables are added
4. Redeploy: Deployments → ⋯ → Redeploy

### Database Connection Error

**Error**: "Failed to fetch" or "Network error"
**Fix**:
1. Check Supabase project is running (not paused)
2. Verify URL and key are correct
3. Make sure RLS policies are created (run SQL schema)

### Authentication Not Working

**Error**: "Invalid login credentials"
**Fix**:
1. User must verify email first
2. Check spam folder for verification email
3. In Supabase: Authentication → Email Templates → check settings

### App Loads But No Data

**Error**: No groups showing up
**Fix**:
1. Open browser console (F12)
2. Look for errors
3. Common issue: RLS policies not created
4. Re-run the SQL schema in Supabase

## Post-Deployment

### Monitor Your App

1. **Vercel Analytics**
   - Go to project → Analytics
   - View traffic, performance

2. **Supabase Monitoring**
   - Database → Pooler → check connections
   - Authentication → Users → see registrations

### Update Your App

1. **Make Changes Locally**
   - Edit code
   - Test with `npm run dev`

2. **Deploy Updates**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
   - Vercel auto-deploys on push!

### Free Tier Limits

**Vercel Free Tier:**
- Unlimited deployments
- 100 GB bandwidth/month
- Custom domains
- Automatic HTTPS

**Supabase Free Tier:**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- Pauses after 1 week of inactivity (just visit to wake up)

## Success! 🎉

Your SplitMint app is now live and accessible worldwide!

**Next Steps:**
1. Share the URL with friends
2. Create your first group
3. Start tracking expenses
4. Consider upgrading if you need more resources

## Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Quick Reference

**Supabase Dashboard**: https://app.supabase.com
**Vercel Dashboard**: https://vercel.com/dashboard
**Your App URL**: https://your-project.vercel.app

---

Enjoy your deployed SplitMint app! 🚀
