import Link from 'next/link';
import type { ReactNode } from 'react';

export function TimelineSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 relative pl-8 sm:pl-10 pb-12 last:pb-0">
      <span
        className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-oss-red bg-white dark:bg-zinc-900 dark:border-oss-red"
        aria-hidden
      />
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h2>
      <div
        className="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2
        [&_strong]:font-semibold [&_strong]:text-zinc-900 dark:[&_strong]:text-white"
      >
        {children}
      </div>
    </section>
  );
}

export function TimelineCallout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-4 rounded-r-lg border-l-4 border-oss-red/80 bg-zinc-100/80 px-4 py-3 dark:bg-white/5">
      <p className="text-xs font-bold uppercase tracking-wide text-oss-red dark:text-red-300">{title}</p>
      <div className="mt-2 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</div>
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

export default function GuideSkinLabTimeline({
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
      data-guide-skin="lab-timeline"
      className={`min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 ${className}`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav className="mb-8 text-sm text-zinc-600 dark:text-zinc-400" aria-label="Навигация">
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

        <header className="mb-10">
          {badge && (
            <span className="inline-block rounded-full bg-oss-red/10 px-3 py-1 text-xs font-semibold text-oss-red dark:bg-red-950/50 dark:text-red-200">
              {badge}
            </span>
          )}
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{subtitle}</p>}
          {metaLine && <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">{metaLine}</p>}
        </header>

        <div className="relative border-l-2 border-zinc-200 dark:border-zinc-700 ml-1.5 sm:ml-2">
          {children}
        </div>
      </div>
    </div>
  );
}
