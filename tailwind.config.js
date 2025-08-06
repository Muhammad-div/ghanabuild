/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'teal': '#008080',
        'orange': '#FF6F00',
      },
    },
  },
  plugins: [],
};