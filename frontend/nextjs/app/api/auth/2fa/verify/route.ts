import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    { error: '2FA временно отключен до отдельного релиза поверх Auth.js/Postgres' },
    { status: 410 }
  );
}

