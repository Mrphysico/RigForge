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
        navy: {
          950: '#050a14',
          900: '#08111f',
          850: '#0a1526',
          800: '#0d172e',
          750: '#101d38',
          700: '#142244',
          600: '#1e2d4f',
          500: '#26365a',
          400: '#3a4e7a',
        },
        rig: {
          bg: '#050a14',
          surface: '#08111f',
          card: '#0d172e',
          elevated: '#142244',
          border: '#1e2d4f',
          muted: '#94a3b8',
          red: '#ff1e2d',
          'red-dark': '#e50914',
          blue: '#0066ff',
          'blue-dark': '#0052cc',
          yellow: '#ffd000',
          'yellow-dark': '#e6b800',
          orange: '#fca311',
          accent: '#ff1e2d',
          glow: 'rgba(255, 30, 45, 0.4)',
        }
      },
      boxShadow: {
        'glow-red': '0 0 30px -5px rgba(255, 30, 45, 0.45)',
        'glow-blue': '0 0 30px -5px rgba(0, 102, 255, 0.45)',
        'glow-yellow': '0 0 30px -5px rgba(255, 208, 0, 0.45)',
        'glow-orange': '0 0 25px -5px rgba(252, 163, 17, 0.35)',
        'glow-brand': '0 0 35px -5px rgba(255, 30, 45, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
