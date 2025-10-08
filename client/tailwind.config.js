/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6D28D9', // A deep purple
        'primary-light': '#8B5CF6',
        secondary: '#1F2937', // A dark gray
        'secondary-light': '#4B5563',
        accent: '#EC4899', // A pink accent for highlights
        background: '#F9FAFB', // Light gray background
      },
    },
  },
  plugins: [],
};