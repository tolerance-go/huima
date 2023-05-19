/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./src/ui.html'],
   theme: {
      extend: {},
   },
   plugins: [require('@tailwindcss/forms')],
}
