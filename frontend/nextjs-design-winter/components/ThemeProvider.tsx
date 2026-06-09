'use client';

import { useEffect } from 'react';
import { initTheme } from '../lib/theme';
import Snowflakes from './Snowflakes';
import WinterTheme from './WinterTheme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTheme();
    document.documentElement.classList.add('winter-theme', 'winter-theme-brandbook');
    localStorage.setItem('winter-theme', 'true');
  }, []);

  return (
    <>
      {children}
      <Snowflakes />
      <WinterTheme />
    </>
  );
}

