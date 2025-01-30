/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'terminal-green': '#00ff00',
        'dark-bg': '#1a1b1e',
        'light-primary': '#2563eb'
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
        sans: ['Inter', 'sans-serif']
      }
    }
  },


  plugins: [],
}

