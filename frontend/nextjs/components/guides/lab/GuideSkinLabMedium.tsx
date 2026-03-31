import Link from 'next/link';
import type { ReactNode } from 'react';

export function MediumSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 mt-16 first:mt-0">
      <h2 className="font-serif text-3xl sm:text-[2rem] font-bold leading-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      <div
        className="mt-6 space-y-6 text-xl leading-[1.75] text-neutral-700 dark:text-neutral-300 font-serif
        [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:space-y-3
        [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:space-y-3
        [&_strong]:font-semibold [&_strong]:text-neutral-900 dark:[&_strong]:text-white"
      >
        {children}
      </div>
    </section>
  );
}

export function MediumCallout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <blockquote className="my-8 border-l-4 border-neutral-300 pl-6 italic text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
      <p className="not-italic text-sm font-sans font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500 mb-2">
        {title}
      </p>
      <div className="not-italic text-xl leading-[1.75] font-serif text-neutral-800 dark:text-neutral-200">{children}</div>
    </blockquote>
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

export default function GuideSkinLabMedium({
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
      data-guide-skin="lab-medium"
      className={`min-h-screen bg-[#fafaf9] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 ${className}`}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <nav className="mb-10 text-sm text-neutral-500 dark:text-neutral-500 font-sans" aria-label="Навигация">
          <Link href="/" className="hover:text-neutral-800 dark:hover:text-neutral-200">
            Главная
          </Link>
          <span className="mx-2">·</span>
          <Link href="/guides/lab" className="hover:text-neutral-800 dark:hover:text-neutral-200">
            Лаборатория
          </Link>
          <span className="mx-2">·</span>
          <span>{conceptLabel}</span>
        </nav>

        {badge && (
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
            {badge}
          </p>
        )}
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-2xl leading-snug text-neutral-600 dark:text-neutral-400 font-serif">{subtitle}</p>
        )}
        {metaLine && (
          <p className="mt-8 font-sans text-sm text-neutral-500 dark:text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-8">
            {metaLine}
          </p>
        )}

        <div className="mt-12">{children}</div>
      </div>
    </div>
  );
}
