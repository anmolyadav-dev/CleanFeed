/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-1': 'fadeIn 1s ease-out 0.5s forwards',
        'fade-in-2': 'fadeIn 1s ease-out 1s forwards',
        'fade-in-3': 'fadeIn 1s ease-out 1.5s forwards',
        'fade-in-4': 'fadeIn 1s ease-out 2s forwards',
        'fade-in-5': 'fadeIn 1s ease-out 2.5s forwards',
      }
    }
  },
  plugins: [],
}