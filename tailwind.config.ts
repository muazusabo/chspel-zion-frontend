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
        ink: {
          DEFAULT: '#101A2B',
          50: '#EEF1F5',
          100: '#D7DDE6',
          200: '#AFBBCB',
          300: '#8797AF',
          400: '#5F7393',
          500: '#3D4F6B',
          600: '#243349',
          700: '#182339',
          800: '#101A2B',
          900: '#0A111C',
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
        parchment: '#F7F3E9',
        paper: '#FFFEFB',
        slate: {
          DEFAULT: '#5C6570',
          400: '#889199',
          600: '#454C55',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '8px',
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
