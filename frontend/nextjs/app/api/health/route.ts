import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '../../../lib/supabaseClient';

// Явно указываем runtime для Vercel (nodejs для работы с импортами)
export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabaseConfigured = isSupabaseConfigured();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: {
        configured: supabaseConfigured,
        url: supabaseUrl ? (supabaseUrl.substring(0, 20) + '...') : 'not set',
        key: supabaseKey ? (supabaseKey.substring(0, 10) + '...') : 'not set',
      },
      environment: process.env.NODE_ENV,
      vercel: {
        region: process.env.VERCEL_REGION || 'unknown',
      },
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}

