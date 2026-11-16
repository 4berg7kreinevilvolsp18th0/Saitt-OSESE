import { NextResponse } from 'next/server';
import { TELEGRAM_CHANNEL } from '../../../../lib/publicContacts';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = (searchParams.get('channel') || TELEGRAM_CHANNEL).replace(/^@/, '');
  if (!/^[a-zA-Z0-9_]+$/.test(channel)) {
    return NextResponse.json({ error: 'Некорректное имя канала' }, { status: 400 });
  }

  return NextResponse.json({
    posts: [],
    channel: `@${channel}`,
    channelUrl: `https://t.me/${channel}`,
  });
}
