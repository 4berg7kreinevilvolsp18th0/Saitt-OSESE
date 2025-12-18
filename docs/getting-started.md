# Getting Started

Quick guide to set up and run the OSS DVFU website locally.

## What You Need

- Node.js 18 or newer
- npm (comes with Node.js)
- A Supabase account (free)
- A GitHub account (for deployment)

## First Time Setup

### 1. Get the Code

```bash
git clone <your-repo-url>
cd "Saitt OSESE"
```

### 2. Install Dependencies

```bash
cd frontend/nextjs
npm install
```

This will take a minute or two.

### 3. Set Up Supabase

You need a database. The easiest way is Supabase (it's free).

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Give it a name (like "oss-dvfu")
4. Choose a region close to you
5. Set a database password (save it somewhere!)
6. Wait 2-3 minutes for it to create

### 4. Get Your Supabase Keys

1. In Supabase, go to **Settings** → **API**
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon public** key (long string starting with `eyJ...`)

**Important:** Use the **anon public** key, NOT the service_role key!

### 5. Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Open the file `database/schema.sql` from this project
3. Copy all the SQL code
4. Paste it into SQL Editor and click "Run"
5. (Optional) Do the same with `database/seed.sql` to add sample data

### 6. Configure Environment Variables

Create a file `.env.local` in `frontend/nextjs/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the values with your actual Supabase URL and key.

### 7. Run the Site

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Common Issues

**"Supabase не настроен" error:**
- Check that `.env.local` exists and has the right values
- Make sure you copied the keys correctly (no extra spaces)
- Restart the dev server after changing `.env.local`

**Database errors:**
- Make sure you ran `database/schema.sql` in Supabase
- Check that your Supabase project is active (not paused)

**Port already in use:**
- Another app is using port 3000
- Change it: `npm run dev -- -p 3001`

## Next Steps

- Read [deployment guide](deployment.md) to put the site online
- Read [content editing guide](content-editing.md) to add content
- Check [troubleshooting](troubleshooting.md) if something breaks

