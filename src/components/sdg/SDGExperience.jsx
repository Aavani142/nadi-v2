import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { SDGS, VERIFIED } from '../../data/sdg.js'
import { prefersReducedMotion } from '../../lib/intro.js'
import { Eyebrow, Lines } from '../ui.jsx'
import SDGWheel from './SDGWheel.jsx'
import SDGDetails from './SDGDetails.jsx'
import SDGProjectShowcase from './SDGProjectShowcase.jsx'
import { Doodled } from '../Doodle.jsx'

const INTERVAL = 4.6 // seconds per goal
const N = SDGS.length

/** Next goal in the automatic rotation — verified NADI goals only. From an unverified (manually chosen)
 *  goal, rotation resumes at the next verified goal after it. */
function nextVerified(a) {
  return VERIFIED.find((i) => i > a) ?? VERIFIED[0]
}

export default function SDGExperience() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.25 })
  const reduce = useRef(prefersReducedMotion()).current
  const [active, setActive] = useState(VERIFIED[0])
  const [playing, setPlaying] = useState(!reduce) // user's play/pause choice
  const [held, setHeld] = useState(false) // temporarily paused by hover / touch / focus
  const progress = useMotionValue(0)
  const touchTimer = useRef()

  const running = playing && !held && inView
  useEffect(() => {
    if (!running) return
    progress.set(0)
    const c = animate(progress, 1, { duration: INTERVAL, ease: 'linear', onComplete: () => setActive((a) => nextVerified(a)) })
    return () => c.stop()
  }, [running, active, progress])

  const select = useCallback((i) => { setActive(i); progress.set(0) }, [progress])
  const onInteract = useCallback((kind) => {
    clearTimeout(touchTimer.current)
    if (kind === 'leave') setHeld(false)
    else if (kind === 'touch') { setHeld(true); touchTimer.current = setTimeout(() => setHeld(false), 8000) }
    else setHeld(true)
  }, [])
  useEffect(() => () => clearTimeout(touchTimer.current), [])

  const goal = SDGS[active]

  return (
    <section id="sdgs" ref={ref} aria-label="Sustainable Development Goals" className="relative overflow-hidden bg-navy pb-24 pt-24 text-ivory sm:pt-32 lg:pb-32 lg:pt-36">
      {/* the 17 official goal colours as the section's opening band */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-2">
        {SDGS.map((g) => <span key={g.n} className="flex-1" style={{ background: g.color }} />)}
      </div>

      <div className="frame relative">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow tone="text-mustard">The Global Goals</Eyebrow>
            <Lines className="display mt-6 text-[clamp(2.8rem,6.2vw,6.2rem)] leading-[0.9]"
              lines={['Local action.', <span key="a" className="accent text-mustard"><Doodled kind="underline" delay={0.9}>Global goals.</Doodled></span>]} />
          </div>
          <p className="text-[16px] leading-relaxed text-ivory/70 lg:col-span-4 lg:col-start-9 lg:pt-8">
            The wheel turns through the {VERIFIED.length} goals NADI's initiatives work towards, as documented in NADI's pamphlet and Annual Report 2025–2026. All 17 United Nations goals remain open to explore: select any one.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,46%)_minmax(0,1fr)] items-center gap-x-4 gap-y-10 sm:gap-x-8 lg:mt-20 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-6">
          {/* wheel left, goal right — on every screen, so the turning wheel and the changing content are seen together */}
          <div className="col-start-1 row-start-1 lg:col-span-6 lg:row-span-2">
            <SDGWheel active={active} onSelect={select} progress={progress} onInteract={onInteract} className="mx-auto w-full max-w-[440px] lg:max-w-[540px]" />
            {/* controls */}
            <div className="mx-auto mt-4 flex w-fit items-center gap-1.5 sm:mt-6 sm:gap-2">
              <button type="button" aria-label="Previous goal" onClick={() => select((active - 1 + N) % N)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-white hover:text-navy"><ChevronLeft size={18} /></button>
              <button type="button" aria-label={playing ? 'Pause automatic rotation' : 'Play automatic rotation'} onClick={() => setPlaying((p) => !p)}
                className="inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/20 px-3 text-[13px] font-semibold hover:bg-white hover:text-navy sm:px-4">
                {playing ? <Pause size={15} /> : <Play size={15} />}<span className="hidden sm:inline">{playing ? 'Pause' : 'Play'}</span>
              </button>
              <button type="button" aria-label="Next goal" onClick={() => select((active + 1) % N)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-white hover:text-navy"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="col-start-2 row-start-1 self-center lg:col-span-6 lg:col-start-7 lg:self-end">
            <SDGDetails goal={goal} />
          </div>
          <div className="col-span-2 row-start-2 lg:col-span-6 lg:col-start-7 lg:self-start">
            <SDGProjectShowcase goal={goal} onPick={select} />
          </div>
        </div>

        {/* touch-friendly index of all 17 goals */}
        <ol data-lenis-prevent className="no-scrollbar -mx-5 mt-14 flex gap-1.5 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-[repeat(17,minmax(0,1fr))] sm:gap-1 sm:overflow-visible sm:px-0 lg:mt-20" aria-label="All goals">
          {SDGS.map((s, i) => (
            <li key={s.n} className="w-11 shrink-0 sm:w-auto">
              <button type="button" onClick={() => select(i)} aria-label={`Goal ${s.n}: ${s.name}`} aria-current={i === active ? 'true' : undefined}
                className="group relative block h-12 w-full overflow-hidden rounded-[4px] text-[12px] font-bold text-white transition-transform sm:h-12 sm:text-[13px]"
                style={{ background: s.color }}>
                <span className={`absolute inset-0 bg-navy transition-opacity ${i === active ? 'opacity-0' : 'opacity-40 group-hover:opacity-10'}`} />
                <span className="relative">{s.n}</span>
                {s.initiatives.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-ivory ring-2 ring-navy/40" />}
                {i === active && <motion.span layoutId="sdg-index" className="absolute inset-x-0 bottom-0 h-1 bg-white" />}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-center gap-2 text-[12.5px] text-ivory/70"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ivory ring-2 ring-white/30" /> Goals NADI's initiatives work towards — these are the ones the wheel turns through.</p>
        <p className="mt-2 text-[12px] text-ivory/45">Official UN Sustainable Development Goal icons and colours. NADI mappings: pamphlet and Annual Report 2025–2026.</p>
      </div>
    </section>
  )
}
