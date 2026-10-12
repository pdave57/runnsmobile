/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#132B5E',
          red: '#D91E36',
        },
        secondary: {
          blue: '#508ceb',
        },
        background: '#FFFFFF',
        text: {
          dark: '#1A1A1A',
          light: '#555555',
        },
        border: '#f0f0f0',
      },
      borderRadius: {
        DEFAULT: '20px',
        sm: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      spacing: {
        '18': '72px',
        '88': '352px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(19, 43, 94, 0.05)',
        'card-hover': '0 8px 20px rgba(19, 43, 94, 0.1)',
        'card-hover-strong': '0 15px 25px rgba(19, 43, 94, 0.2)',
        'button': '0 10px 20px rgba(19, 43, 94, 0.2)',
        'button-hover': '0 15px 25px rgba(19, 43, 94, 0.3)',
        'button-rider': '0 10px 20px rgba(217, 30, 54, 0.2)',
        'button-rider-hover': '0 15px 25px rgba(217, 30, 54, 0.3)',
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
    },
  },
  plugins: [],
}