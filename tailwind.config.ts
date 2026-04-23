import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050510',
          elevated: '#0B0B1A',
          raised: '#12122A',
          sunken: '#030308',
        },
        accent: {
          DEFAULT: '#00A8E8',
          soft: 'rgba(0,168,232,0.12)',
          glow: 'rgba(0,168,232,0.35)',
        },
        pink: {
          DEFAULT: '#FF4FA8',
          soft: 'rgba(255,79,168,0.12)',
          glow: 'rgba(255,79,168,0.35)',
        },
        border: 'rgba(255,255,255,0.08)',
        'border-strong': 'rgba(255,255,255,0.16)',
        muted: 'rgba(255,255,255,0.55)',
        subtle: 'rgba(255,255,255,0.35)',
        success: '#2DD4BF',
        danger: '#F43F5E',
        warning: '#FBBF24',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        widest: '0.15em',
        ultra: '0.25em',
      },
      boxShadow: {
        glow: '0 0 32px rgba(0,168,232,0.28)',
        'glow-soft': '0 0 16px rgba(0,168,232,0.16)',
        'glow-pink': '0 0 32px rgba(255,79,168,0.28)',
        'glow-pink-soft': '0 0 16px rgba(255,79,168,0.16)',
        'inner-border': 'inset 0 0 0 1px rgba(255,255,255,0.08)',
        card: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snap: 'cubic-bezier(0.7, 0, 0.3, 1)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
        600: '600ms',
      },
      backgroundImage: {
        'grad-accent': 'linear-gradient(135deg, #00A8E8 0%, #0072B5 100%)',
        'grad-pink': 'linear-gradient(135deg, #FF4FA8 0%, #C21E7A 100%)',
        'grad-cosmic':
          'linear-gradient(135deg, rgba(0,168,232,0.2) 0%, rgba(255,79,168,0.2) 100%)',
        'grad-fade-top':
          'linear-gradient(to top, #050510 0%, rgba(5,5,16,0.6) 40%, rgba(5,5,16,0.1) 80%, transparent 100%)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(244,63,94,0.5)' },
          '70%': { boxShadow: '0 0 0 10px rgba(244,63,94,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(244,63,94,0)' },
        },
        'glow-pulse': {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 400ms cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slide-up 500ms cubic-bezier(0.22,1,0.36,1)',
        'slide-down': 'slide-down 400ms cubic-bezier(0.22,1,0.36,1)',
        shake: 'shake 300ms ease-in-out',
        marquee: 'marquee 40s linear infinite',
        'marquee-fast': 'marquee 20s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.66, 0, 0, 1) infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
