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
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#fca311',
          DEFAULT: '#fca311',
          hover: '#e59200',
          dark: '#b45309',
          light: '#ffb74d',
        },
        rig: {
          bg: '#050505',
          surface: '#0d0d0d',
          card: '#111111',
          elevated: '#151515',
          border: '#262626',
          muted: '#a0a0a0',
          orange: '#fca311',
          accent: '#fca311',
          glow: 'rgba(252, 163, 17, 0.4)',
        }
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(252, 163, 17, 0.35)',
        'glow-brand': '0 0 35px -5px rgba(252, 163, 17, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(252, 163, 17, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
