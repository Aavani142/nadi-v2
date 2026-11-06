import { useEffect, useRef, useState } from 'react'
import { motion, animate, useMotionValue, useTransform } from 'framer-motion'
import Logo from './Logo.jsx'

/* ───────────────────────── timeline (seconds) ─────────────────────────
   0 → LOAD      river fills up, counter runs 0 → 100
   LOAD → ~3.3   the WAVE rushes in and floods the whole screen
   DRAIN → ~4.7  the water recedes downward, revealing the website
   (INTRO in lib/timing.js must stay ≈ DRAIN + 0.2)
──────────────────────────────────────────────────────────────────────── */
const LOAD = 2.3
const FLOOD = 0.8
const DRAIN = 3.4
const DRAIN_LEN = 1.0
const TOTAL = 4.75

// back → front. `up` delays the flood, `down` delays the drain.
const LAYERS = [
  { color: '#4FC8F0', load: 0.34, up: 0.0, down: 0.26, a1: 24, a2: 8, ph: 0, dur: 9, dir: 1 },
  { color: '#216FA5', load: 0.30, up: 0.1, down: 0.13, a1: 20, a2: 9, ph: 1.6, dur: 6.5, dir: -1 },
  { color: '#175B91', load: 0.26, up: 0.2, down: 0.0, a1: 17, a2: 7, ph: 3.1, dur: 4.5, dir: 1 },
]

const FLOW = [
  { y: 30, amp: 14, cycles: 2, dur: 16, dir: 1, o: 0.22 },
  { y: 70, amp: 18, cycles: 3, dur: 12, dir: -1, o: 0.15 },
  { y: 110, amp: 10, cycles: 4, dur: 9, dir: 1, o: 0.13 },
  { y: 150, amp: 22, cycles: 2, dur: 19, dir: -1, o: 0.2 },
  { y: 185, amp: 12, cycles: 3, dur: 13, dir: 1, o: 0.12 },
]

// Seamless sine paths (integer cycles per 1440 units, so a -50% slide loops perfectly)
const W = 2880
const CREST_H = 140
function crest(a1, a2, ph) {
  let line = ''
  for (let x = 0; x <= W; x += 20) {
    const y = 62 + a1 * Math.sin((x / 1440) * Math.PI * 4 + ph) + a2 * Math.sin((x / 1440) * Math.PI * 10 + ph * 2)
    line += `${x ? 'L' : 'M'}${x} ${y.toFixed(1)} `
  }
  return { line, fill: `${line}L${W} ${CREST_H} L0 ${CREST_H} Z` }
}
function flow(y, amp, cycles) {
  let d = ''
  for (let x = 0; x <= W; x += 30) d += `${x ? 'L' : 'M'}${x} ${(y + amp * Math.sin((x / 1440) * Math.PI * 2 * cycles)).toFixed(1)} `
  return d
}

