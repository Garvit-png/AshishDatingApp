import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        heading: ["var(--font-heading)"],
      },
      keyframes: {
        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(24px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "text-glow": {
          "0%": {
            textShadow: "0 0 10px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.4)",
          },
          "50%": {
            textShadow: "0 0 15px rgba(255, 50, 50, 0.9), 0 0 30px rgba(255, 0, 0, 0.8), 0 0 45px rgba(255, 0, 0, 0.6), 0 0 60px rgba(255, 0, 0, 0.4)",
          },
          "100%": {
            textShadow: "0 0 10px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.4)",
          },
        },
      },
      animation: {
        "slide-up": "slide-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.7s ease forwards",
        "text-glow": "text-glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tw-animate-css")],
};

export default config;