import Link from 'next/link';
import { Direction } from '../lib/directions';
import { accentClass } from '../lib/theme';

export default function DirectionCard({ d }: { d: Direction }) {
  const accent = accentClass(d.colorKey);
  return (
    <Link
      href={`/directions/${d.slug}`}
      className={`block rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 hover:bg-white/10 transition`}
    >
      <div className={`text-xs uppercase tracking-wide ${accent.split(' ')[0]}`}>
        {d.title}
      </div>
      <div className="mt-2 text-white/80 text-sm leading-relaxed">{d.description}</div>
      <div className="mt-5 inline-flex items-center gap-2 text-sm text-white/70">
        Перейти
        <span className="text-white/40">→</span>
      </div>
    </Link>
  );
}
