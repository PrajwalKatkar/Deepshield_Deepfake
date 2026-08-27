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
        cyber: {
          bg: '#0A0D14',
          card: '#121620',
          border: '#1C2433',
          header: '#0E121B',
          accent: '#10B981', // Matrix Emerald Primary
          accentGlow: 'rgba(16, 185, 129, 0.18)',
          secondary: '#06B6D4', // Tactical Cyan Secondary
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          subtext: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
