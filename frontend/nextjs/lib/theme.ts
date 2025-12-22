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
      return 'text-legal-gold border-legal-dark-blue';
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

export function gradientBg(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'bg-gradient-legal light:bg-gradient-legal-light';
    case 'infrastructure':
      return 'bg-gradient-infrastructure light:bg-gradient-infrastructure-light';
    case 'scholarship':
      return 'bg-gradient-scholarship light:bg-gradient-scholarship-light';
    case 'international':
      return 'bg-gradient-international light:bg-gradient-international-light';
    case 'neutral':
      return 'bg-gradient-neutral light:bg-gradient-neutral-light';
    case 'oss':
    default:
      return 'bg-gradient-to-r from-oss-red to-red-600';
  }
}

export function gradientBorder(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'border-legal/50 light:border-legal/30';
    case 'infrastructure':
      return 'border-infrastructure/50 light:border-infrastructure/30';
    case 'scholarship':
      return 'border-scholarship/50 light:border-scholarship/30';
    case 'international':
      return 'border-international/50 light:border-international/30';
    case 'neutral':
      return 'border-neutral/50 light:border-neutral/30';
    case 'oss':
    default:
      return 'border-oss-red/50';
  }
}

// Функции для получения цветов размытых декоративных элементов
export function getBlurColor1(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'bg-blur-legal-1';
    case 'infrastructure':
      return 'bg-blur-infrastructure-1';
    case 'scholarship':
      return 'bg-scholarship-blur-1';
    case 'international':
      return 'bg-international-blur-1';
    case 'neutral':
      return 'bg-neutral-blur-1';
    case 'oss':
    default:
      return 'bg-oss-red';
  }
}

export function getBlurColor2(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'bg-legal-blur-2';
    case 'infrastructure':
      return 'bg-infrastructure-blur-2';
    case 'scholarship':
      return 'bg-scholarship-blur-2';
    case 'international':
      return 'bg-international-blur-2';
    case 'neutral':
      return 'bg-neutral-blur-2';
    case 'oss':
    default:
      return 'bg-red-600';
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
