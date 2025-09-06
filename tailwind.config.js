/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
          '3xl': '1921px',
          
},
      colors: {
        'marketing-pink': '#e5307e',
        'marketing-light-pink': '#ff6b9c',
        'marketing-blue': '#1d1f89',
        'marketing-teal': '#46adb6',
      }
    },
  },
  
  plugins: [],
}
