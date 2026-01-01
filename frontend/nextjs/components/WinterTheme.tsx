'use client';

import { useEffect, useState } from 'react';

export default function WinterTheme() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Проверяем, зима ли сейчас
    const month = new Date().getMonth();
    const isWinterMonth = month === 11 || month === 0 || month === 1;
    
    // Проверяем localStorage
    const winterTheme = typeof window !== 'undefined' ? localStorage.getItem('winter-theme') : null;
    const shouldActivate = winterTheme === 'true' || (winterTheme === null && isWinterMonth);
    
    setIsActive(shouldActivate);

    if (typeof window !== 'undefined') {
      if (shouldActivate) {
        document.documentElement.classList.add('winter-theme');
      } else {
        document.documentElement.classList.remove('winter-theme');
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        // Не удаляем класс при размонтировании, чтобы не сбрасывать тему
      }
    };
  }, []);

  const toggleWinterTheme = () => {
    const newState = !isActive;
    setIsActive(newState);
    localStorage.setItem('winter-theme', String(newState));
    
    if (newState) {
      document.documentElement.classList.add('winter-theme');
    } else {
      document.documentElement.classList.remove('winter-theme');
    }

    // Отправляем событие для обновления снежинок в той же вкладке
    window.dispatchEvent(new Event('winter-theme-change'));
  };

  return (
    <button
      onClick={toggleWinterTheme}
      className="fixed bottom-4 right-4 z-40 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      style={{
        backgroundColor: isActive ? '#5B9BD5' : '#7EC8E3',
        background: isActive 
          ? 'linear-gradient(135deg, #5B9BD5 0%, #3D7BA8 100%)' 
          : 'linear-gradient(135deg, #7EC8E3 0%, #5B9BD5 100%)',
      }}
      onMouseEnter={(e) => {
        if (isActive) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #6BAFE5 0%, #4D8BB8 100%)';
        } else {
          e.currentTarget.style.background = 'linear-gradient(135deg, #8ED4F3 0%, #6BAFE5 100%)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isActive 
          ? 'linear-gradient(135deg, #5B9BD5 0%, #3D7BA8 100%)' 
          : 'linear-gradient(135deg, #7EC8E3 0%, #5B9BD5 100%)';
      }}
      title={isActive ? 'Выключить зимнюю тему' : 'Включить зимнюю тему'}
      aria-label={isActive ? 'Выключить зимнюю тему' : 'Включить зимнюю тему'}
    >
      {isActive ? '☀️' : '❄️'}
    </button>
  );
}

