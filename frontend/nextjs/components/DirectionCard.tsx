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
      className={`group professional-card block rounded-xl sm:rounded-2xl border-2 ${borderGradient} ${gradient} bg-opacity-60 p-5 sm:p-7 h-full
        hover:bg-opacity-70 hover-lift
        light:bg-opacity-0 
        light:bg-gradient-to-br light:from-white light:via-white light:to-gray-50
        light:border-opacity-60
        animate-fade-in-up focus-ring relative overflow-hidden flex flex-col`}
    >
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Градиентный акцент сверху - более яркий */}
        <div className={`absolute -top-4 -left-4 w-20 h-20 ${gradient} rounded-full opacity-50 blur-xl group-hover:opacity-60 transition-opacity duration-300 
          light:opacity-20 light:blur-2xl light:group-hover:opacity-30`}></div>
        
        {/* Декоративный элемент для светлой темы */}
        <div className={`absolute top-0 right-0 w-36 h-36 ${gradient} rounded-full opacity-0 light:opacity-12 light:blur-3xl light:group-hover:opacity-20 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`}></div>
        
        {/* Дополнительный цветной акцент */}
        <div className={`absolute bottom-0 left-0 w-24 h-24 ${gradient} rounded-full opacity-40 blur-2xl group-hover:opacity-50 transition-opacity duration-300 
          light:opacity-15 light:blur-3xl light:group-hover:opacity-25`}></div>
        
        <div className={`relative text-sm sm:text-base uppercase tracking-wider font-bold mb-3 ${d.colorKey === 'legal' ? 'text-legal-gold light:text-legal-dark-blue' : accent.split(' ')[0]} 
          drop-shadow-md light:drop-shadow-none`}>
          {d.title}
        </div>
        <div className={`text-sm sm:text-base leading-relaxed font-sf-text mb-4 flex-1 ${d.colorKey === 'legal' ? 'text-white light:text-gray-800' : 'text-white light:text-gray-700'} 
          light:font-medium`}>
          {d.description}
        </div>
        <div className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-white light:text-gray-700 group-hover:gap-3 transition-all mt-auto">
          Перейти
          <span className={`${d.colorKey === 'legal' ? 'text-legal-gold light:text-legal-dark-blue' : accent.split(' ')[0]} group-hover:translate-x-1 transition-transform duration-300
            light:text-oss-red light:group-hover:text-oss-red/80`}>→</span>
        </div>
      </div>
    </Link>
  );
}
