import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { donateLink, org, photos } from '../data/nadi.js'
import { gsap, ScrollTrigger, useGsap, prefersReducedMotion } from '../lib/motion.js'
import { useGoToSection } from '../lib/nav.js'
import { Button, Img, SplitWords, TextLink } from '../components/ui.jsx'

const PILL = [photos.volunteersMural, photos.learningPlay, photos.kappinessGarden, photos.ekatvaConvocation, photos.mindfulness]

/** Small photo set into the headline; cycles through NADI's work. */
function HeadlinePill() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const t = setInterval(() => setI((n) => (n + 1) % PILL.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="hero-pill relative mr-[0.18em] inline-block h-[0.74em] w-[1.25em] overflow-hidden sm:w-[1.85em] rounded-full bg-ink align-[0.04em]">
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0 0 0%)' }}
          exit={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <Img photo={PILL[i]} sizes="30vw" eager={i === 0} className="h-full w-full scale-110 object-cover" alt="" />
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * The river line — NADI's logo waves as two strokes that flow continuously and swell
 * toward the pointer. Static when reduced motion is preferred.
 */
function River() {
  const svg = useRef(null)
  const a = useRef(null)
  const b = useRef(null)
  const W = 1440, H = 160, N = 64

  const build = (phase, amp, cx, base, freq) => {
    let d = ''
    for (let k = 0; k <= N; k++) {
      const x = (k / N) * W
      const swell = 1 + 1.4 * Math.exp(-Math.pow((x - cx) / 260, 2))
      const y = base + amp * swell * Math.sin((x / W) * Math.PI * 2 * freq + phase)
      d += `${k ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
    }
    return d
  }

  useEffect(() => {
    const draw = (p, amp, cx) => {
      a.current?.setAttribute('d', build(p, amp, cx, 70, 1.15))
      b.current?.setAttribute('d', build(p * 0.8 + 1.6, amp * 0.6, cx, 112, 1.35))
    }
    if (prefersReducedMotion()) { draw(0.6, 18, -999); return }

    const state = { phase: 0, amp: 0, cx: W / 2, targetCx: W / 2, targetAmp: 16 }
    gsap.to(state, { amp: 16, duration: 2.4, ease: 'expo.out', delay: 0.6 })
    const move = (e) => {
      const r = svg.current.getBoundingClientRect()
      state.targetCx = ((e.clientX - r.left) / r.width) * W
      state.targetAmp = Math.abs(e.clientY - (r.top + r.height / 2)) < 220 ? 26 : 16
    }
    let visible = true
    const st = ScrollTrigger.create({ trigger: svg.current, start: 'top bottom', end: 'bottom top', onToggle: (s) => (visible = s.isActive) })
    const tick = (_t, dt) => {
      if (!visible) return
      state.phase += dt * 0.0011
      state.cx += (state.targetCx - state.cx) * 0.05
      state.amp += (state.targetAmp - state.amp) * 0.04
      draw(state.phase, state.amp, state.cx)
    }
    gsap.ticker.add(tick)
    window.addEventListener('pointermove', move, { passive: true })
    return () => { gsap.ticker.remove(tick); window.removeEventListener('pointermove', move); st.kill() }
  }, [])

  return (
    <svg ref={svg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden className="hero-river pointer-events-none block h-14 w-full sm:h-20">
      <path ref={a} fill="none" stroke="#2152FF" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      <path ref={b} fill="none" stroke="#8EA8FF" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Hero() {
  const root = useRef(null)
  const goTo = useGoToSection()

  useGsap(root, () => {
    const tl = gsap.timeline({ delay: 0.35 })
    tl.from('.w-in', { yPercent: 115, rotate: 4, duration: 1.5, stagger: 0.07 })
      .from('.hero-pill', { width: 0, marginRight: 0, duration: 1.4, ease: 'expo.inOut' }, 0.35)
      .from('.hero-fade', { y: 24, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.7)
      .from('.hero-river', { opacity: 0, duration: 1.6 }, 0.9)

    // Leaving the hero: the headline drifts up and softens
    gsap.to('.hero-title', {
      yPercent: -18, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  })

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 sm:pt-28">
      <div className="frame hero-fade flex items-center justify-between gap-4 text-ink/60">
        <p className="kicker">Youth-driven nonprofit · Kerala</p>
        <p className="kicker hidden sm:block">Est. 2022 · ISO 9001:2015</p>
      </div>

      <h1 id="hero-title" className="hero-title frame display mt-8 text-[min(19vw,11.5svh)] uppercase sm:mt-10 sm:text-[min(12.2vw,16.5svh)] xl:text-[min(11.4vw,16.5svh)] min-[1520px]:text-[min(172px,16.5svh)]">
        <span className="sr-only">NADI Foundation — young people moving Kerala forward.</span>
        <span aria-hidden className="block">
          <SplitWords text="Young people" />
        </span>
        <span aria-hidden className="flex flex-wrap items-center">
          <HeadlinePill />
          <span className="line-mask inline-block">
            <span className="w-in italic-serif inline-block pr-[0.06em] text-[1.06em] normal-case leading-[0.8] text-river">moving</span>
          </span>
        </span>
        <span aria-hidden className="block">
          <SplitWords text="Kerala" />
          <span className="line-mask inline-block align-top"><span className="w-in inline-block">forward<span className="text-ember">.</span></span></span>
        </span>
      </h1>

      <div className="mt-4 sm:mt-5">
        <River />
      </div>

      <div className="frame mt-auto grid items-end gap-8 pb-8 pt-6 sm:pb-10 md:grid-cols-12 md:gap-6">
        <p className="hero-fade max-w-md text-lg leading-relaxed text-ink/75 md:col-span-5">
          {org.intro}
        </p>
        <div className="hero-fade flex flex-wrap items-center gap-x-7 gap-y-4 md:col-span-4">
          <Button to={donateLink.path} variant="ember" size="lg">Donate now</Button>
          <TextLink href="#work" onClick={(e) => { e.preventDefault(); goTo('work') }}>Explore our work</TextLink>
        </div>
        <div className="hero-fade flex items-end justify-between gap-6 md:col-span-3 md:flex-col md:items-end md:text-right">
          <p>
            <span className="display block text-6xl tabular sm:text-7xl">1,000<span className="text-ember">+</span></span>
            <span className="mt-1 block text-sm text-ink/60">active volunteers</span>
          </p>
          <button type="button" onClick={() => goTo('about')} className="group kicker flex items-center gap-2 text-ink/60 hover:text-ink">
            Scroll
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-ink/20">
              <ArrowDown aria-hidden className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:translate-y-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
