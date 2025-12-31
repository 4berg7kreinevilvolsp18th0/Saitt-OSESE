'use client';

import { useEffect, useState } from 'react';

export default function WinterTheme() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Проверяем, зима ли сейчас
    const month = new Date().getMonth();
    const isWinterMonth = month === 11 || month === 0 || month === 1;
    
    // Проверяем localStorage
    const winterTheme = localStorage.getItem('winter-theme');
    const shouldActivate = winterTheme === 'true' || (winterTheme === null && isWinterMonth);
    
    setIsActive(shouldActivate);

    if (shouldActivate) {
      document.documentElement.classList.add('winter-theme');
    } else {
      document.documentElement.classList.remove('winter-theme');
    }

    return () => {
      document.documentElement.classList.remove('winter-theme');
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
      className="fixed bottom-4 right-4 z-50 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 winter:bg-cyan-500 winter:hover:bg-cyan-600"
      title={isActive ? 'Выключить зимнюю тему' : 'Включить зимнюю тему'}
      aria-label={isActive ? 'Выключить зимнюю тему' : 'Включить зимнюю тему'}
    >
      {isActive ? '☀️' : '❄️'}
    </button>
  );
}

