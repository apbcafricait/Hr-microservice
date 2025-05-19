/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        tablet: "640px",
        laptop: "1024px",
        desktop: "1280px",
      },
      colors: {
        'terminal-green': '#00ff00',
        'dark-bg': '#1a1b1e',
        'light-primary': '#2563eb',
      },
      fontFamily: {
        poppins: ['Poppins', 'Arial', 'sans-serif'],
        lato: ['Lato', 'Helvetica', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      letterSpacing: {
        'poppins-tight': '-0.015em', // Subtle tightening for Poppins headings
      },
    },
  },
  plugins: [],
};