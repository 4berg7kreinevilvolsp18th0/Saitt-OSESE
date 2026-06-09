'use client';

import { useEffect } from 'react';
import { initTheme } from '../lib/theme';
import { shouldActivateWinterTheme } from '../lib/winterSeason';
import Snowflakes from './Snowflakes';
import WinterTheme from './WinterTheme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTheme();

    if (shouldActivateWinterTheme()) {
      document.documentElement.classList.add('winter-theme');
    } else {
      document.documentElement.classList.remove('winter-theme');
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

