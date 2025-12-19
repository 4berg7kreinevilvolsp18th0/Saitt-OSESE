# Troubleshooting

Common problems and how to fix them.

## Site Shows 404 Error

### On Vercel

**Most likely:** Root Directory not set

1. Vercel Dashboard → Your Project → **Settings** → **General**
2. Find **Root Directory**
3. Set it to: `frontend/nextjs`
4. Save and redeploy

**Other causes:**
- Environment variables missing → Add them in Settings
- Build failed → Check build logs
- Wrong framework → Should be Next.js

### Local Development

- Make sure you're in `frontend/nextjs` folder
- Run `npm install` first
- Check that `.env.local` exists

## "Supabase не настроен" Error

This means the site can't connect to the database.

**Fix:**
1. Check `.env.local` (local) or Vercel environment variables
2. Make sure you have:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart dev server or redeploy

**Getting the keys:**
- Supabase Dashboard → Settings → API
- Copy Project URL and anon public key

## "Forbidden use of secret API key" Error

**Problem:** You're using the wrong key.

**Fix:**
1. In Vercel, check `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Make sure it's the **anon public** key, not service_role
3. Get the right key from Supabase → Settings → API → anon public
4. Update and redeploy

**Why this matters:** service_role key bypasses all security. Never use it in frontend!

## Database Errors

### "Table does not exist"

You haven't created the tables yet:

1. Supabase → SQL Editor
2. Run `database/schema.sql`
3. Wait for "Success" message

### "RLS policy violation"

Security policies are blocking access:

1. Check that you ran `schema.sql` (it sets up policies)
2. Make sure content status is "published" (not "draft")
3. Check Supabase → Authentication → Policies

### Empty database

You need to add data:

1. Run `database/seed.sql` for sample data
2. Or create content through admin panel

## Build Errors

### TypeScript errors

Fix them locally first:

```bash
cd frontend/nextjs
npm run build
```

Fix any errors that show up, then push.

### "Module not found"

- Run `npm install` again
- Check that `package.json` is in `frontend/nextjs/`
- Delete `node_modules` and reinstall

### Build succeeds but site doesn't work

- Check environment variables
- Check browser console (F12) for errors
- Look at Vercel function logs

## Login Issues

### Can't log in to admin

1. Make sure user exists in Supabase → Authentication → Users
2. Check that user has a role (SQL Editor → `user_roles` table)
3. Try resetting password in Supabase

### "Access denied"

User doesn't have the right role. Add a role:

```sql
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('user-uuid', 'board', NULL);
```

## Content Not Showing

### Published content not visible

1. Check content status = "published" (not "draft")
2. Check browser console for errors
3. Make sure Supabase is connected

### Can't edit content

1. Make sure you're logged in
2. Check that you have the right role (board, lead, or staff)
3. Try logging out and back in

## Telegram Posts Not Loading

This is expected if you haven't set up the API yet.

**Current status:** Shows placeholder content with link to channel.

**To get real posts:**
- See [Telegram integration guide](features.md#telegram-integration)
- Requires setting up Telegram Bot API or RSS feed

## Theme Not Switching

1. Check browser console for errors
2. Try hard refresh (Ctrl+Shift+R)
3. Clear browser cache
4. Check that `ThemeProvider` is in layout

## Still Stuck?

1. Check Vercel build logs
2. Check Supabase logs
3. Check browser console (F12)
4. Make sure all environment variables are set
5. Try redeploying

If nothing works, check the specific guides:
- [Deployment](deployment.md)
- [Database setup](database.md)
- [Getting started](getting-started.md)

