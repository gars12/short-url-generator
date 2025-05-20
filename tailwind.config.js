/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          'bg-primary': '#1a1a1a',
          'bg-secondary': '#2d2d2d',
          'text-primary': '#ffffff',
          'text-secondary': '#a0aec0',
          'border': '#404040',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
