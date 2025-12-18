export type ColorKey =
  | 'oss'
  | 'legal'
  | 'infrastructure'
  | 'scholarship'
  | 'international'
  | 'neutral';

export type Theme = 'dark' | 'light';

export function accentClass(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'text-legal border-legal';
    case 'infrastructure':
      return 'text-infrastructure border-infrastructure';
    case 'scholarship':
      return 'text-scholarship border-scholarship';
    case 'international':
      return 'text-international border-international';
    case 'neutral':
      return 'text-neutral border-neutral';
    case 'oss':
    default:
      return 'text-oss-red border-oss-red';
  }
}

export function accentBg(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'bg-legal';
    case 'infrastructure':
      return 'bg-infrastructure';
    case 'scholarship':
      return 'bg-scholarship';
    case 'international':
      return 'bg-international';
    case 'neutral':
      return 'bg-neutral';
    case 'oss':
    default:
      return 'bg-oss-red';
  }
}

// Функции для работы с темой
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme') as Theme | null;
  return stored || 'dark';
}

export function setTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
  document.documentElement.classList.toggle('light', theme === 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function initTheme() {
  if (typeof window === 'undefined') return;
  const theme = getTheme();
  setTheme(theme);
}
