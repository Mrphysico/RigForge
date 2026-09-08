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
        rig: {
          bg: '#09090b',
          surface: '#121216',
          card: '#18181f',
          border: '#272732',
          muted: '#71717a',
          cyan: '#06b6d4',
          neon: '#22d3ee',
          glow: '#0891b2',
          accent: '#3b82f6',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-neon': '0 0 35px -5px rgba(34, 211, 238, 0.4)',
        'glow-accent': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
