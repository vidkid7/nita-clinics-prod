import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NITA Clinics brand — exact swatch #01ADA5 (rgb 1, 173, 165)
        primary: {
          50:  '#ecfffd',
          100: '#cffaf7',
          200: '#9ef0ea',
          300: '#5de1d8',
          400: '#1eccbe',
          500: '#01ada5',   // ← exact reference
          600: '#01998f',
          700: '#017f78',
          800: '#016660',
          900: '#014d49',
          950: '#002a28',
        },
        // Same hue as primary
        accent: {
          50:  '#ecfffd',
          100: '#cffaf7',
          200: '#9ef0ea',
          300: '#5de1d8',
          400: '#1eccbe',
          500: '#01ada5',
          600: '#01998f',
          700: '#017f78',
          800: '#016660',
          900: '#014d49',
          950: '#002a28',
        },
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in':   'scaleIn 0.3s ease-out',
        'float':      'float 6s ease-in-out infinite',
        'ecg-draw':   'ecgDraw 5s ease-in-out forwards',
        'ecg-flow':   'ecgFlow 12s linear infinite',
        'vital-ping': 'vitalPing 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'sheen':      'sheen 4.5s ease-in-out infinite',
        'aurora':     'aurora 14s ease infinite',
        'liquid':     'liquidFlow 16s ease infinite',
        'blob':       'blobFloat 12s ease-in-out infinite',
        'morph':      'morph 10s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn:   { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        float:     { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        ecgDraw: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        ecgFlow: {
          '0%':   { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-600' },
        },
        vitalPing: {
          '0%':   { boxShadow: '0 0 0 0 rgba(1,173,165,0.5)' },
          '70%':  { boxShadow: '0 0 0 12px rgba(1,173,165,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(1,173,165,0)' },
        },
        sheen: {
          '0%, 55%': { transform: 'translateX(-130%) skewX(-12deg)' },
          '90%, 100%': { transform: 'translateX(320%) skewX(-12deg)' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        liquidFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        blobFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(44px, -32px) scale(1.08)' },
          '66%': { transform: 'translate(-32px, 22px) scale(0.94)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        soft:     '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        card:     '0 0 0 1px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.1)',
        elevated: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        teal:     '0 4px 24px rgba(1,173,165,0.35)',
        glass:    '0 8px 32px -16px rgba(1,173,165,0.28), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
      },
    },
  },
  plugins: [],
};

export default config;
