/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        lg: "1100px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Manrope", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Manrope", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          800: "#1e293b",
          900: "#0f172a",
        },
        ink: {
          900: "#0f172a",
          800: "#111827",
          700: "#1f2937",
          600: "#334155",
          500: "#475569",
          400: "#94a3b8",
        },
      },
      boxShadow: {
        soft: "0 10px 50px -25px rgba(15, 23, 42, 0.35)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
