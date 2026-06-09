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
      return 'border-legal/70 light:border-legal/40';
    case 'infrastructure':
      return 'border-infrastructure/70 light:border-infrastructure/40';
    case 'scholarship':
      return 'border-scholarship/70 light:border-scholarship/40';
    case 'international':
      return 'border-international/70 light:border-international/40';
    case 'neutral':
      return 'border-neutral/70 light:border-neutral/40';
    case 'oss':
    default:
      return 'border-oss-red/70';
  }
}

export function committeeColorKey(committee: string): ColorKey {
  const normalized = committee.toLowerCase();
  if (normalized.includes('прав')) return 'legal';
  if (normalized.includes('инфра')) return 'infrastructure';
  if (normalized.includes('стип')) return 'scholarship';
  if (normalized.includes('иност')) return 'international';
  if (normalized.includes('осс')) return 'oss';
  return 'neutral';
}

export function committeeBadgeClasses(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'border-legal/45 bg-legal/15 text-blue-100 light:text-legal-dark-blue light:bg-legal/20';
    case 'infrastructure':
      return 'border-infrastructure/45 bg-infrastructure/15 text-cyan-100 light:text-blue-800 light:bg-infrastructure/20';
    case 'scholarship':
      return 'border-scholarship/45 bg-scholarship/15 text-emerald-100 light:text-emerald-800 light:bg-scholarship/20';
    case 'international':
      return 'border-international/45 bg-international/20 text-yellow-100 light:text-amber-800 light:bg-international/25';
    case 'neutral':
      return 'border-neutral/45 bg-neutral/20 text-slate-100 light:text-slate-700 light:bg-neutral/15';
    case 'oss':
    default:
      return 'border-oss-red/45 bg-oss-red/15 text-red-100 light:text-oss-red light:bg-oss-red/10';
  }
}

export function committeePrimaryButtonClasses(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'bg-gradient-legal text-white hover:brightness-110';
    case 'infrastructure':
      return 'bg-gradient-infrastructure text-white hover:brightness-110';
    case 'scholarship':
      return 'bg-gradient-scholarship text-white hover:brightness-110';
    case 'international':
      return 'bg-gradient-international text-oss-dark hover:brightness-105';
    case 'neutral':
      return 'bg-gradient-neutral text-white hover:brightness-110';
    case 'oss':
    default:
      return 'bg-gradient-to-r from-oss-red to-red-700 text-white hover:brightness-110';
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
      return 'bg-blur-scholarship-1';
    case 'international':
      return 'bg-blur-international-1';
    case 'neutral':
      return 'bg-blur-neutral-1';
    case 'oss':
    default:
      return 'bg-blur-oss-1';
  }
}

export function getBlurColor2(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'bg-blur-legal-2';
    case 'infrastructure':
      return 'bg-blur-infrastructure-2';
    case 'scholarship':
      return 'bg-blur-scholarship-2';
    case 'international':
      return 'bg-blur-international-2';
    case 'neutral':
      return 'bg-blur-neutral-2';
    case 'oss':
    default:
      return 'bg-blur-oss-2';
  }
}

// Функции для работы с темой (концепт MonoStructure — плоский светлый, без light-brandbook)
export function getTheme(): Theme {
  return 'light';
}

export function setTheme(_theme: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', 'light');
  document.documentElement.classList.add('light', 'concept-mono-structure');
  document.documentElement.classList.remove('dark', 'light-brandbook');
}

export function initTheme() {
  if (typeof window === 'undefined') return;
  setTheme('light');
}
