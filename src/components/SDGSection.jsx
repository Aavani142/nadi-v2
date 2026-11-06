import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead.jsx'
import { SplitWords } from '../lib/Motion.jsx'
import { projects } from '../data/content.js'

// All 17 goals, official UN colours + names (index 0 = goal 1)
const GOALS = [
  ['No Poverty', '#E5243B'], ['Zero Hunger', '#DDA63A'], ['Good Health and Well-being', '#4C9F38'],
  ['Quality Education', '#C5192D'], ['Gender Equality', '#FF3A21'], ['Clean Water and Sanitation', '#26BDE2'],
  ['Affordable and Clean Energy', '#FCC30B'], ['Decent Work and Economic Growth', '#A21942'],
  ['Industry, Innovation and Infrastructure', '#FD6925'], ['Reduced Inequalities', '#DD1367'],
  ['Sustainable Cities and Communities', '#FD9D24'], ['Responsible Consumption and Production', '#BF8B2E'],
  ['Climate Action', '#3F7E44'], ['Life Below Water', '#0A97D9'], ['Life on Land', '#56C02B'],
  ['Peace, Justice and Strong Institutions', '#00689D'], ['Partnerships for the Goals', '#19486A'],
]

const N = GOALS.length, STEP = 360 / N, CX = 500, CY = 500, RO = 480, RI = 270, GAP = 0.5, DWELL = 6000
const ease = [0.2, 0.7, 0.2, 1]
const rad = (d) => (d * Math.PI) / 180
const pt = (r, deg) => [CX + r * Math.cos(rad(deg)), CY + r * Math.sin(rad(deg))]
function arc(a0, a1) {
  const [x1, y1] = pt(RO, a0), [x2, y2] = pt(RO, a1), [x3, y3] = pt(RI, a1), [x4, y4] = pt(RI, a0)
  return `M${x1} ${y1}A${RO} ${RO} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${RI} ${RI} 0 0 0 ${x4} ${y4}Z`
}
const rotFor = (g) => -((g - 1) + 0.5) * STEP // brings goal g to 12 o'clock

const card = {
  hidden: { opacity: 0, y: 56, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 130, damping: 20, staggerChildren: 0.07, delayChildren: 0.15 } },
  exit: { opacity: 0, y: -36, scale: 0.97, transition: { duration: 0.25 } },
}
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } } }

