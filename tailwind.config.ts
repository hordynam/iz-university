import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        brand: {
          navy: "#003177",
          "navy-dark": "#001f4d",
          "navy-light": "#1a4a9e",
          gold: "#C9A84C",
          "gold-light": "#e0c278",
        },
        background: "#FFFFFF",
        surface: "#F5F7FA",
        foreground: "#1A1A2E",
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#003177",
        primary: {
          DEFAULT: "#003177",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F5F7FA",
          foreground: "#1A1A2E",
        },
        accent: {
          DEFAULT: "#C9A84C",
          foreground: "#1A1A2E",
        },
        muted: {
          DEFAULT: "#F5F7FA",
          foreground: "#6B7280",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A2E",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A2E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
