import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

// API endpoint для экспорта обращений в CSV
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const status = searchParams.get('status');
    const directionId = searchParams.get('direction_id');

    // Загружаем обращения
    let query = supabase
      .from('appeals')
      .select(`
        id,
        title,
        description,
        status,
        priority,
        created_at,
        first_response_at,
        closed_at,
        deadline,
        contact_type,
        contact_value,
        is_anonymous,
        direction_id
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (directionId) {
      query = query.eq('direction_id', directionId);
    }

    const { data: appeals, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Не удалось загрузить данные' },
        { status: 500 }
      );
    }

    if (format === 'csv') {
      // Формируем CSV
      const headers = [
        'ID',
        'Тема',
        'Описание',
        'Статус',
        'Приоритет',
        'Направление',
        'Создано',
        'Первый ответ',
        'Закрыто',
        'Дедлайн',
        'Контакт',
        'Анонимно',
      ];

      // Загружаем направления отдельно для маппинга
      const { data: directions } = await supabase
        .from('directions')
        .select('id, title');
      
      const directionsMap = new Map((directions || []).map((d: any) => [d.id, d.title]));

      const rows = (appeals || []).map((appeal: any) => {
        const direction = appeal.direction_id ? (directionsMap.get(appeal.direction_id) || 'Не указано') : 'Не указано';
        const contact = appeal.is_anonymous ? 'Анонимно' : (appeal.contact_value || 'Не указан');
        
        return [
          appeal.id,
          `"${(appeal.title || '').replace(/"/g, '""')}"`,
          `"${(appeal.description || '').replace(/"/g, '""')}"`,
          appeal.status,
          appeal.priority || 'normal',
          direction,
          appeal.created_at ? new Date(appeal.created_at).toLocaleString('ru-RU') : '',
          appeal.first_response_at ? new Date(appeal.first_response_at).toLocaleString('ru-RU') : '',
          appeal.closed_at ? new Date(appeal.closed_at).toLocaleString('ru-RU') : '',
          appeal.deadline ? new Date(appeal.deadline).toLocaleDateString('ru-RU') : '',
          contact,
          appeal.is_anonymous ? 'Да' : 'Нет',
        ];
      });

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.join(',')),
      ].join('\n');

      // Добавляем BOM для правильного отображения кириллицы в Excel
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      return new NextResponse(csvWithBOM, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="appeals-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // JSON формат
    return NextResponse.json({
      appeals: appeals || [],
      exported_at: new Date().toISOString(),
      total: (appeals || []).length,
    });
  } catch (error: any) {
    console.error('Ошибка экспорта:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при экспорте данных' },
      { status: 500 }
    );
  }
}

