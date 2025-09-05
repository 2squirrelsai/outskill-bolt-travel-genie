/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette
        'brand': {
          'black': '#000000',
          'navy': '#14213D',
          'orange': '#FCA311',
          'gray': '#E5E5E5',
          'white': '#FFFFFF',
        },
        // Override default colors to use brand palette
        'primary': {
          DEFAULT: '#FCA311',
          50: '#FEF3E2',
          100: '#FDE4B8',
          200: '#FCD489',
          300: '#FCC45A',
          400: '#FCB42B',
          500: '#FCA311',
          600: '#E6930F',
          700: '#CC830E',
          800: '#B3730C',
          900: '#99630A',
        },
        'secondary': {
          DEFAULT: '#14213D',
          50: '#F0F2F5',
          100: '#D9DDE6',
          200: '#B3BCC9',
          300: '#8D9BAC',
          400: '#677A8F',
          500: '#14213D',
          600: '#121E37',
          700: '#101A31',
          800: '#0E172B',
          900: '#0C1425',
        },
        'neutral': {
          50: '#FFFFFF',
          100: '#F8F8F8',
          200: '#E5E5E5',
          300: '#D1D1D1',
          400: '#BEBEBE',
          500: '#AAAAAA',
          600: '#969696',
          700: '#828282',
          800: '#6E6E6E',
          900: '#000000',
        }
      }
    },
  },
  plugins: [],
};
