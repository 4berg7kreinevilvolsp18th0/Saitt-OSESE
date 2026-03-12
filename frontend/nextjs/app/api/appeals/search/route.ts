import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    { error: 'Appeals archive mode: search endpoint is disabled' },
    { status: 410 }
  );
}

