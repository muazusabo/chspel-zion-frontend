import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        fcs: {
          DEFAULT: '#1E5AA8',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#1E5AA8',
          600: '#194B8D',
          700: '#153D73',
          900: '#0B1B33',
        },
        ink: {
          DEFAULT: '#0B1B33',
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#0F172A',
          900: '#081426',
        },
        forest: {
          DEFAULT: '#1F3B2C',
          50: '#E9F0EB',
          100: '#C7DACD',
          500: '#2E5A41',
          700: '#1F3B2C',
          900: '#122217',
        },
        gold: {
          DEFAULT: '#B8924A',
          50: '#FAF4E9',
          100: '#F1E1BF',
          300: '#D9B77C',
          500: '#B8924A',
          700: '#8C6C33',
        },
        parchment: '#F8FAFC',
        paper: '#FFFFFF',
        slate: { DEFAULT: '#667085', 400: '#98A2B3', 600: '#475467' },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '6px',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
