import Link from 'next/link';
import { Direction } from '../lib/directions';
import { accentClass } from '../lib/theme';

export default function DirectionCard({ d }: { d: Direction }) {
  const accent = accentClass(d.colorKey);
  return (
    <Link
      href={`/directions/${d.slug}`}
      className={`block rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-200 light:bg-white light:border-gray-200 light:hover:bg-gray-50 light:hover:border-gray-300 light:shadow-sm`}
    >
      <div className={`text-xs sm:text-sm uppercase tracking-wide font-semibold ${accent.split(' ')[0]}`}>
        {d.title}
      </div>
      <div className="mt-2 text-white/80 text-xs sm:text-sm leading-relaxed light:text-gray-600">{d.description}</div>
      <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-xs sm:text-sm text-white/70 light:text-gray-500">
        Перейти
        <span className="text-white/40 light:text-gray-400">→</span>
      </div>
    </Link>
  );
}
