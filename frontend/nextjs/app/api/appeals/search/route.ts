import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(
    { error: 'Appeals archive mode: search endpoint is disabled' },
    {
      status: 410,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=1800',
      },
    }
  );
}

