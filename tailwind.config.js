/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/*/.html",
    "./src/*/.js",
    "./src/*/.jsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto'], // Usar la fuente Poppins como fuente predeterminada
      },
    },
  },
  plugins: [],
}