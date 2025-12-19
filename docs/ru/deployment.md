# Deployment Guide

How to put your site online using Vercel. Takes about 10 minutes.

## Before You Start

Make sure you have:
- ✅ Code pushed to GitHub
- ✅ Supabase project created and configured
- ✅ Database tables created (ran `database/schema.sql`)

## Step 1: Push to GitHub

If you haven't already:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find your repository and click **"Import"**

## Step 3: Configure Project

**Important settings:**

```
Framework Preset: Next.js
Root Directory: frontend/nextjs  ← This is critical!
```

Leave other settings as default (Vercel will figure them out).

**Project Name:**
- Use only letters, numbers, and underscores
- Examples: `oss_dvfu_site`, `ossDvfuSite`
- Don't use: `oss-dvfu-site` (no dashes), `123project` (can't start with number)

## Step 4: Add Environment Variables

Before deploying, add these in Vercel:

1. Click **"Environment Variables"**
2. Add each variable:

| Name | Value | Where to find it |
|------|-------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (long string) | Supabase → Settings → API → anon public |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | You'll get this after first deploy |

3. Select all environments: **Production, Preview, Development**
4. Click **"Save"**

## Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site will be live at `https://your-project.vercel.app`

## Step 6: Update Site URL

After first deploy:

1. Copy your site URL from Vercel
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_SITE_URL` with your actual URL
4. Click **"Redeploy"**

## Automatic Deployments

Once set up, every push to GitHub automatically deploys:

```bash
git add .
git commit -m "Update something"
git push
```

Vercel will build and deploy automatically. Check the **Deployments** tab to see progress.

## Troubleshooting

### Site Shows 404 Error

**Most common cause:** Wrong Root Directory

1. Go to **Settings** → **General**
2. Check **Root Directory** = `frontend/nextjs`
3. If it's empty or wrong, set it to `frontend/nextjs`
4. Click **"Redeploy"**

### Build Fails

Check the build logs:

1. Go to **Deployments**
2. Click on the failed deployment
3. Look at **Build Logs** for errors

Common issues:
- Missing environment variables → Add them in Settings
- Wrong Root Directory → Set to `frontend/nextjs`
- TypeScript errors → Fix them locally first

### Site Works But Shows "Supabase не настроен"

1. Check environment variables in Vercel
2. Make sure you used **anon public** key, not service_role
3. Redeploy after adding/changing variables

### Can't Find Root Directory Setting

1. Go to **Settings** → **General**
2. Scroll down to **Root Directory**
3. If you don't see it, you might need to configure it during project creation
4. Or delete and recreate the project with correct settings

## Custom Domain (Optional)

To use your own domain (like `oss-dvfu.ru`):

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow Vercel's instructions to configure DNS
4. Wait for DNS to propagate (can take up to 24 hours)

## Need Help?

- Check [troubleshooting guide](troubleshooting.md)
- Look at Vercel build logs
- Make sure Supabase is set up correctly

