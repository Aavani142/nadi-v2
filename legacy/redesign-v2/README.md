# NADI Foundation — website

React (Vite) · Tailwind CSS · GSAP + ScrollTrigger · Framer Motion · Lenis · Lucide

```
npm install
npm run dev      # local development
npm run build    # production build → dist/
```

## Design system

| | |
|---|---|
| Colours | `ink` #0B1020 · `paper` #F3F0E9 · `river` #2152FF (NADI blue) · `ember` #FF5A2C (Donate and highlights only). Defined in `tailwind.config.js`; nothing else is used. |
| Type | Archivo, condensed 800 for display (`.display`) · Instrument Serif italic for single accent phrases (`.italic-serif`) · JetBrains Mono for labels (`.kicker`) |
| Motion | GSAP/ScrollTrigger for scroll-linked work (pins, scrubs, reveals) through `useGsap` in `src/lib/motion.js`. Framer Motion for interaction (hover, menus, accordions, page curtain). Lenis smooth scroll runs on GSAP's ticker. With `prefers-reduced-motion`, GSAP code is skipped, Lenis is off, and every element renders in its final state. |

## Structure

| Path | What it holds |
|---|---|
| `src/pages/Home.jsx` | Hero → Film → About → Our Work → Impact → Stories → News → Team → Network → Donate call to action |
| `src/pages/Donate.jsx` | `/donate`: where gifts go, how to give, the ₹100 Challenge, other ways to help |
| `src/sections/` | One file per homepage section |
| `src/components/` | Navbar, Footer, and UI primitives (`Button`, `Img`, `SplitWords`, …) |
| `src/data/nadi.js` | Navigation, organisation facts, initiatives, impact figures, stories, contact, **donation settings** |
| `src/data/events.js` | News items (shaped for a later Supabase swap) |
| `src/data/network.js` | Collaborators from the Annual Report |
| `legacy/src-v1/` | The previous site's source, kept as a backup. Not built; safe to delete. |

## Online donations

No payment link exists yet, so the Donate page asks donors to email or call. When NADI has a payment page
(Razorpay, Instamojo, a UPI ID, …), set `donation.url` and/or `donation.upi` in `src/data/nadi.js` and the
Donate page shows a "Give online" button and the UPI ID automatically.

## Content rules

Every fact, figure and caption comes from the NADI Annual Report 2025–2026, the official pamphlet or
NADI's public Instagram posts. Figures are shown in the context they were reported in and never combined.
Do not add people, testimonials, partners or numbers without a source.
