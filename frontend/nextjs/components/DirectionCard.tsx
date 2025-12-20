import Link from 'next/link';
import { Direction } from '../lib/directions';
import { accentClass, gradientBg, gradientBorder } from '../lib/theme';

export default function DirectionCard({ d }: { d: Direction }) {
  const accent = accentClass(d.colorKey);
  const gradient = gradientBg(d.colorKey);
  const borderGradient = gradientBorder(d.colorKey);
  
  return (
    <Link
      href={`/directions/${d.slug}`}
      className={`group block rounded-xl sm:rounded-2xl border-2 ${borderGradient} ${gradient} bg-opacity-20 p-4 sm:p-6 hover:bg-opacity-30 hover:scale-[1.02] hover:shadow-lg hover:shadow-current/20 transition-all duration-300 light:bg-opacity-30 light:hover:bg-opacity-40 light:shadow-md`}
    >
      <div className="relative">
        {/* Градиентный акцент сверху */}
        <div className={`absolute -top-4 -left-4 w-16 h-16 ${gradient} rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
        
        <div className={`relative text-xs sm:text-sm uppercase tracking-wide font-semibold ${accent.split(' ')[0]} drop-shadow-sm`}>
          {d.title}
        </div>
        <div className="mt-2 text-white/90 text-xs sm:text-sm leading-relaxed light:text-gray-700 font-sf-text">
          {d.description}
        </div>
        <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 light:text-gray-600 group-hover:gap-3 transition-all">
          Перейти
          <span className={`${accent.split(' ')[0]} group-hover:translate-x-1 transition-transform duration-300`}>→</span>
        </div>
      </div>
    </Link>
  );
}
