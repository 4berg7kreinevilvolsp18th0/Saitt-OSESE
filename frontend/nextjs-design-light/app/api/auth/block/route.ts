import { NextRequest, NextResponse } from 'next/server';
import { blockIP, isIPBlocked, checkRateLimitRedis } from '../../../../lib/redis';

export const dynamic = 'force-dynamic';

/**
 * API для серверной блокировки входа
 * БЕЗОПАСНОСТЬ: Блокировка на сервере, не на клиенте
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    const ip = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    
    // Комбинированный ключ: IP + email (первые 3 символа)
    const key = `login:${ip}:${email ? email.substring(0, 3) : 'unknown'}`;
    
    // Проверить rate limit (5 попыток в минуту)
    const limit = await checkRateLimitRedis(key, 5, 60);
    
    if (!limit.allowed) {
      // Блокировать IP на 15 минут после превышения лимита
      await blockIP(ip, 15 * 60);
      
      return NextResponse.json(
        {
          blocked: true,
          retryAfter: Math.ceil((limit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    // Проверить, не заблокирован ли IP
    const isBlocked = await isIPBlocked(ip);
    if (isBlocked) {
      return NextResponse.json(
        {
          blocked: true,
          message: 'IP заблокирован из-за подозрительной активности',
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      blocked: false,
      remaining: limit.remaining,
      resetTime: limit.resetTime,
    });
  } catch (error: any) {
    // Не раскрывать детали ошибки
    return NextResponse.json(
      { error: 'Failed to check block status' },
      { status: 500 }
    );
  }
}

/**
 * Проверка статуса блокировки
 */
export async function GET(request: NextRequest) {
  try {
    const ip = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    
    const isBlocked = await isIPBlocked(ip);
    
    return NextResponse.json({
      blocked: isBlocked,
      ip: ip === 'unknown' ? null : ip.substring(0, 7) + '***', // Частично скрытый IP
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check block status' },
      { status: 500 }
    );
  }
}

