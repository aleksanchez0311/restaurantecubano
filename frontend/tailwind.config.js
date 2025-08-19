/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cuban-red': '#d40000',
        'cuban-blue': '#002a89',
        'cuban-white': '#ffffff',
        'cuban-gold': '#ffcc00',
      }
    },
  },
  plugins: [],
}