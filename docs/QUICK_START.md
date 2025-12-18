# Quick Start (5 Minutes)

Fastest way to get the site running.

## 1. Install Dependencies

```bash
cd frontend/nextjs
npm install
```

## 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com), sign up
2. Create new project
3. Copy Project URL and anon key from Settings → API
4. In SQL Editor, run `database/schema.sql`

## 3. Configure Environment

Create `frontend/nextjs/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## That's It!

For more details, see:
- [Getting Started](getting-started.md) - Full setup guide
- [Deployment](deployment.md) - Put it online
- [Troubleshooting](troubleshooting.md) - If something breaks

