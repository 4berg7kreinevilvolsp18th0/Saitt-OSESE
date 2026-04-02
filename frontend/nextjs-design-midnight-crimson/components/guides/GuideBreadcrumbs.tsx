import Link from 'next/link';

export default function GuideBreadcrumbs({ title }: { title: string }) {
  return (
    <nav className="mb-4 text-sm text-white/60 light:text-gray-500" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-white light:hover:text-oss-red">
        Главная
      </Link>
      <span className="mx-2">/</span>
      <Link href="/content" className="hover:text-white light:hover:text-oss-red">
        Контент
      </Link>
      <span className="mx-2">/</span>
      <span className="text-white/80 light:text-gray-700">{title}</span>
    </nav>
  );
}

