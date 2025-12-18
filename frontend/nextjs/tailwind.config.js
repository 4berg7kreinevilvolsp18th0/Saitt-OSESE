
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
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      // Добавляем поддержку префикса light:
      addVariant('light', '.light &');
    }),
  ],
};
