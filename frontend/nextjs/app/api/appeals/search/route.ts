import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

// API endpoint для полнотекстового поиска по обращениям
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Поисковый запрос должен содержать минимум 2 символа' },
        { status: 400 }
      );
    }

    const searchQuery = query.trim().toLowerCase();

    // Поиск по заголовку, описанию и контакту
    // Используем ilike для case-insensitive поиска
    const { data: appeals, error } = await supabase
      .from('appeals')
      .select('id, title, description, status, created_at, direction_id, priority')
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,contact_value.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Ошибка поиска:', error);
      return NextResponse.json(
        { error: 'Не удалось выполнить поиск' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      results: appeals || [],
      count: (appeals || []).length,
      query: searchQuery,
    });
  } catch (error: any) {
    console.error('Ошибка поиска:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при поиске' },
      { status: 500 }
    );
  }
}

