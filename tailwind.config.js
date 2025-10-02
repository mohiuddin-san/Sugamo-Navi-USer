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
        cousine: ['Cousine', 'monospace'],
      },
      // শুধু যেগুলো আপনার home page এ use হচ্ছে
      fontSize: {
        '16': '16px',
        '20': '20px',
        '21': '21px',
        '25': '25px',
        '31': '31px',
        '44': '44px',
        '48': '48px',
        '58': '58px',
        '61': '61px',
        '75': '75px',
        '80': '80px',
      },
      // Home page এ actually use হওয়া spacing values
      spacing: {
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '8': '8px',
        '13': '13px',
        '16': '16px',
        '20': '20px',
        '21': '21px',
        '24': '24px',
        '25': '25px',
        '26': '26px',
        '32': '32px',
        '33': '33px',
        '35': '35px',
        '40': '40px',
        '42': '42px',
        '46': '46px',
        '50': '50px',
        '54': '54px',
        '55': '55px',
        '56': '56px',
        '58': '58px',
        '59': '59px',
        '64': '64px',
        '70': '70px',
        '71': '71px',
        '72': '72px',
        '80': '80px',
        '83': '83px',
        '88': '88px',
        '90': '90px',
        '94': '94px',
        '100': '100px',
        '113': '113px',
        '116': '116px',
        '124': '124px',
        '130': '130px',
        '131': '131px',
        '154': '154px',
        '170': '170px',
        '207': '207px',
        '210': '210px',
        '224': '224px',
        '240': '240px',
        '253': '253px',
        '257': '257px',
        '262': '262px',
        '311': '311px',
        '319': '319px',
        '338': '338px',
        '350': '350px',
        '360': '360px',
        '434': '434px',
        '450': '450px',
        '496': '496px',
        '560': '560px',
        '642': '642px',
      },
      borderRadius: {
        '30px': '30px',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      // শুধু essential utilities
      const utilities = {
        '.flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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