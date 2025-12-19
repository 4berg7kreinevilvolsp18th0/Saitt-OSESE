'use client';

import React, { useState, useEffect } from 'react';
import { Locale, defaultLocale, supportedLocales } from '../lib/i18n';

interface LanguageToggleProps {
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

export default function LanguageToggle({ 
  currentLocale = defaultLocale,
  onLocaleChange 
}: LanguageToggleProps) {
  const [locale, setLocale] = useState<Locale>(currentLocale);

  useEffect(() => {
    // Загружаем сохранённую локаль из localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && supportedLocales.includes(savedLocale)) {
      setLocale(savedLocale);
      if (onLocaleChange) {
        onLocaleChange(savedLocale);
      }
    }
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    if (onLocaleChange) {
      onLocaleChange(newLocale);
    }
    // Перезагружаем страницу для применения изменений
    window.location.reload();
  };

  const localeNames: Record<Locale, string> = {
    ru: 'Рус',
    en: 'Eng',
    zh: '中文',
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 p-1 light:border-gray-300 light:bg-white">
      {supportedLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-2.5 py-1 rounded text-xs sm:text-sm font-medium transition ${
            locale === loc
              ? 'bg-oss-red text-white light:bg-oss-red light:text-white'
              : 'text-white/70 hover:text-white light:text-gray-700 light:hover:text-gray-900'
          }`}
          aria-label={`Switch to ${loc}`}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}

