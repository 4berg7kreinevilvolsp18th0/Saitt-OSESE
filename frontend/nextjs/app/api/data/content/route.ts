import { NextRequest, NextResponse } from 'next/server';
import { getPublishedContent, getPublishedContentByType } from '../../../../lib/repositories/contentRepo';
import { useVercelPostgres } from '../../../../lib/db';
import { supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') as 'news' | 'guide' | 'faq' | null;
    const limitRaw = request.nextUrl.searchParams.get('limit');
    const limit = limitRaw ? Number(limitRaw) : undefined;

    if (useVercelPostgres) {
      const rows = type ? await getPublishedContentByType(type, limit) : await getPublishedContent(limit);
      return NextResponse.json({ data: rows });
    }

    let query = supabase
      .from('content')
