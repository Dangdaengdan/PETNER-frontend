import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom color system
        brown: {
          100: "var(--color-brown-100)",
          400: "var(--color-brown-400)",
          500: "var(--color-brown-500)",
          600: "var(--color-brown-600)",
          700: "var(--color-brown-700)",
          800: "var(--color-brown-800)",
        },
        green: {
          300: "var(--color-green-300)",
          400: "var(--color-green-400)",
          500: "var(--color-green-500)",
          700: "var(--color-green-700)",
        },
        neutral: {
          200: "var(--color-neutral-200)",
          700: "var(--color-neutral-700)",
          900: "var(--color-neutral-900)",
        },
        orange: {
          100: "var(--color-orange-100)",
          300: "var(--color-orange-300)",
          500: "var(--color-orange-500)",
          700: "var(--color-orange-700)",
          900: "var(--color-orange-900)",
        },
        blue: {
          100: "var(--color-blue-100)",
          300: "var(--color-blue-300)",
          500: "var(--color-blue-500)",
          700: "var(--color-blue-700)",
          900: "var(--color-blue-900)",
        },
        purple: {
          100: "var(--color-purple-100)",
          300: "var(--color-purple-300)",
          500: "var(--color-purple-500)",
          700: "var(--color-purple-700)",
          900: "var(--color-purple-900)",
        },
        pink: {
          100: "var(--color-pink-100)",
          300: "var(--color-pink-300)",
          500: "var(--color-pink-500)",
          700: "var(--color-pink-700)",
          900: "var(--color-pink-900)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;