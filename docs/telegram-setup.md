# Telegram Channel Setup

How to connect the site to the OSS DVFU Telegram channel [@oss_dvfu](https://t.me/oss_dvfu).

## Current Status

The Telegram integration component is already on the main page. Right now it shows placeholder content with a link to the channel.

To show real posts, you need to set up one of the methods below.

## Quick Setup (RSS Method)

If your channel is public, this is the easiest:

1. Find an RSS feed for your channel (services like rss.app can help)
2. Update `app/api/telegram/posts/route.ts` to parse RSS
3. Add RSS URL to environment variables

## Full Setup (Bot API Method)

More work but gives you full control.

### Step 1: Create a Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot`
3. Follow instructions to name your bot
4. Copy the token BotFather gives you

### Step 2: Add Bot to Channel

1. Go to your channel @oss_dvfu
2. Click channel name → **Administrators**
3. Click **Add Administrator**
4. Search for your bot
5. Give it permission to read messages

### Step 3: Configure API

1. Add bot token to Vercel (server-side only!):
   ```
   TELEGRAM_BOT_TOKEN=your-bot-token-here
   ```
   **Important:** Don't use `NEXT_PUBLIC_` prefix! This is secret.

2. Update `app/api/telegram/posts/route.ts`:
   - The file already has placeholder code
   - Uncomment and configure the Bot API section
   - Handle webhooks or polling to get messages

### Step 4: Test

1. Post something in @oss_dvfu
2. Check if it appears on the website
3. Check Vercel function logs if it doesn't work

## Environment Variables

Add to `.env.local` and Vercel:

```env
NEXT_PUBLIC_TELEGRAM_CHANNEL=oss_dvfu
NEXT_PUBLIC_TELEGRAM_API_URL=/api/telegram/posts
```

For Bot API (Vercel only, not in `.env.local`):
```env
TELEGRAM_BOT_TOKEN=your-secret-token
```

## How It Works

1. Component on main page calls `/api/telegram/posts`
2. API endpoint fetches posts from Telegram (via Bot API or RSS)
3. Returns JSON with posts
4. Component displays them

## Limitations

**Bot API:**
- Can't directly read channel messages
- Need to use webhooks or save messages when posted
- Requires bot to be admin of channel

**RSS:**
- Only works for public channels
- May have rate limits
- Format depends on RSS provider

## Troubleshooting

**Posts not showing:**
- Check that API endpoint works: visit `/api/telegram/posts` directly
- Check Vercel function logs
- Make sure bot has admin access to channel

**"Failed to load" error:**
- Check environment variables
- Verify bot token is correct
- Check that channel name is right (`oss_dvfu`, not `@oss_dvfu`)

## Current Implementation

Right now the component shows:
- Welcome message about the channel
- Link to subscribe
- Placeholder for when real posts are configured

This is fine for now - users can still click through to Telegram. Real posts are optional.

## Need Help?

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- Check [troubleshooting guide](troubleshooting.md)
- Test API endpoint directly: `/api/telegram/posts?channel=oss_dvfu&limit=5`

