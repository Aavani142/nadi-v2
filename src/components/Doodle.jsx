import { useRef } from 'react'
import { gsap, useGsap } from '../lib/gsap.js'

/**
 * Hand-drawn marks in the manner of Mozilla Foundation's editorial doodles — single marker strokes,
 * slightly imperfect, in the section's own accent colour (currentColor). They draw themselves in
 * (GSAP DrawSVG) when they scroll into view. Deliberately limited to marks an editor would make on a
 * page: underline, loose circle, arrow, a river squiggle, and NADI's double wave.
 * No stars, suns or decorative objects.
 */
const SHAPES = {
  // marker underline with a small return flick
  underline: { vb: '0 0 300 24', d: ['M4 15 C 60 7, 120 9, 180 11 S 270 13, 296 8', 'M60 20 C 120 15, 190 15, 250 17'], w: [3, 2] },
  // loose, unclosed ellipse — the stroke overshoots where it started, like a pen circle
  circle: { vb: '0 0 220 90', d: ['M58 10 C 120 0, 200 6, 212 34 C 224 64, 160 84, 100 82 C 40 80, 6 66, 8 44 C 10 22, 50 10, 96 8 C 120 7, 140 8, 156 11'], w: [2.5] },
  // curved arrow with an open head
  arrow: { vb: '0 0 140 70', d: ['M6 58 C 30 20, 70 8, 120 22', 'M104 10 L 122 22 L 104 34'], w: [2.5, 2.5] },
  // a river line
  squiggle: { vb: '0 0 300 30', d: ['M3 18 C 25 4, 45 30, 70 16 S 115 4, 140 16 S 185 30, 210 16 S 255 4, 297 14'], w: [2.5] },
  // NADI's two logo waves, as strokes — the highlight under the name
  waves: { vb: '0 0 600 60', d: ['M6 26 C 90 6, 170 6, 250 24 S 420 46, 594 16', 'M70 48 C 150 34, 230 34, 300 44 S 450 56, 540 40'], w: [7, 4] },
}

/** A standalone doodle; position it with className. */
export function Doodle({ kind = 'underline', className = '', delay = 0.4, duration = 1, trigger = 'scroll', play = true, style }) {
  const ref = useRef(null)
  const s = SHAPES[kind]
  useGsap(ref, () => {
    const paths = ref.current.querySelectorAll('path')
    const tween = { drawSVG: '100%', duration, stagger: 0.25, ease: 'power2.inOut', delay }
    if (trigger === 'scroll') tween.scrollTrigger = { trigger: ref.current, start: 'top 88%', once: true }
    else tween.paused = !play
    const t = gsap.fromTo(paths, { drawSVG: '0%' }, tween)
    if (trigger !== 'scroll' && play) t.play()
  }, [play])
  return (
    <svg ref={ref} aria-hidden="true" viewBox={s.vb} preserveAspectRatio="none" fill="none"
      className={`pointer-events-none overflow-visible ${className}`} style={style}>
      {s.d.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth={s.w[i] ?? 2.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

const PLACE = {
  underline: { left: '-2%', width: '104%', bottom: '-0.2em', height: '0.32em' },
  squiggle: { left: '0', width: '100%', bottom: '-0.28em', height: '0.3em' },
  circle: { left: '-12%', width: '124%', top: '-24%', height: '150%' },
}

/** Wraps a word or phrase and marks it. Keep the wrapper outside any overflow-hidden text mask. */
export function Doodled({ kind = 'underline', children, className = '', delay, color = '' }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <Doodle kind={kind} delay={delay} className={`absolute ${color}`} style={PLACE[kind]} />
    </span>
  )
}
