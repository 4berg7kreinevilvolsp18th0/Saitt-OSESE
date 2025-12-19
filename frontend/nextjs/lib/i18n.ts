// Утилиты для интернационализации

export type Locale = 'ru' | 'en';

export const defaultLocale: Locale = 'ru';
export const supportedLocales: Locale[] = ['ru', 'en'];

// Кэш переводов
let translationsCache: Record<Locale, any> = {
  ru: {},
  en: {},
};

// Функция для загрузки переводов
export async function loadTranslations(locale: Locale) {
  if (translationsCache[locale] && Object.keys(translationsCache[locale]).length > 0) {
    return translationsCache[locale];
  }

  try {
    const module = await import(`../locales/${locale}.json`);
    translationsCache[locale] = module.default;
    return translationsCache[locale];
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // Fallback на русский
    if (locale !== 'ru') {
      return loadTranslations('ru');
    }
    return {};
  }
}

// Функция для получения перевода по ключу (синхронная версия для использования с кэшем)
export function t(key: string, translations: any, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations || {};

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      return key; // Возвращаем ключ, если перевод не найден
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // Замена параметров в строке
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

// Инициализация переводов для серверных компонентов
export async function getTranslations(locale: Locale = defaultLocale) {
  const translations = await loadTranslations(locale);
  
  return {
    t: (key: string, params?: Record<string, string | number>) => {
      return t(key, translations, params);
    },
    locale,
  };
}

