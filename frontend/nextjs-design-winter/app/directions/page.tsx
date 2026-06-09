import { DIRECTIONS } from '../../lib/directions';
import DirectionCard from '../../components/DirectionCard';

export default function DirectionsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold light:text-gray-900">Направления ОСС</h1>
      <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl light:text-gray-600">
        Выберите направление. Цвет раздела — часть навигации: он помогает быстро понять, в каком блоке вы находитесь.
      </p>
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DIRECTIONS.map((d) => (
          <DirectionCard key={d.slug} d={d} />
        ))}
      </div>
    </main>
  );
}
