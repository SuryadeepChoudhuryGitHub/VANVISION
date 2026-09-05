/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand-primary)',
          primary: 'var(--brand-primary)',
          dark: 'var(--brand-dark)',
          light: 'var(--brand-light)',
          border: 'var(--brand-border)',
          focus: 'var(--brand-focus)',
        },
        forest: {
          50: '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d2',
          300: '#86efb0',
          400: '#4ade87',
          500: '#22c563',
          600: '#16a34e',
          700: '#158040',
          800: '#14532d',
          850: '#0f3f23',
          900: '#0c331d',
          950: '#061d10',
        },
        gov: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        risk: {
          normal: '#16a34a',
          attention: '#d97706',
          high: '#ea580c',
          critical: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
