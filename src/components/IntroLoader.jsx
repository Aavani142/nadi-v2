import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { criticalImages, logos } from '../data/nadi.js'
import { heroPreload } from './VideoHero.jsx'
import { gsap, reducedMotion } from '../lib/gsap.js'
import LogoMotion from './LogoMotion.jsx'

/*  Opening loader — in the format of Huddle Global's: a deep navy field with a soft central glow,
    layered waves along the bottom, the logo centred, a slim progress bar and a spaced tagline.
    NADI's version: the logo assembles itself from its layers (river, sun, wordmark), the waves are
    NADI's river in three blues, and the loader dissolves into the hero.
    Real loading: logo layers + first hero photographs + fonts. Never shorter than MIN_TIME (so the
    logo finishes assembling), never longer than MAX_TIME; failed assets count as done. */
const MIN_TIME = 2.4
const MAX_TIME = 6
const WAVE_W = 1440

function wavePath(h, amp, cycles, phase) {
  let d = `M0 ${h}`
  for (let x = 0; x <= WAVE_W * 2; x += 16) {
    d += ` L${x} ${(amp + amp * Math.sin((x / WAVE_W) * Math.PI * 2 * cycles + phase)).toFixed(1)}`
  }
  return `${d} L${WAVE_W * 2} ${h} Z`
}
// back → front: [height px, amplitude, cycles, phase, colour, drift seconds]
const WAVES = [
  [150, 34, 1, 0.4, '#0B3C68', 26],
  [118, 26, 1, 2.2, '#0D4A80', 19],
  [84, 18, 1, 1.1, '#1A5E98', 14],
]

function useRealProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let alive = true, done = 0
    const jobs = [...criticalImages.map((src) => ({ src })), logos.wave1, logos.wave2, logos.sun, logos.wordmarkOnDark].map((j) => (typeof j === 'string' ? { src: j } : j)).concat(heroPreload)
    const total = jobs.length + 1
    const tick = () => { done += 1; if (alive) setP(Math.min(done / total, 1)) }
    jobs.forEach(({ src, srcSet, sizes }) => {
      const i = new Image()
      i.onload = i.onerror = tick
      if (srcSet) { i.sizes = sizes; i.srcset = srcSet }
      i.src = src
    })
    ;(document.fonts?.ready ?? Promise.resolve()).then(tick, tick)
    return () => { alive = false }
  }, [])
  return p
}

export default function IntroLoader({ onReveal, onDone }) {
  const root = useRef(null)
  const barRef = useRef(null)
  const progress = useRealProgress()
  const prog = useRef(0)
  prog.current = progress
  const finished = useRef({ reveal: false, done: false })
  const reveal = () => { if (!finished.current.reveal) { finished.current.reveal = true; onReveal() } }
  const done = () => { reveal(); if (!finished.current.done) { finished.current.done = true; onDone() } }

  useLayoutEffect(() => {
    const reduce = reducedMotion()
    let leaving = false
    const ctx = gsap.context(() => {
      const start = performance.now()
      const shown = { v: 0 }
      if (!reduce) {
        gsap.from('.ld-glow', { opacity: 0, scale: 0.8, duration: 1.6, ease: 'power2.out' })
        gsap.from('.ld-wave', { yPercent: 100, duration: 1.6, stagger: 0.12, ease: 'expo.out' })
        gsap.utils.toArray('.ld-drift').forEach((el, i) => gsap.to(el, { xPercent: -50, duration: WAVES[i][5], ease: 'none', repeat: -1 }))
        gsap.from('.ld-bar', { scaleX: 0, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.9 })
        gsap.from('.ld-tag', { opacity: 0, y: 8, letterSpacing: '0.6em', duration: 1.4, ease: 'expo.out', delay: 1.3 })
      }
      const leave = () => {
        if (leaving) return
        leaving = true
        gsap.ticker.remove(tick)
        if (reduce) { gsap.to(root.current, { opacity: 0, duration: 0.4, onStart: reveal, onComplete: done }); return }
        gsap.timeline({ onComplete: done })
          .to('.ld-center', { scale: 1.06, opacity: 0, duration: 0.7, ease: 'power2.in' })
          .to('.ld-wave', { yPercent: 100, duration: 0.9, stagger: -0.08, ease: 'expo.in' }, 0)
          .add(reveal, 0.45)
          .to(root.current, { opacity: 0, duration: 0.6, ease: 'power1.out' }, 0.55)
      }
      function tick() {
        const t = (performance.now() - start) / 1000
        const goal = t > MAX_TIME ? 1 : Math.min(prog.current, t / (reduce ? 0.3 : MIN_TIME))
        shown.v += (goal - shown.v) * 0.1
        if (goal - shown.v < 0.004) shown.v = goal
        if (barRef.current) barRef.current.style.transform = `scaleX(${shown.v})`
        if (shown.v >= 1 && (t > MIN_TIME + 0.2 || reduce)) leave()
      }
      gsap.ticker.add(tick)
    }, root)
    const safety = setTimeout(done, (MAX_TIME + 4) * 1000) // frames pause in background tabs
    return () => { clearTimeout(safety); ctx.revert() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={root} role="status" aria-live="polite" className="fixed inset-0 z-[100] overflow-hidden" style={{ background: '#061A30' }}>
      <span className="sr-only">Loading NADI Foundation</span>
      <div aria-hidden="true" className="ld-glow absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 50% 42%, #10345C 0%, rgba(16,52,92,0.45) 45%, rgba(6,26,48,0) 75%)' }} />

      {/* the river, in three layers along the bottom */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[150px] sm:h-[170px]">
        {WAVES.map(([h, amp, cycles, phase, color], i) => (
          <div key={i} className="ld-wave absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: h }}>
            <div className="ld-drift h-full w-[200%]">
              <svg viewBox={`0 0 ${WAVE_W * 2} ${h}`} preserveAspectRatio="none" className="block h-full w-full">
                <path d={wavePath(h, amp, cycles * 2, phase)} fill={color} />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="ld-center relative flex h-full flex-col items-center justify-center px-6 pb-[12vh]">
        <LogoMotion variant="dark" idle={false} delay={0.25} className="w-[min(72vw,380px)]" />
        <div className="ld-bar mt-10 h-[3px] w-[min(56vw,240px)] overflow-hidden rounded-full bg-white/15">
          <div ref={barRef} className="h-full origin-left rounded-full bg-[#78BAEC]" style={{ transform: 'scaleX(0)' }} />
        </div>
        <p className="ld-tag mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75">
          Equity · Equality · Innovation
        </p>
      </div>
    </div>
  )
}
