/**
 * 2FA (Two-Factor Authentication) утилиты
 * Использует TOTP (Time-based One-Time Password) через библиотеку otplib
 */

import { authenticator } from 'otplib';

// Настройка TOTP
authenticator.options = {
  step: 30, // 30 секунд на код
  window: [1, 1], // Разрешить ±1 период (для синхронизации)
};

/**
 * Генерация секретного ключа для пользователя
 */
export function generate2FASecret(): string {
  return authenticator.generateSecret();
}

/**
 * Генерация QR кода URL для добавления в приложение-аутентификатор
 */
export function generate2FAQRCodeURL(
  email: string,
  secret: string,
  issuer: string = 'OSS ДВФУ'
): string {
  return authenticator.keyuri(email, issuer, secret);
}

/**
 * Генерация кода для проверки (для тестирования)
 */
export function generate2FAToken(secret: string): string {
  return authenticator.generate(secret);
}

/**
 * Верификация 2FA токена
 */
export function verify2FAToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error('2FA verification error:', error);
    return false;
  }
}

/**
 * Проверка, включена ли 2FA для пользователя
 */
export async function is2FAEnabled(userId: string): Promise<boolean> {
  try {
    const { supabase } = await import('./supabaseClient');
    const { data, error } = await supabase
      .from('user_2fa')
      .select('enabled')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return false;
