import Link from 'next/link';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-sm text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white light:text-gray-700 light:hover:text-gray-900 transition"
  >
    {children}
  </Link>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-oss-dark/80 dark:bg-oss-dark/80 light:bg-white/80 backdrop-blur border-b border-white/10 dark:border-white/10 light:border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <Logo size={40} showText={true} useImage={true} />
        </Link>
        <nav className="flex items-center gap-5">
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
