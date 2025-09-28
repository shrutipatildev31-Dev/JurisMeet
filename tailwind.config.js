/* @type {import('tailwindcss').Config} */

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1173d4",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "foreground-light": "#101922",
        "foreground-dark": "#f6f7f8",
        "subtle-light": "#e3e5e8",
        "subtle-dark": "#202a34",
        "muted-light": "#64748b",
        "muted-dark": "#94a3b8",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        logo: ["Playfair Display", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
    },
  },
};
