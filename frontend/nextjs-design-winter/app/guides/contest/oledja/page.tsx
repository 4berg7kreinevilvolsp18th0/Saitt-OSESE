import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Конкурс гайдов · Олежа (Oledja) | ОСС ДВФУ',
  description: 'Демо-страница с анимациями — в разработке. Инструментарий в docs/GUIDE_SKIN_TOOLKIT.md',
};

export default function ContestOledjaPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
      <p className="text-xs uppercase tracking-wide text-white/50 light:text-gray-500">Конкурс дизайнов</p>
      <h1 className="mt-2 text-2xl font-bold light:text-gray-900">Олежа (Oledja)</h1>
      <p className="mt-4 text-white/70 light:text-gray-600">
        Здесь будет демо с анимациями. Полный список компонентов, токенов и контракта скина — в репозитории:{' '}
        <code className="text-sm text-oss-red">docs/GUIDE_SKIN_TOOLKIT.md</code> (в каталоге Next.js).
      </p>
      <p className="mt-3 text-sm text-white/55 light:text-gray-500">
        Корневой элемент скина поддерживает <code className="text-xs">data-guide-skin</code> и опциональный{' '}
        <code className="text-xs">className</code> для навешивания анимаций без дублирования контента гайда.
      </p>
      <Link href="/guides/contest" className="mt-8 inline-block text-sm text-oss-red hover:underline">
        ← К списку конкурса
      </Link>
    </main>
  );
}
