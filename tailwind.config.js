/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js}",
        "./assets/**/*.{html,js}",
    ],
    theme: {
        extend: {
            fontFamily: {
                openSans: ["Open Sans Condensed", "sans-serif"],
            },
            colors: {
                "primary-color": "#819E33",
            },
            scrollbar: ['hidden'],
            boxShadow: {
                "custom": "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }
        },
    },
    plugins: [],
};
