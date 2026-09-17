/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cr: {
          bg: '#f1f5f9',
          surface: '#ffffff',
          border: '#e2e8f0',
          sidebar: '#0f172a',
          'sidebar-hover': '#1e293b',
          'sidebar-text': '#94a3b8',
          'sidebar-active': '#38bdf8',
          navy: '#0f172a',
          blue: '#0ea5e9',
          cyan: '#06b6d4',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
          purple: '#8b5cf6',
          text: '#0f172a',
          muted: '#64748b',
          light: '#f8fafc',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}