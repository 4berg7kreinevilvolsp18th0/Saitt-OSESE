
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class', // Включаем class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sf-text': ['var(--font-sf-text)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'sf-display': ['var(--font-sf-display)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        oss: {
          red: "#D11F2A",
          dark: "#0F1115",
        },
        legal: "#2A3B5C",
        'legal-gold': "#FFD700",
        'legal-dark-blue': "#1A2332",
        'legal-blur-1': "#4A5B8C",
        'legal-blur-2': "#5A6B9C",
        infrastructure: "#2A7FFF",
        'infrastructure-blur-1': "#4A9FFF",
        'infrastructure-blur-2': "#5AAFFF",
        scholarship: "#2E8B57",
        'scholarship-blur-1': "#3EAB77",
        'scholarship-blur-2': "#4EBB87",
        international: "#F5B301",
        'international-blur-1': "#FFC521",
        'international-blur-2': "#FFD531",
        neutral: "#6B7280",
        'neutral-blur-1': "#8B92A0",
        'neutral-blur-2': "#9BA2B0',
      },
      backgroundImage: {
        // Правовой комитет - яркий синий с золотыми акцентами
        'gradient-legal': 'linear-gradient(135deg, #2A3B5C 0%, #3A4B6C 50%, #2A3B5C 100%)',
        'gradient-legal-light': 'linear-gradient(135deg, #E8EBF0 0%, #D1D9E6 50%, #E8EBF0 100%)',
        
        // Инфраструктурный блок - яркий голубой
        'gradient-infrastructure': 'linear-gradient(135deg, #2A7FFF 0%, #3A8FFF 50%, #2A7FFF 100%)',
        'gradient-infrastructure-light': 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #DBEAFE 100%)',
        
        // Стипендиальный комитет - яркий зелёный
        'gradient-scholarship': 'linear-gradient(135deg, #2E8B57 0%, #3E9B67 50%, #2E8B57 100%)',
        'gradient-scholarship-light': 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #D1FAE5 100%)',
        
        // Иностранным студентам - яркий жёлтый
        'gradient-international': 'linear-gradient(135deg, #F5B301 0%, #FFC521 50%, #F5B301 100%)',
        'gradient-international-light': 'linear-gradient(135deg, #FFF4E6 0%, #FFE4B5 50%, #FFF4E6 100%)',
        
        // Нейтральный/Объединение - яркий серый
        'gradient-neutral': 'linear-gradient(135deg, #6B7280 0%, #7B8290 50%, #6B7280 100%)',
        'gradient-neutral-light': 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%)',
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      // Добавляем поддержку префикса light:
      addVariant('light', '.light &');
    }),
  ],
};
