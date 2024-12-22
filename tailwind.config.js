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
      keyframes: {
        slideUpIn: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        slideDownOut: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(100%)', opacity: '0' }
        },
        fadeSlideUp: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'slideUpIn': 'slideUpIn 0.3s ease-out',
        'slideDownOut': 'slideDownOut 0.3s ease-in',
        'fadeSlideUp': 'fadeSlideUp 0.5s ease-out forwards',
        'scaleIn': 'scaleIn 0.5s ease-out'
      }
    },
  },
  plugins: [],
};