export default function SDGSection() {
  const ours = useMemo(() => [...new Set(projects.flatMap((p) => p.sdgs))].sort((a, b) => a - b), [])
  const [sel, setSel] = useState(ours[0])
  const [rot, setRot] = useState(rotFor(ours[0]))
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.35 })
  const reduce = useReducedMotion()

  const go = useCallback((g) => {
    const target = rotFor(g)
    setRot((cur) => cur + ((target - cur + 540) % 360) - 180) // shortest way round
    setSel(g)
  }, [])

  useEffect(() => {
    if (!inView || paused || reduce) return
    const t = setTimeout(() => go(ours[(ours.indexOf(sel) + 1) % ours.length]), DWELL)
    return () => clearTimeout(t)
  }, [sel, inView, paused, reduce, go, ours])

  const [name, color] = GOALS[sel - 1]
  const linked = projects.filter((p) => p.sdgs.includes(sel))
  const idx = ours.indexOf(sel)
  const hover = (v) => (e) => { if (e.pointerType !== 'touch') setPaused(v) }

  return (
    <section ref={ref} id="sdgs" className="overflow-hidden bg-cream px-4 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHead label="Sustainable Development Goals" />
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <SplitWords text="Goals we report under" className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:col-span-8" />
          <p className="text-lg text-ink/70 lg:col-span-3 lg:col-start-10">NADI’s initiatives contribute to these United Nations Sustainable Development Goals.</p>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12" onPointerEnter={hover(true)} onPointerLeave={hover(false)}>
          {/* HALF WHEEL */}
          <div className="relative mx-auto w-full max-w-[760px] pt-5 lg:col-span-7">
            <span aria-hidden="true" className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-[8px] border-t-[11px] border-x-transparent border-t-ink" />
            <div className="relative aspect-[2/1] overflow-hidden">
              <motion.div className="absolute inset-x-0 top-0 aspect-square" initial={{ rotate: rot + 80, opacity: 0 }} animate={{ rotate: rot, opacity: 1 }}
                transition={{ rotate: { type: 'spring', stiffness: 38, damping: 15, mass: 1.2 }, opacity: { duration: 0.8 } }}>
                <svg viewBox="-20 -20 1040 1040" className="h-full w-full" role="group" aria-label="Sustainable Development Goals wheel">
                  {GOALS.map(([gName, gColor], i) => {
                    const g = i + 1, mine = ours.includes(g), on = sel === g
                    const a0 = -90 + i * STEP + GAP, a1 = -90 + (i + 1) * STEP - GAP, mid = -90 + (i + 0.5) * STEP
                    const [tx, ty] = pt((RO + RI) / 2, mid)
                    const props = mine ? { role: 'button', tabIndex: 0, 'aria-pressed': on, 'aria-label': `SDG ${g}: ${gName}`, 'data-cursor': true,
                      onClick: () => go(g), onFocus: () => go(g), onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(g) } } } : { 'aria-hidden': true }
                    return (
                      <motion.g key={g} {...props} style={{ cursor: mine ? 'pointer' : 'default', outline: 'none' }}
                        animate={{ x: on ? Math.cos(rad(mid)) * 18 : 0, y: on ? Math.sin(rad(mid)) * 18 : 0, opacity: mine ? 1 : 0.3 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }}>
                        <path d={arc(a0, a1)} fill={gColor} />
                        <text x={tx} y={ty} transform={`rotate(${mid + 90} ${tx} ${ty})`} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="60" fontWeight="800" className="font-display select-none" style={{ letterSpacing: '-0.04em' }}>{g}</text>
                      </motion.g>
                    )
                  })}
                </svg>
              </motion.div>

              {/* hub */}
              <div className="pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center pb-2 text-center sm:pb-5">
                <span className="label text-[9px] text-ink/50 sm:text-[11px]">Goal</span>
                <AnimatePresence mode="wait">
                  <motion.span key={sel} initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -28, opacity: 0 }} transition={{ duration: 0.3, ease }}
                    className="font-display text-[clamp(2.4rem,9vw,5.6rem)] font-extrabold leading-[0.9] tracking-[-0.05em]" style={{ color }}>{sel}</motion.span>
                </AnimatePresence>
                <span className="label mt-1 hidden max-w-[11rem] text-[10px] leading-snug text-ink/50 sm:block">Sustainable Development Goals</span>
              </div>
            </div>
            <p className="label mt-5 text-center text-ink/45">Highlighted goals are the ones NADI works under</p>
          </div>

          {/* POPUP */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.article key={sel} variants={card} initial="hidden" animate="show" exit="exit"
                className="relative min-h-[440px] overflow-hidden bg-white p-6 pl-8 shadow-[0_30px_60px_-30px_rgba(11,27,43,0.35)] sm:p-8 sm:pl-10">
                <motion.span className="absolute inset-y-0 left-0 w-2 origin-top" style={{ background: color }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.7, ease }} />
                <motion.div variants={item} className="flex items-center justify-between">
                  <p className="label text-ink/50">Goal {sel}</p>
                  <p className="label tabular-nums text-ink/50">{String(idx + 1).padStart(2, '0')} / {String(ours.length).padStart(2, '0')}</p>
                </motion.div>
                <motion.div variants={item} className="mt-5 flex items-center gap-4">
                  <span className="grid h-16 w-16 shrink-0 place-items-center font-display text-3xl font-extrabold text-white" style={{ background: color }}>{sel}</span>
                  <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{name}</h3>
                </motion.div>
                <motion.p variants={item} className="label mt-8 text-ink/50">What we do under this goal</motion.p>
                <ul className="mt-3 border-t border-ink/15">
                  {linked.map((p) => (
                    <motion.li key={p.id} variants={item} className="border-b border-ink/15">
                      <a href={`#${p.id}`} className="group block py-4">
                        <span className="flex items-baseline justify-between gap-4">
                          <span className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-nadi-deep">{p.name}</span>
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                        <span className="mt-1 block text-sm font-semibold text-ink/65">{p.focus}</span>
                        <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink/70">{p.desc}</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.article>
            </AnimatePresence>

            <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Choose a goal">
              {ours.map((g) => {
                const on = sel === g
                return (
                  <motion.button key={g} type="button" onClick={() => go(g)} aria-pressed={on} aria-label={`SDG ${g}: ${GOALS[g - 1][0]}`}
                    animate={{ width: on ? 68 : 38, opacity: on ? 1 : 0.55 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="relative h-10 overflow-hidden font-display text-[13px] font-extrabold text-white" style={{ background: GOALS[g - 1][1] }}>
                    <span className="relative">{g}</span>
                    {on && <motion.span key={`${sel}-${paused}`} className="absolute inset-x-0 bottom-0 h-1 origin-left bg-white/80" initial={{ scaleX: 0 }}
                      animate={{ scaleX: paused || reduce ? 0 : 1 }} transition={paused || reduce ? { duration: 0.2 } : { duration: DWELL / 1000, ease: 'linear' }} />}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}