'use client';

import React, { useState, useEffect } from 'react';
import { getTheme } from '../lib/theme';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
  showText?: boolean;
  useImage?: boolean;
}

export default function Logo({ 
  className = '', 
  size = 40, 
  color,
  showText = false,
  useImage = true
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getTheme());
    
    // Слушаем изменения темы
    const handleThemeChange = () => {
      setTheme(getTheme());
    };
    
    // Проверяем изменения темы каждые 100ms (для синхронизации)
    const interval = setInterval(() => {
      const currentTheme = getTheme();
      setTheme((prevTheme) => {
        if (currentTheme !== prevTheme) {
          return currentTheme;
        }
        return prevTheme;
      });
    }, 100);
    
    // Также слушаем изменения в localStorage
    window.addEventListener('storage', handleThemeChange);
    
    // Слушаем изменения класса на documentElement
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  // Определяем цвет и источник логотипа в зависимости от темы
  const logoColor = color || (theme === 'light' ? '#D11F2A' : '#FFFFFF');
  const lightLogoSrc = '/Лого вектор красное.png';
  const darkLogoSrc = '/Лого вектор белое.png';
  const [currentSrc, setCurrentSrc] = useState(theme === 'light' ? lightLogoSrc : darkLogoSrc);
  
  useEffect(() => {
    if (mounted) {
      setCurrentSrc(theme === 'light' ? lightLogoSrc : darkLogoSrc);
    }
  }, [theme, mounted]);
  
  const handleImageError = () => {
    const fallbacks = theme === 'light' 
      ? [
          '/Лого вектор красное.svg',
          '/logo.png',
          '/logo.svg'
        ]
      : [
          '/Лого вектор белое.svg',
          '/logo.png',
          '/logo.svg'
        ];
    
    const currentIndex = fallbacks.indexOf(currentSrc);
    if (currentIndex < fallbacks.length - 1) {
      setCurrentSrc(fallbacks[currentIndex + 1]);
    } else {
      // Если все варианты не найдены, показываем fallback SVG
      setImageError(true);
    }
  };
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {useImage && !imageError ? (
        // Используем изображение логотипа, если оно есть
        <div className="flex-shrink-0 relative" style={{ width: size, height: size }}>
          <img
            src={currentSrc}
            alt="ОСС ДВФУ"
            width={size}
            height={size}
            className="object-contain"
            onError={handleImageError}
            style={{ display: 'block', width: size, height: size }}
          />
        </div>
      ) : (
        // Fallback SVG логотип
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
          style={{ color: logoColor }}
        >
          {/* Внешние концентрические дуги - левая сторона */}
          <path
            d="M 20 30 A 50 50 0 0 1 20 90"
            stroke={color}
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 25 35 A 45 45 0 0 1 25 85"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 30 40 A 40 40 0 0 1 30 80"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
          
          {/* Внешние концентрические дуги - правая сторона */}
          <path
            d="M 100 30 A 50 50 0 0 0 100 90"
            stroke={color}
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 95 35 A 45 45 0 0 0 95 85"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 90 40 A 40 40 0 0 0 90 80"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
          
          {/* Верхние дуги */}
          <path
            d="M 30 40 A 40 40 0 0 1 90 40"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M 25 35 A 45 45 0 0 1 95 35"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 20 30 A 50 50 0 0 1 100 30"
            stroke={color}
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          
          {/* Внутренний почти полный круг */}
          <path
            d="M 35 45 A 25 25 0 1 1 35 75"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            opacity="0.8"
          />
          
          {/* Человеческая фигура - динамичная поза */}
          {/* Голова */}
          <circle cx="60" cy="42" r="3.5" stroke={color} strokeWidth="2" fill="none" />
          
          {/* Тело */}
          <path
            d="M 60 46 L 59 68"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* Левая рука - поднята вверх и влево */}
          <path
            d="M 60 52 Q 48 45 42 50"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Правая рука - поднята вверх и вправо */}
          <path
            d="M 60 52 Q 72 45 78 50"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Левая нога */}
          <path
            d="M 59 68 Q 52 72 50 82"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Правая нога */}
          <path
            d="M 59 68 Q 66 72 70 82"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-white light:text-gray-900 whitespace-nowrap">
            ОБЪЕДИНЕННЫЙ СОВЕТ СТУДЕНТОВ
          </span>
            ДВФУ
          </span>
        </div>
      )}
    </div>
  );
}

