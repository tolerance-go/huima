/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./src/**/*.html', './src/**/*.vue'],
   theme: {
      extend: {},
   },
   darkMode: 'class',
   plugins: [require('@tailwindcss/forms')],
}
