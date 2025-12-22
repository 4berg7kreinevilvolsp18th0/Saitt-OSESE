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
