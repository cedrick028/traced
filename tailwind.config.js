/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "secondary": "var(--secondary)",
        "surface": "var(--surface)",
        "muted": "var(--muted)",
        "progress-dark": "var(--progress-dark)",
        "progress-light": "var(--progress-light)",
        "success": "var(--success)",
        "warning": "var(--warning)",
        "danger": "var(--danger)",
        "info": "var(--info)"
      }
    },
  },
  plugins: [],
}