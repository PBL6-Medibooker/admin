module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00A6A9',
      },
      keyframes: {
        'border': {
          to: { '--border-angle': '360deg' },
        }
      },
      animation: {
        'border': 'border 4s linear infinite',
      },
      boxShadow: {
        'custom': '-10px -10px 0px #F8F9FD',
        'custom2': '-10px 10px 0px green',
        'custom3': '-10px 10px 0px #F8F9FD',
        custom4: '-5px -5px 0px 5px theme("colors.amber.400")'      }
    },
  },
  plugins: [],
};
