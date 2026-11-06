/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * NADI palette — three colours, nothing else.
         *   ink    deep night blue, for text and dark grounds
         *   paper  warm off-white ground
         *   river  electric blue, NADI's own colour pushed brighter (the logo's waves)
         *   ember  the single hot accent: Donate, highlights, the odd full stop
         * `mist` is a pale tint of river for quiet surfaces.
         */
        ink: { DEFAULT: '#0B1020', soft: '#141B30', line: '#262F4A' },
        paper: { DEFAULT: '#F3F0E9', dim: '#E8E3D8', line: '#D6CFC0' },
        river: { DEFAULT: '#2152FF', deep: '#1238C4', light: '#8EA8FF' },
        mist: '#DDE5FF',
        ember: { DEFAULT: '#FF5A2C', deep: '#E2441A' },
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { frame: '1520px' },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        inout: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}
