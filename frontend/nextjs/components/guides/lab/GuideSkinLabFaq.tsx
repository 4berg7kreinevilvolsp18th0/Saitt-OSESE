import Link from 'next/link';
import type { ReactNode } from 'react';

export function FaqSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <details
      id={id}
      className="scroll-mt-28 group border-b border-gray-200 dark:border-white/10 last:border-0"
    >
      <summary className="cursor-pointer list-none py-5 pr-8 text-left text-lg font-semibold text-gray-900 dark:text-white [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4">
        <span>{title}</span>
        <span className="shrink-0 text-gray-400 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
      </summary>
      <div
        className="pb-6 pl-0 space-y-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
        [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white"
      >
        {children}
      </div>
    </details>
  );
}

export function FaqCallout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-4 rounded-xl bg-blue-50/90 px-4 py-3 dark:bg-blue-950/30">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">{title}</p>
      <div className="mt-2 text-[15px] leading-relaxed text-gray-800 dark:text-gray-200">{children}</div>
    </div>
  );
}

type Props = {
  title: string;
  subtitle?: string;
  metaLine?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
  conceptLabel: string;
};

export default function GuideSkinLabFaq({
  title,
  subtitle,
  metaLine,
  badge,
  children,
  className = '',
  conceptLabel,
}: Props) {
  return (
    <div
      data-guide-skin="lab-faq"
      className={`min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 ${className}`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400" aria-label="Навигация">
          <Link href="/" className="hover:text-oss-red dark:hover:text-red-300">
            Главная
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/guides/lab" className="hover:text-oss-red dark:hover:text-red-300">
            Лаборатория
          </Link>
          <span className="mx-1.5">/</span>
          <span>{conceptLabel}</span>
        </nav>

        <header className="mb-2">
          {badge && (
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-500">
              {badge}
            </span>
          )}
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{subtitle}</p>}
          {metaLine && <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">{metaLine}</p>}
        </header>

        <p className="mb-6 text-sm text-gray-500 dark:text-gray-500">Раскройте блоки ниже — формат «FAQ-first».</p>

        <div className="rounded-2xl border border-gray-200 dark:border-white/10 px-4 sm:px-6 dark:bg-white/[0.02]">
          {children}
        </div>
      </div>
    </div>
  );
}
