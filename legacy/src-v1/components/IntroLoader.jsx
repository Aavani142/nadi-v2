import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { criticalImages, logos } from '../data/nadi.js'
import { heroPreload } from './VideoHero.jsx'
import { prefersReducedMotion } from '../lib/intro.js'

/*  Opening loader — a clean counter, in the manner of event sites like Huddle Global.
    · deep NADI blue screen, the logo top-left, place top-right
    · a large 0 → 100 counter bottom-right that follows REAL loading (images + fonts),
      never faster than MIN_TIME so it always reads, never longer than MAX_TIME
    · a thin progress line along the bottom
    · on 100: the screen lifts away, followed by three festival-colour panels, uncovering the hero */
const MIN_TIME = 1.8
const MAX_TIME = 7
const LIFT = 0.9
const STAGGER = 0.11
const EASE = [0.76, 0, 0.24, 1]
const PANELS = ['#F5B301', '#E23E2A', '#0468B1'] // sun · coral · NADI blue (top → bottom of the stack)
const WORDS = ['Equity', 'Equality', 'Innovation']

function useRealProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let alive = true, done = 0
    const jobs = [...criticalImages.map((src) => ({ src })), ...heroPreload]
    const total = jobs.length + 1
    const tick = () => { done += 1; if (alive) setP(Math.min(done / total, 1)) }
    jobs.forEach(({ src, srcSet, sizes }) => {
      const i = new Image()
      i.onload = i.onerror = tick // a failed asset must never hold the page hostage
      if (srcSet) { i.sizes = sizes; i.srcset = srcSet }
      i.src = src
    })
    ;(document.fonts?.ready ?? Promise.resolve()).then(tick, tick)
    return () => { alive = false }
  }, [])
  return p
}

export default function IntroLoader({ onReveal, onDone }) {
  const reduce = useRef(prefersReducedMotion()).current
  const progress = useRealProgress()
  const real = useRef(0)
  real.current = progress
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)

  // The shown number eases towards min(real progress, time floor); a hard cap guarantees exit.
  useEffect(() => {
    const start = performance.now()
    const minT = reduce ? 0.3 : MIN_TIME
    let shown = 0, raf
    const frame = (now) => {
      const t = (now - start) / 1000
      const timeCap = Math.min(t / minT, 1) * 100
      const goal = t > MAX_TIME ? 100 : Math.min(real.current * 100, timeCap)
      shown += (goal - shown) * 0.12
      if (goal - shown < 0.4) shown = goal
      setCount(Math.floor(shown))
      if (shown >= 100) { setLeaving(true); return }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    // animation frames pause in background tabs: a plain timer guarantees the loader still leaves
    const safety = setTimeout(() => { cancelAnimationFrame(raf); setCount(100); setLeaving(true) }, (MAX_TIME + 1) * 1000)
    return () => { cancelAnimationFrame(raf); clearTimeout(safety) }
  }, [reduce])

  useEffect(() => {
    if (!leaving) return
    const hold = reduce ? 0 : 250 // let "100" register for a beat
    const total = reduce ? 450 : (LIFT + STAGGER * PANELS.length) * 1000
    const a = setTimeout(onReveal, hold + (reduce ? 0 : 350))
    const b = setTimeout(onDone, hold + total + 80)
    return () => { clearTimeout(a); clearTimeout(b) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving])

  const lift = (i) => (leaving
    ? { y: reduce ? 0 : '-101%', opacity: reduce ? 0 : 1, transition: { duration: reduce ? 0.45 : LIFT, delay: (reduce ? 0 : 0.25) + i * STAGGER, ease: EASE } }
    : { y: 0, opacity: 1 })

  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[100] overflow-hidden">
      <span className="sr-only">Loading NADI Foundation</span>

      {/* colour panels under the screen, lifted one after another */}
      {[...PANELS].reverse().map((c, k) => {
        const i = PANELS.length - k // sun lifts first after the screen
        return <motion.div key={c} aria-hidden="true" className="absolute inset-0" style={{ background: c }} initial={false} animate={lift(i)} />
      })}

      {/* the loader screen */}
      <motion.div className="absolute inset-0 flex flex-col bg-[#061D35] text-white" initial={false} animate={lift(0)}>
        <div className="flex items-start justify-between px-5 pt-6 sm:px-10 sm:pt-8">
          <motion.img src={logos.onDark} alt="NADI Foundation" className="h-12 w-auto sm:h-16"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} />
          <motion.p className="eyebrow pt-2 text-right text-white/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            Youth-driven nonprofit<br />Thiruvananthapuram, Kerala
          </motion.p>
        </div>

        <div className="mt-auto flex flex-col gap-6 px-5 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-10">
          <ul className="display text-[clamp(1.8rem,4.4vw,3.6rem)] leading-[0.95] text-white/90">
            {WORDS.map((w, i) => (
              <li key={w} className="overflow-hidden">
                <motion.span className="block" initial={{ y: reduce ? 0 : '105%' }} animate={{ y: '0%' }}
                  transition={{ duration: 0.8, delay: reduce ? 0 : 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                  {w}<span style={{ color: PANELS[i] === '#0468B1' ? '#5FB0EA' : PANELS[i] }}>.</span>
                </motion.span>
              </li>
            ))}
          </ul>
          <p aria-hidden="true" className="display tabular self-end text-[clamp(6rem,19vw,17rem)] leading-[0.78] tracking-[-0.05em]">
            {count}<span className="text-[0.32em] tracking-normal text-[#F5B301]">%</span>
          </p>
        </div>

        {/* progress line */}
        <div aria-hidden="true" className="h-[3px] w-full bg-white/10">
          <div className="h-full bg-[#F5B301]" style={{ width: `${count}%` }} />
        </div>
      </motion.div>
    </div>
  )
}
