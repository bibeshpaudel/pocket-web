export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#020617', // slate-950
        surface: 'rgba(30, 41, 59, 0.4)', // slate-800/40
        border: 'rgba(255, 255, 255, 0.1)', // white/10
        text: '#f8fafc', // slate-50
        textSecondary: '#94a3b8', // slate-400
        accent: '#3b82f6', // blue-500
        accentHover: '#2563eb', // blue-600
        orb1: '#a855f7', // purple-500
        orb2: '#06b6d4', // cyan-500
        orb3: '#3b82f6', // blue-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        base: '12px',
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
}

