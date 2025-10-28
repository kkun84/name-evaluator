import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif JP"', 'serif'],
        sans: ['"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        fortune: {
          primary: '#8d5a2f',
          accent: '#b48152',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
