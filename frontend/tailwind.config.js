/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:           '#0d7ff2',
        accent:            '#8b5cf6',
        'background-light':'#f5f7f8',
        'background-dark': '#0D1B2A',
        'navy-darker':     '#050b11',
        'accent-violet':   '#8b5cf6',
        'card-dark':       '#0d1117',
      },
      fontFamily: {
        display:    ['"Space Grotesk"', 'sans-serif'],
        michroma:   ['"Michroma"',      'sans-serif'],
        montserrat: ['"Montserrat"',    'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        '2xl':   '1rem',
        full:    '9999px',
      },
    },
  },
  plugins: [],
};