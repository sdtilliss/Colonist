import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#fdfaf3",
          100: "#faf3e3",
          200: "#f2e4c4",
          300: "#e8d19b",
        },
        brick: {
          400: "#d97a52",
          500: "#c1552e",
          600: "#a33f21",
          700: "#7f321c",
        },
        wood: {
          400: "#5c8256",
          500: "#3f6b45",
          600: "#2f5233",
          700: "#233d27",
        },
        wheat: {
          300: "#f4d888",
          400: "#e8b93d",
          500: "#d19c1f",
          600: "#a87816",
        },
        sheep: {
          300: "#c3dba0",
          400: "#a8c686",
          500: "#8bab66",
        },
        ore: {
          400: "#8b95a1",
          500: "#6e7f80",
          600: "#4f5c63",
          700: "#3a444a",
        },
        ink: {
          800: "#2b2320",
          900: "#1c1613",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(43, 35, 32, 0.06), 0 6px 18px rgba(43, 35, 32, 0.08)",
        lift: "0 10px 30px rgba(43, 35, 32, 0.14)",
      },
      backgroundImage: {
        hexgrid:
          "radial-gradient(circle at 1px 1px, rgba(43,35,32,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
