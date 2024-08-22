import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Enable dark mode if needed
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      fontSize: {
        xs: "0.8rem", // extra small
        sm: "1rem", // small
        md: "1.25rem", // paragraph / body
        lg: "1.563rem", // h6
        xl: "1.953rem", // h5
        "2xl": "2.441rem", // h4
        "3xl": "3.052rem", // h3
        "4xl": "3.815rem", // h2
        "5xl": "4.063rem", // h1 (slightly adjusted to match the original px size more closely)
      },
      colors: {
        transparent: "transparent",
        "main-light": "#FEFBFB",
        "text-dark": "#E8E7E2",
        "secondary-light": "#7A736F",
        "middle-colour": "#403B3B",
        "text-light": '#242424',
        black: "#000000",
        "secondary-dark": "#BFAF9C",
        "accent-light": "#DDA6A6",
        "accent-dark": "#CD7A7A",
      },
      spacing: {
        0: "0",
        1: "0.4rem",
        2: "0.8rem",
        3: "1.2rem",
        4: "1.6rem",
        5: "2rem",
        6: "2.4rem",
        7: "2.8rem",
        8: "3.2rem",
        9: "3.6rem",
        10: "4rem",
        11: "4.4rem",
        12: "4.8rem",
        13: "5.2rem",
        14: "5.6rem",
        15: "6rem",
        16: "6.4rem",
        "navigation-height": "var(--navigation-height)",
      },
    },
  },
  plugins: [],
};

export default config;
