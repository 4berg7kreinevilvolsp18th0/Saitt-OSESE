import Link from 'next/link';
import { gradientBg, gradientBorder } from '../lib/theme';

export default function StudentOrganizationsCard() {
  const gradient = gradientBg('neutral');
  const borderGradient = gradientBorder('neutral');
  
  return (
    <Link
      href="#student-organizations"
      className={`group professional-card block rounded-xl sm:rounded-2xl border-2 ${borderGradient} ${gradient} bg-opacity-30 p-5 sm:p-7 
        hover:bg-opacity-40 hover-lift
        light:bg-opacity-0 
        light:bg-gradient-to-br light:from-white light:via-white light:to-gray-50
        light:border-opacity-50
        animate-fade-in-up focus-ring relative overflow-hidden`}
    >
      <div className="relative z-10">
        {/* Фиолетовый градиентный акцент сверху */}
        <div className={`absolute -top-4 -left-4 w-20 h-20 ${gradient} rounded-full opacity-30 blur-xl group-hover:opacity-40 transition-opacity duration-300 
          light:opacity-15 light:blur-2xl light:group-hover:opacity-25`}></div>
        
        {/* Декоративный элемент для светлой темы */}
        <div className={`absolute top-0 right-0 w-36 h-36 ${gradient} rounded-full opacity-0 light:opacity-8 light:blur-3xl light:group-hover:opacity-15 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`}></div>
        
        {/* Дополнительный фиолетовый акцент */}
        <div className={`absolute bottom-0 left-0 w-24 h-24 ${gradient} rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300 
          light:opacity-10 light:blur-3xl light:group-hover:opacity-20`}></div>
        
        <div className={`relative text-sm sm:text-base uppercase tracking-wider font-bold mb-3 text-neutral 
          drop-shadow-sm light:drop-shadow-none`}>
          Студенческие объединения
        </div>
        <div className={`text-sm sm:text-base leading-relaxed font-sf-text mb-4 text-white/90 light:text-gray-700 
          light:font-medium`}>
          Организации и сообщества студентов ДВФУ, которые помогают развивать студенческую жизнь и реализовывать инициативы.
        </div>
        <div className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-white/90 light:text-gray-700 group-hover:gap-3 transition-all">
          Перейти
          <span className={`text-neutral group-hover:translate-x-1 transition-transform duration-300
            light:text-oss-red light:group-hover:text-oss-red/80`}>→</span>
        </div>
      </div>
    </Link>
  );
}

