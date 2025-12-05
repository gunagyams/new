/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f3',
        charcoal: '#2d2d2d',
        gold: '#c9a869',
        sand: '#e8e2d5',
        maroon: '#8B4049',
        'maroon-dark': '#6D323A',
        'maroon-light': '#A04F59',
      },
    },
  },
  plugins: [],
};
