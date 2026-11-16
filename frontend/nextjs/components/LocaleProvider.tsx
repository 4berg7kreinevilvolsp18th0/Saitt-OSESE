'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, defaultLocale, supportedLocales, getDictionary, t as translate } from '../lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: ReturnType<typeof getDictionary>;
  loaded: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);
  const translations = getDictionary(locale);

  useEffect(() => {
    // Загружаем сохранённую локаль
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && supportedLocales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t: LocaleContextType['t'] = (key, params) => translate(key, translations, params);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, translations, loaded: true }}>
      {children}
    </LocaleContext.Provider>
  );
}

