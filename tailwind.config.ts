import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0612',
        'bg-elev': '#14101e',
        surface: '#1a1424',
        gold: '#f59e0b',
        'gold-light': '#fbbf24',
        saffron: '#ea580c',
        indigo: '#818cf8',
        emerald: '#10b981',
        crimson: '#be123c',
        text: '#f5f1e8',
        'text-muted': '#a8a195',
        'text-faint': '#6b6557',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(245, 158, 11, 0.12)',
        strong: 'rgba(245, 158, 11, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
