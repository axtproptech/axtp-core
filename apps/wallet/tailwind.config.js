module.exports = {
  content: [
    "../../node_modules/daisyui/dist/**/*.js",
    "../../node_modules/react-daisyui/dist/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "768px",
      xl: "768px",
      "2xl": "768px",
    },
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },

  daisyui: {
    styled: true,
    themes: ["luxury", "bumblebee"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "luxury",
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
