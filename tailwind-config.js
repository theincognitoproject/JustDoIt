/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#200122',
        'secondary': '#6f0000',
        'primary-transparent': 'rgba(32, 1, 34, 0.5)',
        'secondary-transparent': 'rgba(111, 0, 0, 0.5)',
      },
      fontFamily: {
        'opensans': ['"Open Sans"', 'sans-serif'],
        'satisfy': ['Satisfy', 'cursive'],
        'josefin': ['"Josefin Sans"', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom, rgba(32, 1, 34, 0.5), rgba(111, 0, 0, 0.5))',
      },
    },
  },
  plugins: [],
}