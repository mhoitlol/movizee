import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101014",
        panel: "#1b1b21",
        line: "#32323b",
        gold: "#f5c451"
      }
    }
  },
  plugins: []
};

export default config;
