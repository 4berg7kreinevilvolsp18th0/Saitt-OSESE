import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabaseClient';

// API endpoint для получения истории изменений обращения
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appealId = params.id;

    if (!appealId) {
      return NextResponse.json(
        { error: 'ID обращения не указан' },
        { status: 400 }
      );
    }

    const { data: history, error } = await supabase
      .from('appeal_history')
      .select('*')
      .eq('appeal_id', appealId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Ошибка загрузки истории:', error);
      return NextResponse.json(
        { error: 'Не удалось загрузить историю' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      history: history || [],
      count: (history || []).length,
    });
  } catch (error: any) {
    console.error('Ошибка:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка' },
      { status: 500 }
    );
  }
}

