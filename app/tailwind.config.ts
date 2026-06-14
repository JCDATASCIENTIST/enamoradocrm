import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4fb",
          100: "#d6e6f7",
          200: "#aecbed",
          500: "#2563a8",
          600: "#1d4f8a",
          700: "#163d6b",
          800: "#102e51",
          900: "#0b2038",
        },
        accent: {
          50: "#fff5eb",
          100: "#fde4c8",
          500: "#d2691e",
          600: "#b45309",
        },
        surface: {
          DEFAULT: "#f7f9fc",
          muted: "#eef2f8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(11, 32, 56, 0.08)",
        card: "0 1px 3px rgba(11, 32, 56, 0.06), 0 8px 24px -8px rgba(11, 32, 56, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
