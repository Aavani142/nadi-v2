import { useLayoutEffect, useRef, useState } from 'react'
import { initiatives } from '../data/nadi.js'
import { gsap, reducedMotion } from '../lib/gsap.js'
import { Img } from './ui.jsx'

/**
 * One animated motif per core area — each drawn from what the area actually is, never decoration.
 * All share a 400×400 stage with the area's photograph set in the middle, and each loop only runs
 * while its chapter is on screen (`active`).
 */

function useLoop(ref, active, build) {
  const tl = useRef(null)
  useLayoutEffect(() => {
    if (reducedMotion() || !ref.current) return
    const ctx = gsap.context(() => { tl.current = build() }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useLayoutEffect(() => {
    if (!tl.current) return
    active ? tl.current.play() : tl.current.pause()
  }, [active])
}

/* ── Mental health: a breathing guide. Rings expand for four seconds, settle for four. ── */
export function BreathMotif({ photo, color, active }) {
  const ref = useRef(null)
  const [phase, setPhase] = useState('Breathe in')
  useLoop(ref, active, () => {
    const t = gsap.timeline({ repeat: -1, paused: true })
    t.call(() => setPhase('Breathe in'))
      .to('.br-ring', { scale: 1.08, svgOrigin: '200 200', opacity: (i) => [0.75, 0.45, 0.25][i], duration: 4, ease: 'sine.inOut', stagger: 0.18 })
      .to('.br-photo', { scale: 1.035, duration: 4, ease: 'sine.inOut' }, '<')
      .call(() => setPhase('Breathe out'))
      .to('.br-ring', { scale: 0.9, svgOrigin: '200 200', opacity: (i) => [0.4, 0.22, 0.1][i], duration: 4, ease: 'sine.inOut', stagger: 0.18 })
      .to('.br-photo', { scale: 1, duration: 4, ease: 'sine.inOut' }, '<')
    gsap.to('.br-orbit', { rotation: 360, duration: 24, ease: 'none', repeat: -1, svgOrigin: '200 200' })
    return t
  })
  return (
    <div ref={ref} className="relative aspect-square w-full">
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
        {[128, 158, 188].map((r, i) => (
          <circle key={r} className="br-ring" cx="200" cy="200" r={r} fill="none" stroke={color} strokeWidth={[2, 1.5, 1][i]}
            opacity={[0.6, 0.35, 0.18][i]} />
        ))}
        {/* a single point travelling the outer ring — the pace of the breath */}
        <g className="br-orbit"><circle cx="200" cy="12" r="5" fill={color} /></g>
      </svg>
      <div className="br-photo absolute inset-[22%] overflow-hidden rounded-full ring-1 ring-white/20">
        <Img photo={photo} sizes="(min-width:1024px) 22vw, 50vw" />
      </div>
      <p aria-live="off" className="absolute inset-x-0 -bottom-1 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color }}>{phase}</p>
    </div>
  )
}

/* ── Education: Prabodhini's documented learning path (Annual Report p13), drawn step by step. ── */
const STEPS = initiatives.prabodhini.flow
// an arch over the photograph — the climb from the first step to the last
const NODES = [[70, 340], [52, 200], [200, 42], [348, 200], [330, 340]]
const PATH = 'M70 340 C 40 290, 40 240, 52 200 C 70 110, 130 50, 200 42 C 270 50, 330 110, 348 200 C 360 240, 360 290, 330 340'
export function PathMotif({ photo, color, active }) {
  const ref = useRef(null)
  const [step, setStep] = useState(0)
  useLoop(ref, active, () => {
    const t = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true })
    t.set('.lp-node', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box' })
      .set('.lp-line', { drawSVG: '0%' })
      .call(() => setStep(0))
    // reveal path segment by segment, lighting each step as the line reaches it
    const nodes = gsap.utils.toArray('.lp-node')
    t.to(nodes[0], { scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, 0.1)
    STEPS.forEach((_, i) => {
      if (i === 0) return
      t.to('.lp-line', { drawSVG: `${(i / (STEPS.length - 1)) * 100}%`, duration: 1.1, ease: 'power2.inOut' }, '+=0.7')
        .to(nodes[i], { scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, '-=0.15')
        .call(() => setStep(i), null, '<')
    })
    t.to({}, { duration: 1.6 }).to(['.lp-line', '.lp-node'], { opacity: 0, duration: 0.5 }).set(['.lp-line', '.lp-node'], { opacity: 1 })
    return t
  })
  return (
    <div ref={ref} className="relative aspect-square w-full">
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={PATH} fill="none" stroke={color} strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
        <path className="lp-line" d={PATH} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {NODES.map(([x, y], i) => (
          <g key={i} className="lp-node">
            <circle cx={x} cy={y} r="13" fill="#0E2A24" stroke={color} strokeWidth="2" />
            <text x={x} y={y + 4} textAnchor="middle" fill={color} style={{ font: '600 11px "IBM Plex Mono", monospace' }}>{i + 1}</text>
          </g>
        ))}
      </svg>
      {/* the photo in a tall arch — a page, a doorway */}
      <div className="absolute inset-x-[27%] bottom-[14%] top-[22%] overflow-hidden rounded-t-full ring-1 ring-white/20">
        <Img photo={photo} sizes="(min-width:1024px) 18vw, 40vw" />
      </div>
      <p className="absolute inset-x-0 -bottom-1 text-center font-mono text-[11px] uppercase tracking-[0.24em]" style={{ color }}>
        Step {step + 1} · {STEPS[step]}
      </p>
    </div>
  )
}

/* ── Community: scattered points gather into one circle, then link up — collective action. ── */
const N_DOTS = 22
const SCATTER = Array.from({ length: N_DOTS }, (_, i) => {
  // deterministic scatter (no randomness between renders)
  const a = i * 2.39996, r = 60 + ((i * 53) % 140)
  return [200 + Math.cos(a) * r * 1.2, 200 + Math.sin(a) * r]
})
const RING = Array.from({ length: N_DOTS }, (_, i) => {
  const a = (i / N_DOTS) * Math.PI * 2 - Math.PI / 2
  return [200 + Math.cos(a) * 168, 200 + Math.sin(a) * 168]
})
const RING_PATH = RING.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z'
export function GatherMotif({ photo, color, active }) {
  const ref = useRef(null)
  const [label, setLabel] = useState('Apart')
  useLoop(ref, active, () => {
    const dots = gsap.utils.toArray('.cg-dot')
    const t = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true })
    t.set(dots, { attr: { cx: (i) => SCATTER[i][0], cy: (i) => SCATTER[i][1] }, opacity: 0.55 })
      .set('.cg-link', { drawSVG: '0%' })
      .call(() => setLabel('Apart'))
      .to(dots, { attr: { cx: (i) => RING[i][0], cy: (i) => RING[i][1] }, opacity: 1, duration: 1.8, ease: 'expo.inOut', stagger: { each: 0.04, from: 'random' } }, 0.8)
      .call(() => setLabel('Together'), null, '-=0.3')
      .to('.cg-link', { drawSVG: '100%', duration: 1.4, ease: 'power2.inOut' }, '-=0.2')
      .to({}, { duration: 2.4 })
      .to('.cg-link', { drawSVG: '100% 100%', duration: 0.8, ease: 'power2.in' })
      .to(dots, { attr: { cx: (i) => SCATTER[i][0], cy: (i) => SCATTER[i][1] }, opacity: 0.55, duration: 1.4, ease: 'expo.inOut', stagger: { each: 0.03, from: 'random' } }, '<0.2')
    gsap.to('.cg-spin', { rotation: 360, duration: 60, ease: 'none', repeat: -1, svgOrigin: '200 200' })
    return t
  })
  return (
    <div ref={ref} className="relative aspect-square w-full">
      <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
        <g className="cg-spin">
          <path className="cg-link" d={RING_PATH} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.7" />
          {RING.map(([x, y], i) => <circle key={i} className="cg-dot" cx={x} cy={y} r={i % 4 === 0 ? 7 : 5} fill={color} />)}
        </g>
      </svg>
      <div className="absolute inset-[25%] overflow-hidden rounded-full ring-1 ring-white/20">
        <Img photo={photo} sizes="(min-width:1024px) 20vw, 46vw" />
      </div>
      <p className="absolute inset-x-0 -bottom-1 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color }}>{label}</p>
    </div>
  )
}
