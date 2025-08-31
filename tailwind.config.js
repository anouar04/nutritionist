/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#10B981',
        'primary-focus': '#059669',
        'secondary': '#0EA5E9',
        'base-100': '#F9FAFB',
        'base-200': '#F3F4F6',
        'base-300': '#E5E7EB',
        'content': '#1F2937',
      },
    },
  },
  plugins: [],
}
