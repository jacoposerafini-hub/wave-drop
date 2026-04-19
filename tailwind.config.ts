import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: { primary: '#050510', elevated: '#0B0B1A', raised: '#12122A' },
        accent: { DEFAULT: '#00A8E8', soft: 'rgba(0,168,232,0.12)' },
        pink: { DEFAULT: '#FF4FA8', soft: 'rgba(255,79,168,0.12)' },
        border: 'rgba(255,255,255,0.08)',
        muted: 'rgba(255,255,255,0.55)',
        success: '#2DD4BF',
        danger: '#F43F5E',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { widest: '0.15em' },
      boxShadow: {
        glow: '0 0 24px rgba(0,168,232,0.18)',
        'glow-pink': '0 0 24px rgba(255,79,168,0.18)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 400ms cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slide-up 500ms cubic-bezier(0.22,1,0.36,1)',
        shake: 'shake 300ms ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
