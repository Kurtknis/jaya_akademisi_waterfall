/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0056D2', // Coursera blue
          600: '#00419e',
          700: '#003380',
          800: '#0B2545', // Deep academic navy
          900: '#06152b',
        }
      }
    },
  },
  plugins: [],
}
