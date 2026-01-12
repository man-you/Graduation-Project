/** @type {import('tailwindcss').Config} */
export default {
  // 扫描入口 html 以及 src 目录下所有 Vue / JS / TS 文件中的 class
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
