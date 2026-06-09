/**
 * CSRF защита для форм
 */

import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');

/**
 * Генерация CSRF токена
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Валидация CSRF токена
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false;
  }
  
  // Простая проверка равенства
  // В production можно использовать HMAC для более сложной проверки
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  );
}

/**
 * Получить CSRF токен из сессии (для серверных компонентов)
 */
export async function getCSRFToken(request: Request): Promise<string | null> {
  // В Next.js можно использовать cookies для хранения токена
  const cookies = request.headers.get('cookie');
  if (!cookies) return null;
  
  const match = cookies.match(/csrf-token=([^;]+)/);
  return match ? match[1] : null;
}

