import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '../../../lib/supabaseClient';

export async function GET() {
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
  });
}

