/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bonsai: {
          green: '#8BA876',
          moss: '#4A5D32',
          terra: '#C84C31',
          bark: '#2C2C2C',
          clay: '#8B4513',
          stone: '#1A1A1A',
          leaf: '#A5C882',
        }
      },
      fontFamily: {
        display: ['Zen Maru Gothic', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};