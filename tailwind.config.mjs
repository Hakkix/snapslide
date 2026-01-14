/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '3': 'repeat(3, 1fr)',
        '4': 'repeat(4, 1fr)',
        '5': 'repeat(5, 1fr)',
        '6': 'repeat(6, 1fr)',
      },
      gridTemplateRows: {
        '3': 'repeat(3, 1fr)',
        '4': 'repeat(4, 1fr)',
        '5': 'repeat(5, 1fr)',
        '6': 'repeat(6, 1fr)',
      },
    },
  },
  plugins: [],
};
