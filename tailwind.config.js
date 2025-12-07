/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ffff',
        secondary: '#1a1a1a',
        accent: '#0ff'
      },
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif']
      }
    },
  },
  plugins: [],
}
