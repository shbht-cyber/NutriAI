import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 22px 70px rgba(20, 184, 166, 0.22)",
        soft: "0 24px 80px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
