# Database Setup

How to set up Supabase (the database) for the OSS DVFU website.

## What is Supabase?

Supabase is like Firebase but for PostgreSQL. It gives you:
- A database to store content, appeals, users
- Authentication (login system)
- Real-time updates
- Free tier that's enough for most projects

## Creating Your Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free)
3. Click **"New Project"**
4. Fill in:
   - **Name:** `oss-dvfu` (or whatever you want)
   - **Database Password:** Make a strong password, save it!
   - **Region:** Pick the closest one
5. Click **"Create new project"**
6. Wait 2-3 minutes

## Getting Your Keys

You'll need two things:

1. **Project URL:**
   - Go to **Settings** → **API**
   - Copy **Project URL** (looks like `https://xxxxx.supabase.co`)

2. **Anon Key:**
   - Same page, find **Project API keys**
   - Copy the **anon public** key (long string starting with `eyJ...`)
   - **Don't use service_role key!** That's secret and should never be in your frontend code.

## Setting Up Tables

The database needs tables. We have a script for that.

1. In Supabase, go to **SQL Editor**
2. Open `database/schema.sql` from this project
3. Copy all the SQL code
4. Paste into SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - that's normal!

This creates:
- `directions` - different committees (legal, infrastructure, etc.)
- `appeals` - student appeals
- `content` - news and guides
- `user_roles` - who can do what
- And more...

## Adding Sample Data (Optional)

If you want some test data:

1. In SQL Editor, open `database/seed.sql`
2. Copy and run it
3. This adds sample directions, appeals, and content

## Setting Up Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. (Optional) Enable Google, GitHub, etc.

## Creating Users

1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter email and password
4. Copy the **User UID** (you'll need it for roles)

## Assigning Roles

After creating a user, give them a role. Go to **SQL Editor** and run:

```sql
-- For board member (can do everything)
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('paste-user-uuid-here', 'board', NULL);

-- For direction lead
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 'paste-user-uuid-here', 'lead', id
FROM directions
WHERE slug = 'legal';  -- change 'legal' to the direction you want

-- For regular member
INSERT INTO user_roles (user_id, role, direction_id)
SELECT 'paste-user-uuid-here', 'member', id
FROM directions
WHERE slug = 'scholarship';  -- change to the direction you want

-- For staff
INSERT INTO user_roles (user_id, role, direction_id)
VALUES ('paste-user-uuid-here', 'staff', NULL);
```

Replace `paste-user-uuid-here` with the actual User UID from Authentication.

## Checking Everything Works

Run this in SQL Editor to see what you have:

```sql
-- Check directions
SELECT * FROM directions;

-- Check if you have any content
SELECT COUNT(*) FROM content;

-- Check users with roles
SELECT * FROM user_roles;
```

## Common Problems

**"relation does not exist" error:**
- You didn't run `schema.sql` yet
- Go back and run it

**Can't log in:**
- Check that Authentication → Email is enabled
- Make sure you created the user correctly
- Check that user has a role assigned

**Data not showing on site:**
- Check that content status is "published" (not "draft")
- Check RLS policies aren't blocking access
- Make sure environment variables are set correctly

## Security Notes

- **Never** put `service_role` key in frontend code
- Always use `anon public` key for frontend
- RLS (Row Level Security) policies control who can see what
- The `schema.sql` sets up basic security policies

## Need More Help?

- [Supabase Docs](https://supabase.com/docs)
- Check [troubleshooting guide](troubleshooting.md)
- Look at Supabase Dashboard logs

