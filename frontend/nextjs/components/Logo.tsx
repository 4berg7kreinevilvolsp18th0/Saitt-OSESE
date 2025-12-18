import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
  showText?: boolean;
}

export default function Logo({ 
  className = '', 
  size = 40, 
  color = '#D11F2A',
  showText = false 
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Внешние дуги круга */}
        <path
          d="M 60 10 A 50 50 0 0 1 100 30"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 60 10 A 50 50 0 0 0 20 30"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 100 30 A 50 50 0 0 1 110 60"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 20 30 A 50 50 0 0 0 10 60"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 110 60 A 50 50 0 0 1 100 90"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 10 60 A 50 50 0 0 0 20 90"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        
        {/* Средние дуги круга */}
        <path
          d="M 60 15 A 45 45 0 0 1 95 35"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 60 15 A 45 45 0 0 0 25 35"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 95 35 A 45 45 0 0 1 105 60"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 25 35 A 45 45 0 0 0 15 60"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 105 60 A 45 45 0 0 1 95 85"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 15 60 A 45 45 0 0 0 25 85"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        
        {/* Внутренние дуги круга */}
        <path
          d="M 60 20 A 40 40 0 0 1 90 40"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 60 20 A 40 40 0 0 0 30 40"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 90 40 A 40 40 0 0 1 100 60"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 30 40 A 40 40 0 0 0 20 60"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 100 60 A 40 40 0 0 1 90 80"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 20 60 A 40 40 0 0 0 30 80"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        
        {/* Человеческая фигура */}
        {/* Голова */}
        <circle cx="60" cy="45" r="4" stroke={color} strokeWidth="2" fill="none" />
        
        {/* Тело */}
        <path
          d="M 60 49 L 58 70"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Левая рука */}
        <path
          d="M 60 55 Q 50 50 45 60"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Правая рука */}
        <path
          d="M 60 55 Q 70 50 75 60"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Левая нога */}
        <path
          d="M 58 70 Q 50 75 48 85"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Правая нога */}
        <path
          d="M 58 70 Q 65 75 68 85"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-white">
            ОБЪЕДИНЕННЫЙ СОВЕТ СТУДЕНТОВ
          </span>
          <span className="text-xs text-white/70 leading-tight">
            ДВФУ
          </span>
        </div>
      )}
    </div>
  );
}

