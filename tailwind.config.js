module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00A6A9',
        slate: {
          200: '#e5e7eb',
          300: '#d1d5db',
        },
        pink: {
          300: '#f9a8d4',
        },
        blue: {
          200: '#bfdbfe',
        },
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
        'custom2': '-10px 10px 0px white',
        'custom3': '-10px 10px 0px #F8F9FD',
         custom4: '-5px -5px 0px 5px theme("colors.amber.400")',
        'custom5': '-10px -10px 0px #F8F9FD',
        custom6: '-10px 10px 0px #F8F9FD',
        'custom7': '-10px 10px 0px white',
        // speciality
        custom8: '-5px -5px 0px 5px rgba(0, 166, 169, 1)',
        custom9: '-5px -5px 0px 5px rgba(11, 94, 135, 1)'
        // custom9: '-5px -5px 10px rgba(239, 246, 255, 1)'



      }
    },
  },
  plugins: [],
};
