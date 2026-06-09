import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkRateLimitRedis, isIPBlocked } from './lib/redis';

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

// Публичные пользовательские сценарии, отключенные при переходе на инфопортал.
const deprecatedPublicPrefixes = ['/appeal', '/login', '/register', '/cabinet'];

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.ipify.org https://www.google.com",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Server', 'OSS-DVFU');
  response.headers.set('X-Powered-By', '');
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ip = request.ip || 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Информационный портал: старые пользовательские разделы больше недоступны.
  if (deprecatedPublicPrefixes.some(prefix => path.startsWith(prefix))) {
    return NextResponse.redirect(new URL('/content', request.url));
  }

  // Редирект со старого /admin на новый /manage
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const newPath = path.replace('/admin', '/manage');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  const isProtectedManagePath = path.startsWith('/manage') && path !== '/manage/login';
  if (isProtectedManagePath) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
      const loginUrl = new URL('/manage/login', request.url);
      loginUrl.searchParams.set('next', `${path}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Быстрый путь для информационных страниц: без обращений к Redis.
  const shouldRunHeavySecurityChecks =
    path.startsWith('/api/') || path.startsWith('/manage') || path.startsWith('/admin');

  if (!shouldRunHeavySecurityChecks) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // Блокировка по IP (проверка в Redis) только для чувствительных путей.
  const blockedInRedis = await isIPBlocked(ip);
  if (blockedInRedis || blockedIPs.has(ip)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Проверка подозрительных паттернов на чувствительных путях.
  const userAgent = request.headers.get('user-agent') || '';
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(path) || pattern.test(userAgent)
  );

  if (isSuspicious && !path.startsWith('/api/security/log')) {
    console.warn('[SECURITY] Suspicious request:', {
      ip,
      path,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  // Rate limiting для API endpoints (с Redis)
  if (path.startsWith('/api/')) {
    let maxRequests = 100;
    let windowSeconds = 60;

    if (path.includes('/api/auth') || path.includes('/login')) {
      maxRequests = 5; // 5 попыток входа в минуту
      windowSeconds = 60;
    } else if (path.includes('/api/security')) {
      maxRequests = 50;
      windowSeconds = 60;
    }

    const rateLimitKey = `${ip}:${path}`;
    const limit = await checkRateLimitRedis(rateLimitKey, maxRequests, windowSeconds);
    
    if (!limit.allowed) {
      const retryAfter = Math.ceil((limit.resetTime - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests', retryAfter }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

// Rate limiting теперь использует Redis (см. lib/redis.ts)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|bmp|tiff|css|js|map|txt|xml|woff|woff2|ttf)).*)',
  ],
};

