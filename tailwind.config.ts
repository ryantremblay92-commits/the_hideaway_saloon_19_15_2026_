import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          gold: "#C9A962",
          charcoal: "#1A1A1A",
          "charcoal-premium": "#0A0A0B",
          "gold-shimmer": "#C9A962",
          ivory: "#FAF8F5",
          white: "#FFFEF9",
        },
        secondary: {
          sage: "#8B9A7D",
          rose: "#C4A4A4",
          slate: "#4A4A4A",
          pearl: "#E8E4DF",
        },
        semantic: {
          success: "#4A7C59",
          error: "#C45C5C",
          warning: "#D4A84B",
        }
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        orbitron: ["var(--font-orbitron)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(to right, #8B7355, #C9A962, #E8D3A3)",
        "gold-gradient-vertical": "linear-gradient(to bottom, #8B7355, #C9A962, #E8D3A3)",
        "luxury-conic": "conic-gradient(from 180deg at 50% 50%, #C9A962, #1A1A1A, #C9A962)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'luxury': '0 0 50px -12px rgba(212, 175, 55, 0.25)',
        'luxury-inner': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'shimmer': 'shimmer 3.236s infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
