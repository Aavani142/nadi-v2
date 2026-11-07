import { useRef } from 'react'
import { gsap, useGsap } from '../lib/gsap.js'
import { ridge } from './PaperSeam.jsx'

/**
 * The landing's world, quietly, behind each section: three layers of cut-paper hills along the lower
 * edge, a shade or two off the section's own ground, rising at different speeds as the section scrolls
 * in — the same layered parallax as the landing. Dark sections also carry the landing's sunset glow.
 *
 * Sits behind the content (the section is an isolated stacking context; see index.css), so it never
 * covers text. Moves only with transforms, so the paper filter renders once.
 */
const TONES = {
  light: { layers: ['#E7D8C2', '#EADDCA', '#EFE4D5'], opacity: [0.75, 0.8, 0.9] },
  dark: { layers: ['#FFFFFF', '#FFFFFF', '#FFFFFF'], opacity: [0.05, 0.07, 0.09] },
}

export default function PaperBackdrop({ tone = 'light', seed = 1 }) {
  const ref = useRef(null)
  const t = TONES[tone]
  const hills = [ridge(seed + 3, 4, 46), ridge(seed + 11, 30, 70), ridge(seed + 19, 56, 92)]
  useGsap(ref, () => {
    const st = { trigger: ref.current, start: 'top bottom', end: 'bottom 60%', scrub: 0.8 }
    gsap.utils.toArray('.pb-layer', ref.current).forEach((el, i) =>
      gsap.fromTo(el, { yPercent: 46 - i * 12 }, { yPercent: 0, ease: 'none', scrollTrigger: st }))
  })
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {tone === 'dark' && (
        // the landing's sun, low and soft, behind the hills
        <div className="absolute -right-[12%] bottom-[-30%] h-[80%] w-[60%] rounded-full opacity-60"
          style={{ background: 'radial-gradient(closest-side, rgba(242,166,90,.38), rgba(242,166,90,.12) 55%, rgba(242,166,90,0))' }} />
      )}
      <div className="absolute inset-x-0 bottom-0 h-[clamp(110px,17vw,250px)]">
        {hills.map((h, i) => (
          <svg key={i} viewBox="0 0 1600 110" preserveAspectRatio="none" className="pb-layer absolute inset-0 h-full w-full will-change-transform">
            <path d={h.d} fill={t.layers[i]} opacity={t.opacity[i]} filter="url(#seam-paper)" />
          </svg>
        ))}
      </div>
    </div>
  )
}
