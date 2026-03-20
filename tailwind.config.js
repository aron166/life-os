/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0a0a',
        bg2:     '#111111',
        bg3:     '#181818',
        bg4:     '#222222',
        text:    '#f0ede8',
        muted:   '#888580',
        faint:   '#3a3835',
        acc:     '#e8d5a0',
        acc2:    '#c4a96a',
        green:   '#7ec89a',
        red:     '#e07a6a',
        blue:    '#7ab8e0',
        orange:  '#e0a060',
        purple:  '#b09ae0',
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        syne:  ['Syne', 'sans-serif'],
        mono:  ['DM Mono', 'monospace'],
      },
      borderRadius: {
        card: '10px',
        lg:   '16px',
      },
    },
  },
  plugins: [],
}
