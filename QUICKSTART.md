# SplitMint - Quick Start Guide

## Prerequisites

You need Node.js installed. Download from: https://nodejs.org/

## Setup Steps

### 1. Install Dependencies

Open terminal in the `splitmint` folder and run:

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to https://supabase.com and create a free account
2. Create a new project (choose a name, password, and region)
3. Wait for the project to finish setting up (~2 minutes)
4. Go to the SQL Editor (left sidebar)
5. Click "New Query"
6. Copy ALL content from `supabase-schema.sql` file and paste it
7. Click "Run" to create all database tables

### 3. Get Supabase Credentials

1. In Supabase, go to Project Settings (gear icon)
2. Click "API" in the left menu
3. Copy the following:
   - Project URL
   - anon/public key

### 4. Create Environment File

Create a new file named `.env.local` in the splitmint folder with this content:

```
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

Replace the values with your actual Supabase credentials.

### 5. Run the Application

```bash
npm run dev
```

Open your browser and go to: http://localhost:3000

## First Steps in the App

1. Click "Register" to create an account
2. Enter your email and password (min 6 characters)
3. Check your email for verification (check spam folder)
4. Click the verification link
5. Log in to the application
6. Create your first group
7. Add expenses and see balances!

## Deploy to Vercel (Optional)

1. Create account at https://vercel.com (sign in with GitHub)
2. Install Git if not already: https://git-scm.com/
3. Initialize git in splitmint folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
4. Push to GitHub (create repository first on github.com)
5. Import project in Vercel from GitHub
6. Add environment variables in Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
7. Deploy!

Your app will be live at: https://your-project.vercel.app

## Troubleshooting

**Problem**: `npx` or `npm` not found
**Solution**: Install Node.js from nodejs.org and restart terminal

**Problem**: Database connection error
**Solution**: Check that .env.local file exists with correct credentials

**Problem**: Can't log in after registration
**Solution**: Check email for verification link (check spam folder)

**Problem**: Supabase RLS error
**Solution**: Make sure you ran the complete SQL schema in Supabase

## Support

Check the README.md file for detailed documentation.
