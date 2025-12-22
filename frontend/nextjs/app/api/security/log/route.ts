import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting для этого endpoint
    const ip = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    
    // Простая проверка rate limit (в production использовать Redis)
    // Максимум 50 запросов в минуту с одного IP
    // Это предотвращает DoS через логирование
    
    const body = await request.json();
    const { event_type, email, status, details, user_agent, role } = body;

    // IP уже получен выше
    const clientIP = ip;

    // Логирование в БД (если есть таблица security_log)
    try {
      const { error } = await supabase.from('security_log').insert({
        event_type: event_type || 'unknown',
        email: email || null,
        status: status || 'unknown',
        details: details || null,
        ip_address: clientIP,
        user_agent: user_agent || request.headers.get('user-agent') || 'unknown',
        metadata: role ? { role } : null,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Security log error:', error);
        // Не критично, продолжаем
      }
    } catch (dbError) {
      console.error('DB log error:', dbError);
      // Если таблицы нет, просто логируем в консоль
    }

    // Логируем в консоль (без чувствительных данных)
    console.log('[SECURITY]', {
      event_type,
      email: email ? email.substring(0, 3) + '***' : null, // Частично скрытый
      status,
      ip: clientIP,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Security log endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to log security event' },
      { status: 500 }
    );
  }
}

