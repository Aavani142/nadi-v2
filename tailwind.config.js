/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // never applied: the site uses one fixed brand theme
  theme: {
    extend: {
      colors: {
        /* NADI institutional palette — UNDP-inspired, built around the NADI logo blue.
           One deep institutional blue, warm off-white & white grounds, soft greys and a muted blue.
           Older token names (forest / mustard / terracotta) are kept as ALIASES into this blue system
           so every component follows the same restrained palette. */
        ivory: '#F6EFE4', // warm off-white ground
        cream: '#EDE2D2', // soft grey surface
        sand: '#DECFBA', // grey rule / placeholder
        ink: '#2C2830', // body text
        navy: { DEFAULT: v('navy'), deep: v('navy-deep') }, // institutional dark sections (lifted slightly in dark mode)
        /* Theme-aware semantic tokens — values live in src/index.css (:root + prefers-color-scheme: dark) */
        page: v('page'), // page ground
        surface: v('surface'), // secondary ground
        paper: v('paper'), // raised surfaces: panels, cards
        tint: v('tint'), // pale brand-blue ground
        line: v('line'), // rules, placeholders
        fg: v('fg'), // body text
        heading: v('heading'), // headings on page grounds
        accent: v('accent'), // brand blue as text/accents on page grounds
        /* Festival accents — used selectively (event categories, frames, highlights). Same in both themes. */
        sun: '#F5B301',
        coral: '#EE5A3B',
        leaf: '#1E9E62',
        berry: '#C23B7A',
        sky: '#3F7290',
        blue: {
          DEFAULT: '#4C6A96', // primary — river blue at dusk, from the landing's water
          wave: '#3F7290', // river teal
          mist: '#A8B6CC', // dusk haze
          haze: '#F2E4D2', // warm paper tint
          deep: '#1C3557',
          night: '#14243A',
        },
        // aliases → blue system
        forest: { DEFAULT: '#2C4838', deep: '#1F3529', light: '#B9C8A6' },
        mustard: { DEFAULT: '#F2C9A0', light: '#F7DFC4' }, // light muted blue: CTAs & accents on dark grounds
        terracotta: { DEFAULT: '#B2583A', deep: '#8F4329' }, // eyebrows & accents on light grounds
        // Legacy tokens kept so pre-existing (unused) components still compile
        nadi: {
          deep: '#175B91', royal: '#216FA5', cream: '#FFFBEA', off: '#F8F7F1',
          sky: '#D8ECF5', navy: '#172E45', yellow: '#F3CE68', coral: '#EF8875',
          cyan: '#4FC8F0', mint: '#8DF0B0', orange: '#FF7A3D', pink: '#F59BD0', blue: '#2B3FD1',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { frame: '1440px' },
      transitionTimingFunction: { out: 'cubic-bezier(0.22, 1, 0.36, 1)', inout: 'cubic-bezier(0.76, 0, 0.24, 1)' },
    },
  },
  plugins: [],
}
