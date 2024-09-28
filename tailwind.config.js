/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        openSans: ["Open Sans Condensed", "sans-serif"],
      },
      colors: {
        "primary-color": "#819E33",
      },
    },
  },
  plugins: [],
};
