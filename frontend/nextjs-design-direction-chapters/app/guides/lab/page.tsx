import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Лаборатория концептов гайдов | ОСС ДВФУ',
  description:
    'Черновые визуальные оболочки на одном каноническом тексте для сравнения. Финальные работы участников — в разделе конкурса.',
};

const entries = [
  {
    href: '/guides/lab/wiki/disputes-commission',
    name: 'Wiki / Confluence',
    slug: 'wiki',
    checks: 'метки, блок версии, боковое оглавление, «табличные» выноски',
  },
  {
    href: '/guides/lab/medium/disputes-commission',
    name: 'Medium-лонгрид',
    slug: 'medium',
    checks: 'одна колонка, крупный интерлиньяж, serif, врезки как цитаты',
  },
  {
    href: '/guides/lab/timeline/disputes-commission',
    name: 'Таймлайн',
    slug: 'timeline',
    checks: 'вертикальная линия и узлы по разделам, акцент ОСС',
  },
  {
    href: '/guides/lab/faq-first/disputes-commission',
    name: 'FAQ-first',
    slug: 'faq-first',
    checks: 'каждый раздел — раскрывающийся блок (details)',
  },
];

export default function GuidesLabIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/50 light:text-gray-500">
        ОСС ДВФУ
      </p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold light:text-gray-900">Лаборатория концептов</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 light:text-gray-600">
        Здесь — <strong>черновики</strong> для команды и жюри: один и тот же гайд «Комиссия по спорам» в разных
        визуальных оболочках. Итоговые макеты участников конкурса смотрите в{' '}
        <Link href="/guides/contest" className="text-oss-red hover:underline">
          Конкурсе дизайнов гайдов
        </Link>
        .
      </p>

      <ul className="mt-8 space-y-3">
        {entries.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 light:border-gray-200 light:bg-white light:hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-semibold text-white light:text-gray-900">
                    {item.name ?? item.slug}
                  </span>
                  <code className="ml-2 text-xs text-white/45 light:text-gray-500">{item.slug}</code>
                  <p className="mt-1 text-sm text-white/65 light:text-gray-600">{item.checks}</p>
                </div>
                <span className="text-white/40 light:text-gray-400 shrink-0">→</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
