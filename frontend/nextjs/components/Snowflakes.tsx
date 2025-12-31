'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

export default function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [isWinter, setIsWinter] = useState(false);

  useEffect(() => {
    // Проверяем, зима ли сейчас (декабрь, январь, февраль)
    const month = new Date().getMonth();
    const isWinterMonth = month === 11 || month === 0 || month === 1; // Декабрь, Январь, Февраль
    
    // Или можно проверить localStorage для принудительного включения
    const winterTheme = typeof window !== 'undefined' && localStorage.getItem('winter-theme') === 'true';
    const shouldShow = isWinterMonth || winterTheme;
    setIsWinter(shouldShow);

    if (shouldShow) {
      // Создаем снежинки
      const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: 3 + Math.random() * 4, // 3-7 секунд
        animationDelay: Math.random() * 5,
        size: 4 + Math.random() * 6, // 4-10px
        opacity: 0.3 + Math.random() * 0.7, // 0.3-1.0
      }));
      setSnowflakes(flakes);
    }

    // Слушаем изменения зимней темы
    const handleStorageChange = () => {
      const winterTheme = localStorage.getItem('winter-theme') === 'true';
      setIsWinter(isWinterMonth || winterTheme);
      
      if (isWinterMonth || winterTheme) {
        const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          animationDuration: 3 + Math.random() * 4,
          animationDelay: Math.random() * 5,
          size: 4 + Math.random() * 6,
          opacity: 0.3 + Math.random() * 0.7,
        }));
        setSnowflakes(flakes);
      } else {
        setSnowflakes([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Также слушаем кастомное событие для обновления в той же вкладке
    window.addEventListener('winter-theme-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('winter-theme-change', handleStorageChange);
    };
  }, []);

  if (!isWinter) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white select-none"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration}s linear infinite`,
            animationDelay: `${flake.animationDelay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

