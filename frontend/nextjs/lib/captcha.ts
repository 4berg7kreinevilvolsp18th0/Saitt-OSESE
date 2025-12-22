/**
 * Google reCAPTCHA v3 интеграция
 * Бесплатный tier: до 1 млн запросов в месяц
 */

declare global {
  interface Window {
    grecaptcha: any;
  }
}

/**
 * Загрузить reCAPTCHA скрипт
 */
export function loadRecaptcha(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
}

/**
 * Получить reCAPTCHA токен
 */
export async function getRecaptchaToken(action: string = 'submit'): Promise<string> {
  await loadRecaptcha();

  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA not loaded');
  }

  return new Promise((resolve, reject) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action })
        .then((token: string) => {
          resolve(token);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  });
}

/**
 * Верифицировать reCAPTCHA токен на сервере
 */
export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify-captcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success === true && data.score >= 0.5; // Порог 0.5 для reCAPTCHA v3
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

