import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // enable dark mode
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
        xxs: "0.64rem", // extra extra small (10.24px)
        xs: "0.8rem", // extra small (12.8px)
        sm: "1rem", // small (16px)
        md: "1.25rem", // paragraph / body (20px)
        lg: "1.563rem", // h6 (25px)
        xl: "1.953rem", // h5 (31.25px)
        "2xl": "2.441rem", // h4 (39.06px)
        "3xl": "3.052rem", // h3 (48.83px)
        "4xl": "3.815rem", // h2 (61.04px)
        "5xl": "4.688rem", // h1 (75px)
        "6xl": "6.125rem", // tablet title (98px) – adjusted from 4.688rem
        "7xl": "8.125rem", // desktop title (130px)
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
        17: "7.2rem",
        18: "7.6rem",
        19: "8rem",
        20: "8.4rem",
        "navigation-height": "var(--navigation-height)",
      },
      height: {
        "screen-dvh": "100dvh",
      },
      minHeight: {
        "50dvh": "50dvh",
        "25dvh": "25dvh",
        "15dvh": "15dvh",
      }

    },
  },
  plugins: [],
};

export default config;
