import Link from 'next/link';

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
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          ОСС ДВФУ
        </Link>
        <nav className="flex items-center gap-5">
          <NavLink href="/directions">Направления</NavLink>
          <NavLink href="/appeal">Обращение</NavLink>
          <NavLink href="/statistics">Статистика</NavLink>
          <NavLink href="/content">Новости и гайды</NavLink>
          <NavLink href="/documents">Документы</NavLink>
          <NavLink href="/contacts">Контакты</NavLink>
        </nav>
      </div>
    </header>
  );
}
