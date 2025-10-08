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
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a5bbff',
          400: '#8098ff',
          500: '#5b75ff',
          600: '#3d4ef7',
          700: '#2f3ee3',
          800: '#2632b8',
          900: '#252f91',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5b75ff 0%, #a855f7 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #3d4ef7 0%, #9333ea 100%)',
      },
    },
  },
  plugins: [],
}
