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
      className={`group block rounded-xl sm:rounded-2xl border-2 ${borderGradient} ${gradient} bg-opacity-20 p-4 sm:p-6 hover:bg-opacity-30 hover:scale-[1.02] hover:shadow-lg hover:shadow-current/20 transition-all duration-300 
        light:bg-opacity-0 
        light:bg-gradient-to-br light:from-white light:via-white light:to-gray-50
        light:border-opacity-30
        light:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
        light:hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)]
        light:hover:scale-[1.03]
        light:hover:border-opacity-50
        light:backdrop-blur-sm
        animate-fade-in-up`}
    >
      <div className="relative overflow-hidden">
        {/* Градиентный акцент сверху */}
        <div className={`absolute -top-4 -left-4 w-16 h-16 ${gradient} rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300 
          light:opacity-10 light:blur-2xl light:group-hover:opacity-20`}></div>
        
        {/* Декоративный элемент для светлой темы */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} rounded-full opacity-0 light:opacity-5 light:blur-3xl light:group-hover:opacity-10 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`}></div>
        
        <div className={`relative text-xs sm:text-sm uppercase tracking-wide font-semibold ${d.colorKey === 'legal' ? 'text-legal-gold light:text-legal-dark-blue' : accent.split(' ')[0]} drop-shadow-sm 
          light:drop-shadow-none light:font-bold`}>
          {d.title}
        </div>
        <div className={`mt-2 text-xs sm:text-sm leading-relaxed font-sf-text ${d.colorKey === 'legal' ? 'text-legal-dark-blue light:text-legal-dark-blue' : 'text-white/90 light:text-gray-700'} 
          light:font-medium`}>
          {d.description}
        </div>
        <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 light:text-gray-600 group-hover:gap-3 transition-all
          light:font-semibold light:text-gray-700">
          Перейти
          <span className={`${d.colorKey === 'legal' ? 'text-legal-gold light:text-legal-dark-blue' : accent.split(' ')[0]} group-hover:translate-x-1 transition-transform duration-300
            light:text-oss-red light:group-hover:text-oss-red/80`}>→</span>
        </div>
      </div>
    </Link>
  );
}
