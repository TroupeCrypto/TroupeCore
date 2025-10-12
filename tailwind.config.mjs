import animate from "tailwindcss-animate";
export default {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#0b0b0f",
          border: "#1f1f2b",
        },
      },
    },
  },
  plugins: [animate],
};
