import { DIRECTIONS } from '../../lib/directions';
import DirectionCard from '../../components/DirectionCard';

export default function DirectionsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold">Направления ОСС</h1>
      <p className="mt-3 text-white/70 max-w-2xl">
        Выберите направление. Цвет раздела — часть навигации: он помогает быстро понять, в каком блоке вы находитесь.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {DIRECTIONS.map((d) => (
          <DirectionCard key={d.slug} d={d} />
        ))}
      </div>
    </main>
  );
}
