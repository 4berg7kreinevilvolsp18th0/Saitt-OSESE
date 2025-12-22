
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
        legal: "#1D1E25",
        'legal-gold': "#D4AF37",
        'legal-dark-blue': "#1A2332",
        'legal-blur-1': "#383B72",
        'legal-blur-2': "#3B3F70",
        infrastructure: "#241E34",
        'infrastructure-blur-1': "#1E6BAA",
        'infrastructure-blur-2': "#1C809C",
        scholarship: "#251D1D",
        'scholarship-blur-1': "#1C9C56",
        'scholarship-blur-2': "#1C9C65",
        international: "#2B2121",
        'international-blur-1': "#EB9D2F",
        'international-blur-2': "#EDAE26",
        neutral: "#241E34",
        'neutral-blur-1': "#C240FF",
        'neutral-blur-2': "#D026D9",
      },
      backgroundImage: {
        // Правовой комитет - тёмно-серый фон с фиолетовыми акцентами
        'gradient-legal': 'linear-gradient(135deg, #1D1E25 0%, #2A2B35 50%, #1D1E25 100%)',
        'gradient-legal-light': 'linear-gradient(135deg, #E8EBF0 0%, #D1D9E6 50%, #E8EBF0 100%)',
        
        // Инфраструктурный блок - тёмно-фиолетовый фон с голубыми акцентами
        'gradient-infrastructure': 'linear-gradient(135deg, #241E34 0%, #2D2540 50%, #241E34 100%)',
        'gradient-infrastructure-light': 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #DBEAFE 100%)',
        
        // Стипендиальный комитет - тёмно-красный фон с зелёными акцентами
        'gradient-scholarship': 'linear-gradient(135deg, #251D1D 0%, #2D2525 50%, #251D1D 100%)',
        'gradient-scholarship-light': 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #D1FAE5 100%)',
        
        // Иностранным студентам - тёмно-коричневый фон с оранжевыми акцентами
        'gradient-international': 'linear-gradient(135deg, #2B2121 0%, #3D2F2F 50%, #2B2121 100%)',
        'gradient-international-light': 'linear-gradient(135deg, #FFF4E6 0%, #FFE4B5 50%, #FFF4E6 100%)',
        
        // Нейтральный/Объединение - тёмно-фиолетовый фон с маджентовыми акцентами
        'gradient-neutral': 'linear-gradient(135deg, #241E34 0%, #2D2540 50%, #241E34 100%)',
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