function Layer({ cfg, level, hidden }) {
  const y = useTransform(level, (v) => hidden * (1 - v))
  const d = useRef(crest(cfg.a1, cfg.a2, cfg.ph)).current
  return (
    <motion.div aria-hidden="true" className="absolute inset-0 will-change-transform" style={{ y, background: cfg.color }}>
      <div className="absolute inset-x-0 overflow-hidden" style={{ bottom: 'calc(100% - 1px)', height: CREST_H }}>
        <motion.div className="h-full w-[200%]"
          animate={{ x: cfg.dir > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
          transition={{ duration: cfg.dur, ease: 'linear', repeat: Infinity }}>
          <svg viewBox={`0 0 ${W} ${CREST_H}`} preserveAspectRatio="none" className="block h-full w-full">
            <path d={d.fill} fill={cfg.color} />
            <path d={d.line} fill="none" stroke="#FFFBEA" strokeOpacity="0.35" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}

function FlowLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[10%] h-[220px] overflow-hidden"
      style={{ maskImage: 'linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)' }}>
      {FLOW.map((f, i) => (
        <motion.div key={i} className="absolute left-0 top-0 h-[220px] w-[200%]"
          animate={{ x: f.dir > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
          transition={{ duration: f.dur, ease: 'linear', repeat: Infinity }}>
          <svg viewBox={`0 0 ${W} 220`} preserveAspectRatio="none" className="block h-full w-full">
            <path d={flow(f.y, f.amp, f.cycles)} fill="none" stroke="#4FC8F0" strokeOpacity={f.o} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

function FullLoader({ onDone }) {
  const prog = useMotionValue(0)
  const count = useTransform(prog, (v) => Math.round(v))
  const fill = useTransform(prog, [0, 100], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const l0 = useMotionValue(0), l1 = useMotionValue(0), l2 = useMotionValue(0)
  const levels = [l0, l1, l2]
  const hidden = useRef((typeof window !== 'undefined' ? window.innerHeight : 900) + CREST_H + 20).current
  const [covered, setCovered] = useState(false)

  useEffect(() => {
    const ctrls = [animate(prog, 100, { duration: LOAD, ease: [0.45, 0, 0.25, 1] })]
    LAYERS.forEach((l, i) => {
      ctrls.push(animate(levels[i], [0, l.load, 1.03, 1.03, 0, 0], {
        duration: TOTAL,
        times: [0, (LOAD + l.up) / TOTAL, (LOAD + l.up + FLOOD) / TOTAL, (DRAIN + l.down) / TOTAL, (DRAIN + l.down + DRAIN_LEN) / TOTAL, 1],
        ease: [[0.4, 0, 0.4, 1], [0.5, 0, 0.2, 1], 'linear', [0.65, 0, 0.25, 1], 'linear'],
      }))
    })
    const t1 = setTimeout(() => setCovered(true), (LOAD + 0.2 + FLOOD) * 1000)
    const t2 = setTimeout(onDone, TOTAL * 1000)
    return () => { ctrls.forEach((c) => c.stop()); clearTimeout(t1); clearTimeout(t2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDone])

  return (
    <div role="status" aria-label="Loading NADI Foundation" className="fixed inset-0 z-[100] overflow-hidden text-cream">
      {/* night-river backdrop — disappears once the wave has fully covered it */}
      <div className="absolute inset-0 bg-ink" style={{ opacity: covered ? 0 : 1 }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 50% 40%, rgba(79,200,240,0.14), transparent 70%)' }} />
        <FlowLines />
      </div>

      {/* the water: three layered waves */}
      {LAYERS.map((cfg, i) => <Layer key={i} cfg={cfg} level={levels[i]} hidden={hidden} />)}

      {/* content sits above the water, fades as the wave retreats */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: covered ? 0 : 1 }}>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <p className="label text-cream/70">NADI Foundation</p>
          <p className="label tabular-nums text-cream/70"><motion.span>{count}</motion.span>%</p>
        </div>

        <div className="flex h-full flex-col items-center justify-center px-6 pb-28 text-center">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24">
            {[0, 0.8, 1.6].map((d) => (
              <motion.span key={d} aria-hidden="true" className="absolute inset-0 rounded-full border border-nadi-cyan"
                initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
                transition={{ duration: 2.4, delay: d, ease: 'easeOut', repeat: Infinity }} />
            ))}
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full rounded-full bg-cream p-2.5 shadow-[0_0_60px_rgba(79,200,240,0.35)]">
              <Logo className="h-full w-full" />
            </motion.div>
          </div>

          {/* NADI — outlined, then filled by the rising water */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-8 select-none font-display font-black uppercase leading-[0.9] tracking-[-0.04em] text-[length:clamp(5.5rem,24vw,14rem)]">
            <span className="block text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,251,234,0.35)' }}>NADI</span>
            <motion.span aria-hidden="true" className="absolute inset-0 block text-nadi-yellow" style={{ clipPath: fill }}>NADI</motion.span>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }} className="mt-5 font-serif text-lg italic text-cream/60">
            nadi <span className="not-italic text-cream/40">(n.)</span> — a river
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="label mt-3 text-cream/50">
            Equity · Equality · Innovation
          </motion.p>
        </div>
      </div>
    </div>
  )
}

// Respect "reduce motion": a simple fade instead of the wave
function ReducedLoader({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 700); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div role="status" aria-label="Loading NADI Foundation" className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
      <div className="h-20 w-20 rounded-full bg-cream p-2.5"><Logo className="h-full w-full" /></div>
    </motion.div>
  )
}

export default function Loader({ onDone }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  return reduce ? <ReducedLoader onDone={onDone} /> : <FullLoader onDone={onDone} />
}