/** @type {import('tailwindcss').Config} */

const backgroundImage = {
  auth_bg_image: "url('/images/auth-background.png')",
  'gradient-conic':
    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
}

const boxShadow = {
  1: '0px 0px 18px rgba(0, 0, 0, 0.15)',
  2: '0px 4px 29px rgba(0, 0, 0, 0.25)',
  3: '0px 0px 18px rgba(0, 0, 0, 0.05)',
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
  '2xl': '28px',
  '3xl': '36px',
  '4xl': '72px',
  base: '16px',
  lg: '20px',
  sm: '14px',
  xl: '24px',
  xs: '12px',
}

const fontWeight = {
  bold: '700',
  extraBold: '800',
  medium: '500',
  regular: '400',
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
  theme: {
    extend: {
      backgroundImage,
      boxShadow,
      colors,
    },
    fontFamily,
    fontSize,
    fontWeight,
  },
  zIndex: {
    banner: '60',
    dropdown: '70',
    'hamburger-menu': '80',
    header: '60',
    modal: '100',
    navDrawer: '90',
  },
}
