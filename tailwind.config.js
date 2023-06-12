/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './scenes/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#034659',
        'midnight-light': '#034E5F',
        gray: '#d3d4d5',
        blue: '#11a6c5',
        'purple-fade-from': 'rgb(89, 75, 143)',
        'purple-fade-to': 'rgb(107, 97, 152)',
      },
      minWidth: {
        28: '128px',
      },
      minHeight: {
        50: '200px',
        96: '384px',
      },
      width: {
        32: '128px',
      },
      height: {
        90: '360px',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
