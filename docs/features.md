# Features Guide

Overview of site features and how they work.

## Dark/Light Theme

The site supports both dark and light themes.

**How to switch:**
- Click the sun/moon icon in the top right of the header
- Your preference is saved automatically
- Works on all pages

**Technical details:**
- Theme is stored in browser localStorage
- Automatically applies on page load
- All components support both themes

## Telegram Integration

The site can display recent posts from the OSS DVFU Telegram channel.

**Channel:** [@oss_dvfu](https://t.me/oss_dvfu)

**Where it appears:**
- Main page, right sidebar
- Shows up to 3 recent posts

**Current status:**
- Component is ready and displays placeholder content
- Links to Telegram channel work
- To show real posts, you need to set up an API (see below)

### Setting Up Real Telegram Posts

**Option 1: Telegram Bot API** (recommended)

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Get bot token
3. Add bot to @oss_dvfu channel as admin
4. Add token to Vercel: `TELEGRAM_BOT_TOKEN` (server-side only!)
5. Update `app/api/telegram/posts/route.ts` to fetch real posts

**Option 2: RSS Feed**

If the channel is public, you can use RSS:
- URL format: `https://rss.app/v1/channels/oss_dvfu/feed`
- Requires RSS parsing library

**Environment variables:**
```env
NEXT_PUBLIC_TELEGRAM_CHANNEL=oss_dvfu
NEXT_PUBLIC_TELEGRAM_API_URL=/api/telegram/posts
```

See [Telegram setup guide](telegram-setup.md) for details.

## Logo

The site uses logo images from the `public/` folder.

**Supported formats:**
- `/Лого вектор белое.png` (primary)
- `/Лого вектор белое.svg` (fallback)
- `/Лого вектор красное.png` (alternative)

**How it works:**
- Component tries PNG first, then SVG
- Falls back to built-in SVG if images not found
- Automatically scales to different sizes

**To add your logo:**
1. Place logo files in `frontend/nextjs/public/`
2. Name them as above, or update component code
3. Logo appears in header and on main page

## Content Management

Content is stored in Supabase and managed through the admin panel.

**Content types:**
- News (`news`) - Announcements and updates
- Guides (`guide`) - How-to articles
- FAQ (`faq`) - Frequently asked questions

**Workflow:**
1. Create content in admin panel
2. Save as draft
3. Review and edit
4. Publish when ready
5. Content appears on site automatically

See [content editing guide](content-editing.md) for details.

## Appeals System

Students can submit appeals through the site.

**Features:**
- Submit anonymously or with contact info
- Choose direction (legal, infrastructure, etc.)
- Get a tracking token
- Check status later

**Admin features:**
- View all appeals in Kanban board
- Filter by status and direction
- Add comments
- Update status
- See statistics

## Statistics Dashboard

Admins can view:
- Total appeals
- Appeals by status
- Appeals by direction
- Average response time
- Charts and graphs

Access at `/admin/dashboards` (requires login).

## User Roles

Different roles have different permissions:

- **student** - Can submit appeals, view public content
- **member** - Can view appeals for their direction
- **lead** - Can manage appeals for their direction
- **board** - Can do everything
- **staff** - Technical support, can manage everything

Roles are managed in Supabase `user_roles` table.

## SEO Features

The site includes:
- Automatic sitemap generation (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Meta tags for social sharing
- Canonical URLs
- Structured data

All configured automatically, no setup needed.

## Need Help?

- [Getting started](getting-started.md)
- [Troubleshooting](troubleshooting.md)
- [Content editing](content-editing.md)

