const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./containers/Exclusive/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        xs: "300px",
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
