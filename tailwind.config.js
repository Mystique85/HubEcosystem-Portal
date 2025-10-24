/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./components/**/*.html", 
    "./sections/**/*.html",
    "./scripts/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0a0a0a',
        'secondary-dark': '#111111', 
        'accent-neon': '#00ff88',
        'accent-purple': '#8b5cf6',
        'accent-blue': '#3b82f6',
        'accent-orange': '#f59e0b',
        'text-light': '#ffffff',
        'text-gray': '#a1a1aa'
      },
      animation: {
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 1s ease-out forwards',
        'ticker-scroll': 'tickerScroll 120s linear infinite'
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { 
            'background-position': '0% 50%'
          },
          '50%': { 
            'background-position': '100% 50%'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        ripple: {
          '0%': { 
            transform: 'scale(0.5)',
            opacity: '1'
          },
          '100%': { 
            transform: 'scale(3)',
            opacity: '0'
          }
        },
        tickerScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    },
  },
  plugins: [],
}