'use client';

import Link from 'next/link';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import MobileMenu from './MobileMenu';
import { useLocale } from './LocaleProvider';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="elegant-link text-sm text-white/80 hover:text-white font-medium
      light:text-gray-700 light:hover:text-oss-red
      focus-ring px-2 py-1 rounded-md"
  >
    {children}
  </Link>
);

export default function Header() {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-oss-dark/90 backdrop-blur-md border-b border-white/10 
      light:bg-white/98 light:backdrop-blur-lg light:border-gray-200/60
      light:shadow-[0_1px_3px_rgba(0,0,0,0.05)] 
      animate-fade-in-down">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition">
          <Logo size={32} showText={false} useImage={true} />
          <span className="hidden sm:inline-block">
            <Logo size={40} showText={true} useImage={false} />
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 lg:gap-5">
          <NavLink href="/directions">{t('navigation.directions')}</NavLink>
          <NavLink href="/appeal">{t('navigation.appeal')}</NavLink>
          <NavLink href="/statistics">{t('navigation.statistics')}</NavLink>
          <NavLink href="/content">{t('navigation.content')}</NavLink>
          <NavLink href="/documents">{t('navigation.documents')}</NavLink>
          <NavLink href="/contacts">{t('navigation.contacts')}</NavLink>
          <LanguageToggle />
          <ThemeToggle />
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
