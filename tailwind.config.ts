import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        cream: "#e8f3fc",
        brand: {
          50: "#eef7ff",
          100: "#d8eaf8",
          500: "#3b8bd4",
          600: "#1976d2",
          700: "#155fa8"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(30, 82, 130, 0.11)"
      }
    },
  },
  plugins: [],
};

export default config;
