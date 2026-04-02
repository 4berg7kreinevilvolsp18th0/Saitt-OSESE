'use client';

import { useEffect } from 'react';
import { initTheme } from '../lib/theme';
import Snowflakes from './Snowflakes';
import WinterTheme from './WinterTheme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTheme();
    
    // Инициализация зимней темы
    const month = new Date().getMonth();
    const isWinterMonth = month === 11 || month === 0 || month === 1;
    const winterTheme = localStorage.getItem('winter-theme');
    
    if (winterTheme === 'true' || (winterTheme === null && isWinterMonth)) {
      document.documentElement.classList.add('winter-theme');
    }
  }, []);

  return (
    <>
      {children}
      <Snowflakes />
      <WinterTheme />
    </>
  );
}

