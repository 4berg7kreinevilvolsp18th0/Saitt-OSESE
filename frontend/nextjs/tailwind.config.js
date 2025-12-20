
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
        legal: "#1F2A44",
        infrastructure: "#2A7FFF",
        scholarship: "#2E8B57",
        international: "#F5B301",
        neutral: "#6B7280",
      },
      backgroundImage: {
        // Правовой комитет - тёмно-синий градиент (из брендбука)
        'gradient-legal': 'linear-gradient(135deg, #1F2A44 0%, #2A3F5F 50%, #1F2A44 100%)',
        'gradient-legal-light': 'linear-gradient(135deg, #E8EBF0 0%, #D1D9E6 50%, #E8EBF0 100%)',
        
        // Инфраструктурный блок - голубой градиент (светлый)
        'gradient-infrastructure': 'linear-gradient(135deg, #2A7FFF 0%, #4A9FFF 50%, #2A7FFF 100%)',
        'gradient-infrastructure-light': 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #DBEAFE 100%)',
        
        // Стипендиальный комитет - зелёный градиент (светлый)
        'gradient-scholarship': 'linear-gradient(135deg, #2E8B57 0%, #3EAB67 50%, #2E8B57 100%)',
        'gradient-scholarship-light': 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #D1FAE5 100%)',
        
        // Иностранным студентам - коричнево-оранжевый градиент (из презентации "Иностранный блок ОСС")
        'gradient-international': 'linear-gradient(135deg, #5C3A1A 0%, #8B5A2B 50%, #CD853F 100%)',
        'gradient-international-light': 'linear-gradient(135deg, #FFF4E6 0%, #FFE4B5 50%, #FFF4E6 100%)',
        
        // Нейтральный/Общее - тёмно-красный градиент (из презентации "Общее")
        'gradient-neutral': 'linear-gradient(135deg, #6B0000 0%, #8B0000 50%, #B91C1C 100%)',
        'gradient-neutral-light': 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 50%, #FEE2E2 100%)',
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
