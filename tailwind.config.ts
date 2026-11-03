import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette - will be customized
        navy: {
          900: '#0A1628',
          800: '#102038',
          700: '#162D4A',
        },
        electric: {
          500: '#007BFF',
          400: '#3399FF',
          600: '#0062CC',
        },
        amber: {
          500: '#FFB800',
          400: '#FFCC33',
          600: '#E6A400',
        },
        lime: {
          500: '#A8D600',
          400: '#C4E833',
          600: '#92BF00',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config