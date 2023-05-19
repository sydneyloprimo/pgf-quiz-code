/** @type {import('tailwindcss').Config} */

const backgroundImage = {
  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  'gradient-conic':
    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
}

const colors = {
  active: '#254A96',
  'active-outline': '#9EBBF3',
  background: '#F4F7FA',
  black: '#000000',
  'dark-grey': '#636363',
  'dark-violet': '#00031A',
  error: '#D42F1A',
  focus: '#1D76EF',
  grey: '#C4C4C4',
  hover: '#446CBC',
  'light-grey': '#E0E0E0',
  links: '#076CE0',
  restored: '#559F21',
  white: '#FFFFFF',
}

const fontFamily = {
  DMSans: 'DMSans',
}

const fontSize = {
  '3xl': '36px',
  '2xl': '28px',
  xl: '24px',
  lg: '20px',
  base: '16px',
  sm: '14px',
  xs: '12px',
}

const fontWeight = {
  regular: 400,
  medium: 500,
  bold: 700,
  extraBold: 800,
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily,
    fontSize,
    fontWeight,
    extend: {
      backgroundImage,
      colors,
    },
  },
  zIndex: {
    header: '60',
    dropdown: '70',
    'hamburger-menu': '80',
    navDrawer: '90',
    modal: '100',
  },
  plugins: [],
}
