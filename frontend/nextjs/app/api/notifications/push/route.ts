import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    { error: 'Appeals archive mode: push notification endpoint is disabled' },
    { status: 410 }
  );
}

