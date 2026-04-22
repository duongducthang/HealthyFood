/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
         primary: '#00b2ff',
         'primary-dark': '#0099dd',
         'gray-light': '#f5f5f5',
         'gray-border': '#f0f0f0',
         'text-main': '#333',
         'text-muted': '#666',
         'text-light': '#999',
         'text-dark': '#1a1a1a',
         'brand-green': '#4d554e',
         'brand-gold': '#BF9528',
       },
       spacing: {
         '1.25': '5px',
         '3.75': '15px',
         '4.5': '18px',
         '6.25': '25px',
         '7.5': '30px',
         '12.5': '50px',
         '15': '60px',
         '25': '100px',
         '125': '500px',
       },
       fontSize: {
         'rem-1.1': '1.1rem',
         'rem-1.4': '1.4rem',
         'rem-1.5': '1.5rem',
         'rem-1.6': '1.6rem',
         'rem-1.8': '1.8rem',
       },
       maxWidth: {
         '1200': '1200px',
         '1400': '1400px',
       },
      borderRadius: {
        'xl-plus': '12px',
        '2xl-plus': '20px',
        '3xl-plus': '25px',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0,0,0,0.05)',
        'card-hover': '0 15px 30px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}
