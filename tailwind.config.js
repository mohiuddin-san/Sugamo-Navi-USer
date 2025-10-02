/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./routes/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xsm': '320px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      colors: {
        'main': '#3f3f3f',
        'brand-red': '#e74c3c',
        'brand-blue': '#3498db',
        'brand-green': '#2ecc71',
        'brand-gold': '#a99f3c',
        'media': '#a7cbd6',
        'text-number': '#e59d5c',
        'text-light': '#666666',
      },
      fontFamily: {
        sawarabi: ["'Sawarabi Gothic'", "sans-serif"],
        cairo: ["'Cairo'", "sans-serif"],
        courierPrime: ["'Courier Prime'", "monospace"],
        courier: ["Courier", "monospace"],
        cousine: ["Cousine", "monospace"]
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const utilities = {
        '.flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.button-reset': {
          background: 'none',
          border: 'none',
          padding: '0',
          margin: '0',
          cursor: 'pointer',
          outline: 'none',
        },
        '.pc-only': {
          display: 'none',
          '@media (min-width: 768px)': {
            display: 'block',
          },
        },
        '.sp-only': {
          display: 'block',
          '@media (min-width: 768px)': {
            display: 'none',
          },
        },
      }

      addUtilities(utilities)
    }),
    require('@tailwindcss/line-clamp')
  ],
}