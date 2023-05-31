/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./src/**/*.html', './src/**/*.vue'],
   theme: {
      extend: {},
   },
   plugins: [require('@tailwindcss/forms')],
}
