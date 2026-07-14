/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Custom sleek palette
        zinc: {
          900: '#18181b',
          950: '#09090b', // Deepest black/gray
        },
        accent: {
          400: '#22d3ee', // Cyan
          500: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}