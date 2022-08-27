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
          "0%, 100%": { transform: "scale(1.0)" },
          "50%": { transform: "scale(1.05)" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        wiggle: "wiggle 2s ease-in-out infinite",
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
