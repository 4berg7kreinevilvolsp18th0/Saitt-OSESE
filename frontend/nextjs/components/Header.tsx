'use client';

import Link from 'next/link';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-sm text-white/80 hover:text-white transition"
  >
    {children}
  </Link>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-oss-dark/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition">
          <Logo size={32} showText={false} useImage={true} />
          <span className="hidden sm:inline">
            <Logo size={40} showText={true} useImage={true} />
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 lg:gap-5">
          <NavLink href="/directions">Направления</NavLink>
          <NavLink href="/appeal">Обращение</NavLink>
          <NavLink href="/statistics">Статистика</NavLink>
          <NavLink href="/content">Новости и гайды</NavLink>
          <NavLink href="/documents">Документы</NavLink>
          <NavLink href="/contacts">Контакты</NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
