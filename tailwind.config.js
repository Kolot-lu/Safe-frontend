/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#ff3030',
          redLite: '#FF5F5F',
          orange: '#ff904c',
          orangeLite: '#FFA36A',
        },
        dark: {
          50: '#9BA8BE',
          100: '#8390A6',
          200: '#6C798E',
          300: '#566377',
          400: '#414D60',
          500: '#2C394B', // base
          600: '#182637',
        },
        darkLight: '#334756',
        background: {
          light: '#ffffff',
          dark: '#2C394B',
        },
        text: {
          light: '#333333',
          dark: '#e4e4e4',
        },
        border: {
          light: '#e0e0e0',
          dark: '#566377',
        },
        focus: {
          light: '#ff904c',
          dark: '#182637',
        },
        accent: {
          light: '#ffc1a1',
          dark: '#8b2c2c',
        },
      },
      transitionProperty: {
        height: 'height',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(0px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(0px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        fadeOut: 'fadeOut 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
  darkMode: 'selector',
};
