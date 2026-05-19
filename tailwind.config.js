/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enable dark mode by class
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        accent: 'var(--accent)',
        accentGlow: 'var(--accent-glow)',
        surface: 'var(--surface)',
        borderBase: 'var(--border-base)',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow 3s infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px var(--accent-glow)' },
          '100%': { boxShadow: '0 0 20px var(--accent), 0 0 30px var(--accent-glow)' },
        }
      }
    },
  },
  plugins: [],
}
