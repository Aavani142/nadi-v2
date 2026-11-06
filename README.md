# NADI Foundation — Homepage

React (Vite) · JavaScript · Tailwind CSS · Framer Motion · Lenis · Lucide

```
npm install
npm run dev      # local development
npm run build    # production build → dist/
```

## Structure

| Path | What it holds |
|---|---|
| `src/data/nadi.js` | Navigation, verified organisational content, initiatives, impact figures, stories, contact, CTAs, hero video config |
| `src/data/sdg.js` | All 17 UN SDGs (official names, colours, statements, icons) and NADI's documented goal mappings |
| `src/data/network.js` | Collaborators transcribed from the Annual Report, and Research content |
| `src/components/IntroLoader.jsx` | Opening sequence (uses `AnimatedWave`, `AnimatedLogo`); plays once per browser session |
| `src/components/VideoHero.jsx` | Hero: NADI video when supplied, otherwise a photo film of report photographs |
| `src/components/sdg/` | `SDGExperience` → `SDGWheel`, `SDGDetails`, `SDGProjectShowcase` |
| `src/components/*Section.jsx` | Homepage sections, in navigation order |
| `public/assets/img/` | Optimised photographs (WebP, with `-sm` variants for mobile) from the Annual Report and pamphlet |
| `public/assets/logos/` | Official NADI logo (and its mark/wordmark layers), project logos |
| `public/assets/sdg/` | Official SDG icons (via Wikimedia Commons) |
| `public/assets/video/` | Empty video slot — see the README inside for the footage specification |

## Navigation and pages

Home · About · Our Work · Our Network · Research · Stories · Gallery · Team · **Donate** (defined in
`src/data/nadi.js → nav`). About (`/about`) and Donate (`/donate`) are real pages; the others scroll to
homepage sections and route home first when clicked from another page.

## Content NADI still needs to supply

| What | Where to add it |
|---|---|
| Official donation link / UPI ID | `src/data/nadi.js → donation` — the Donate page then shows "Donate online" automatically |
| Annual report PDFs | `src/data/reports.js → REPORTS` (shape documented in the file); PDFs in `public/assets/reports/` |
| Full approved Director's Message | About page, `#director` — currently shows verbatim excerpts plus a labelled placeholder |
| Research publications | `src/data/network.js → research.publications` |
| Hero video | `src/data/nadi.js → heroVideo` (spec in `public/assets/video/README.md`) |

## Animation

GSAP + ScrollTrigger for the loader, hero, core areas, Director's message, team, About and Donate pages
(`src/lib/gsap.js → useGsap`, scoped with `gsap.context()` and reverted on unmount; skipped entirely with
reduced motion). Lenis smooth scroll feeds ScrollTrigger. Framer Motion handles interactions, menus,
the SDG wheel and remaining section reveals.

## Content rules

Every fact, figure and caption comes from the NADI Annual Report 2025–2026 or the official pamphlet
(sources are noted in the data files). Statistics are kept in their reporting context and never
combined. Do not add people, testimonials, partners or numbers without a source.

## Legacy files

Components from the previous homepage (`Hero.jsx`, `Loader.jsx`, `Projects.jsx`, `WhoWeAre.jsx`,
`WorkingAreas.jsx`, `Impact.jsx`, `DirectorMessage.jsx`, `VolunteerCTA.jsx`, `Marquee.jsx`,
`HeroSection.jsx`, etc.) and `data/content.js` are no longer used by the homepage. They are kept
untouched; `/sdgs` (an older page) still uses some of them.
