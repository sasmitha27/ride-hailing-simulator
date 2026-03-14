/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d1b2a",
        sea: "#1b263b",
        mint: "#00b894",
        amber: "#f39c12"
      }
    }
  },
  plugins: []
};
