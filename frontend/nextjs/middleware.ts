import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting в памяти (в production использовать Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// IP-адреса для блокировки (можно добавить через API)
const blockedIPs = new Set<string>();

// Подозрительные паттерны запросов
const suspiciousPatterns = [
  /admin/i,
  /wp-admin/i,
  /phpmyadmin/i,
  /\.env/i,
  /\.git/i,
  /sql/i,
  /union.*select/i,
  /script.*alert/i,
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ip = request.ip || 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Блокировка по IP
  if (blockedIPs.has(ip)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Проверка подозрительных паттернов
  const userAgent = request.headers.get('user-agent') || '';
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(path) || pattern.test(userAgent)
  );

  if (isSuspicious && !path.startsWith('/api/security/log')) {
    // Логировать подозрительную активность
    console.warn('[SECURITY] Suspicious request:', {
      ip,
      path,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  // Редирект со старого /admin на новый /manage
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const newPath = path.replace('/admin', '/manage');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Rate limiting для API endpoints
  if (path.startsWith('/api/')) {
    const limit = checkRateLimit(ip, path);
    if (!limit.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests', retryAfter: limit.retryAfter }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': limit.retryAfter.toString(),
          },
        }
      );
    }
  }

  // Security headers
  const response = NextResponse.next();
  
  // Добавить security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Скрыть информацию о сервере
  response.headers.set('Server', 'OSS-DVFU');
  response.headers.set('X-Powered-By', ''); // Убрать X-Powered-By

  return response;
}

function checkRateLimit(ip: string, path: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const key = `${ip}:${path}`;
  const record = rateLimitMap.get(key);

  // Разные лимиты для разных endpoints
  let maxRequests = 100;
  let windowMs = 60000; // 1 минута

  if (path.includes('/api/auth') || path.includes('/login')) {
    maxRequests = 5; // 5 попыток входа в минуту
    windowMs = 60000;
  } else if (path.includes('/api/security')) {
    maxRequests = 50;
    windowMs = 60000;
  }

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true, retryAfter: 0 };
}

// Очистка старых записей rate limit каждые 5 минут
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};

