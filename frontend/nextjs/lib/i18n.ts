import ru from '../locales/ru.json';
import en from '../locales/en.json';

export type Locale = 'ru' | 'en';
export const defaultLocale: Locale = 'ru';
export const supportedLocales: Locale[] = ['ru', 'en'];

const dictionaries = { ru, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export async function loadTranslations(locale: Locale) {
  return getDictionary(locale);
}

type TranslationValue = string | { [key: string]: TranslationValue };

export function t(key: string, translations: TranslationValue, params?: Record<string, string | number>): string {
  function resolve(dictionary: TranslationValue) {
    return key.split('.').reduce<TranslationValue | undefined>((value, part) => (
      typeof value === 'object' ? value[part] : undefined
    ), dictionary);
  }

  const translated = resolve(translations);
  const value = typeof translated === 'string' ? translated : resolve(ru);
  if (typeof value !== 'string') return key;
  if (!params) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (match, name) => params[name]?.toString() ?? match);
}

export async function getTranslations(locale: Locale = defaultLocale) {
  const translations = getDictionary(locale);
  return {
    t: (key: string, params?: Record<string, string | number>) => t(key, translations, params),
    locale,
  };
}
