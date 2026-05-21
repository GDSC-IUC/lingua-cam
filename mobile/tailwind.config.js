/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: '#d6fff4',
        'surface-low': '#bcfeee',
        'surface-lowest': '#ffffff',
        primary: '#006850',
        'primary-container': '#90efcd',
        secondary: '#ba001e',
        tertiary: '#6e5a00',
        'tertiary-fixed': '#fbd115',
        'on-surface': '#00362e',
      },
      fontFamily: {
        jakarta: ['PlusJakartaSans_400Regular', 'sans-serif'],
        'jakarta-medium': ['PlusJakartaSans_500Medium', 'sans-serif'],
        'jakarta-semibold': ['PlusJakartaSans_600SemiBold', 'sans-serif'],
        'jakarta-bold': ['PlusJakartaSans_700Bold', 'sans-serif'],
      },
      boxShadow: {
        'griot': '0 10px 40px -10px rgba(0, 54, 46, 0.08)',
      }
    },
  },
  plugins: [],
}
