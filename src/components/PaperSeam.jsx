import { useRef } from 'react'
import { gsap, useGsap } from '../lib/gsap.js'

/**
 * A cut-paper ridgeline between two homepage sections — the landing's layered hills, carried down the
 * page. The section below rises over the one above as torn-paper hills (a fainter ridge behind, the
 * solid one in front), with fibre grain and a soft shadow cast upward. Some seams carry a palm.
 *
 * It lives *between* sections (most of them clip their overflow), as a zero-height row whose drawing
 * hangs upward over the bottom padding of the section above.
 */

/** Gentle hills from a seed: a few slow sines, so every seam has its own skyline. */
export function ridge(seed, lo, hi) {
  const n = 48, pts = []
  for (let i = 0; i <= n; i++) {
    const x = (1600 * i) / n
    const t = x / 1600
    const v = 0.5 + 0.28 * Math.sin(t * 6.3 * (1 + (seed % 3) * 0.35) + seed) + 0.16 * Math.sin(t * 15.7 + seed * 2.1) + 0.06 * Math.sin(t * 41 + seed)
    pts.push([x, lo + (hi - lo) * (1 - v)])
  }
  let d = `M-60 110 L-60 ${pts[0][1].toFixed(1)} L${pts[0][0]} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]
    d += ` Q${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`
  }
  return { d: `${d} L1600 ${pts.at(-1)[1].toFixed(1)} L1660 ${pts.at(-1)[1].toFixed(1)} L1660 110 Z`, at: (x) => pts[Math.round((x / 1600) * n)][1] }
}

/** One shared filter for every seam (cut edge and upward shadow — the site-wide grain supplies the fibre). Render once on the page. */
export function SeamDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="seam-paper" x="-2%" y="-60%" width="104%" height="180%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="torn" />
        <feDropShadow in="torn" dx="0" dy="-3" stdDeviation="4" floodColor="#1c140c" floodOpacity="0.18" />
      </filter>
    </svg>
  )
}

/**
 * @param to    colour of the section below (the paper that rises)
 * @param seed  varies the skyline
 *
 * As the seam scrolls into view its two ridges rise into place at different speeds — the back one
 * slower, the front one further — like the landing's hills, at every section boundary.
 */
export default function PaperSeam({ to, seed = 1 }) {
  const ref = useRef(null)
  const back = ridge(seed + 7, 6, 40), front = ridge(seed, 26, 58)
  useGsap(ref, () => {
    const st = { trigger: ref.current, start: 'top bottom', end: 'top 55%', scrub: 0.6 }
    gsap.fromTo(ref.current.querySelector('.seam-back'), { yPercent: 38 }, { yPercent: 0, ease: 'none', scrollTrigger: st })
    gsap.fromTo(ref.current.querySelector('.seam-front'), { yPercent: 70 }, { yPercent: 0, ease: 'none', scrollTrigger: st })
  })
  // each ridge is its own <svg>, so moving it is a plain composited transform — the paper filter never re-runs
  const layer = (cls, d, opacity) => (
    <svg viewBox="0 0 1600 80" preserveAspectRatio="none" className={`${cls} absolute inset-x-0 -bottom-[3px] h-[clamp(34px,4.6vw,72px)] w-full overflow-visible will-change-transform`}>
      <clipPath id={`${cls}-clip-${seed}`}><rect x="-200" y="-200" width="2000" height="280" /></clipPath>
      <g clipPath={`url(#${cls}-clip-${seed})`}><path d={d} fill={to} opacity={opacity} filter="url(#seam-paper)" /></g>
    </svg>
  )
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none relative z-20 h-0">
      {layer('seam-back', back.d, 0.5)}
      {layer('seam-front', front.d, 1)}
    </div>
  )
}
