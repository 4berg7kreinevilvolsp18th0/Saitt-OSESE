'use client';

import { Locale, supportedLocales } from '../lib/i18n';
import { useLocale } from './LocaleProvider';

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const accessibleNames: Record<Locale, string> = {
    ru: 'Русский',
    en: 'English',
  };
  const localeNames: Record<Locale, string> = {
    ru: 'Рус',
    en: 'Eng',
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 p-1 light:border-gray-300 light:bg-white">
      {supportedLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`px-2.5 py-1 rounded text-xs sm:text-sm font-medium transition ${
            locale === loc
              ? 'bg-oss-red text-white light:bg-oss-red light:text-white'
              : 'text-white/70 hover:text-white light:text-gray-700 light:hover:text-gray-900'
          }`}
          aria-label={accessibleNames[loc]}
          aria-pressed={locale === loc}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}

