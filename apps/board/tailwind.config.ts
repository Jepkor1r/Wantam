import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif"],
      },
      colors: {
        soil: "#1a120b",
        stall: "#2a1c12",
        maize: "#f4c430",
        leaf: "#3d8b5c",
        clay: "#c45c26",
      },
    },
  },
  plugins: [],
} satisfies Config;
