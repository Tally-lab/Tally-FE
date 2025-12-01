/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#9333ea',
          600: '#7e22ce',
          700: '#6b21a8',
          800: '#581c87',
          900: '#4c1d95',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #9333ea 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #6b21a8 0%, #9333ea 100%)',
        'gradient-dark': 'linear-gradient(to bottom, #1a0b2e 0%, #2d1b4e 50%, #3d2963 100%)',
      },
    },
  },
  plugins: [],
}
