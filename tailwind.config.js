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
          bg: '#07090E',
          surface: '#0E121C',
          card: '#0E121C',
          elevated: '#121622',
          border: 'rgba(255, 255, 255, 0.08)',
          muted: '#94a3b8',
          red: '#FF1F29',
          'red-dark': '#E01923',
          blue: '#0284C7',
          'neon-blue': '#38BDF8',
          'blue-dark': '#0369A1',
          yellow: '#F59E0B',
          amber: '#FACC15',
          'yellow-dark': '#D97706',
          orange: '#F59E0B',
          accent: '#FF1F29',
          glow: 'rgba(255, 31, 41, 0.45)',
        }
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(255, 31, 41, 0.5)',
        'glow-red-lg': '0 0 35px rgba(255, 31, 41, 0.6)',
        'glow-blue': '0 0 25px rgba(2, 132, 199, 0.5)',
        'glow-blue-lg': '0 0 35px rgba(56, 189, 248, 0.5)',
        'glow-yellow': '0 0 25px rgba(245, 158, 11, 0.5)',
        'glow-yellow-lg': '0 0 35px rgba(250, 204, 21, 0.5)',
        'glow-orange': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-brand': '0 0 35px -5px rgba(255, 31, 41, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        teko: ['Teko', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
