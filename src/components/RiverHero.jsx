import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { org, impact } from '../data/nadi.js'
import { FILM } from './VideoHero.jsx'
import RiverCanvas from './RiverCanvas.jsx'
import { Doodle } from './Doodle.jsx'
import { PillLink } from './ui.jsx'
import { useRevealed, prefersReducedMotion, useMedia } from '../lib/intro.js'
import { useAnchorClick } from '../lib/anchors.js'
import { gsap, ScrollTrigger, useGsap } from '../lib/gsap.js'

/**
 * "Into the river" hero.
 *
 * Act 1 — the word NADI is a window cut into a deep-blue plate; NADI's own photographs play inside
 *          the letters while a living river of light flows across the page.
 * Act 2 — on scroll the plate dives through the stem of the "I" until the photograph fills the screen,
 *          then the mission and the Annual Report figures surface over it.
 *
 * Layout is flex-driven: the word is fitted into whatever space is left between the top meta row and
 * the bottom block, so nothing can ever slide under the fixed navbar, on any phone height.
 */

const WORDS = ['mental health', 'tribal education', 'youth leadership', 'inclusive communities']
const SHOT = 5.5
const PLATE = '#0A3F72'
// Figures kept in their Annual Report contexts (see data/nadi.js → impact); the hours belong to Youth for Action.
const pick = (group, label) => impact[group].items.find((x) => x.l === label)
const STATS = [
  { ...pick('profile', 'Beneficiaries reached') },
  { ...pick('profile', 'Active volunteers') },
  { ...pick('yfa', 'Volunteering hours'), l: 'Volunteering hours · Youth for Action' },
  { v: 4, s: '', l: 'Operational districts in Kerala' },
]

const fmt = (n) => Math.round(n).toLocaleString('en-IN')

/* ───────── small pieces ───────── */

function useClock() {
  const get = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date())
  const [t, setT] = useState(get)
  useEffect(() => { const id = setInterval(() => setT(get()), 15000); return () => clearInterval(id) }, [])
  return t
}

function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      {/* reserve the widest word so the line never jumps */}
      <span className="invisible col-start-1 row-start-1">inclusive communities</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={i} className="col-start-1 row-start-1 text-[#9CCBF0]"
          initial={{ yPercent: 110, opacity: 0 }} animate={{ yPercent: 0, opacity: 1 }} exit={{ yPercent: -110, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Circular, slowly turning seal with the NADI sun at its centre. */
function Seal({ href, onClick, className = '' }) {
  return (
    <a href={href} onClick={onClick} aria-label="Scroll to explore" className={`group grid place-items-center rounded-full ${className}`}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
        <defs><path id="seal-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <text className="fill-ivory/80" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13.5, letterSpacing: 4.2, textTransform: 'uppercase' }}>
          <textPath href="#seal-path">Youth-driven since 2022 • Scroll to dive in • </textPath>
        </text>
      </svg>
      <span className="grid h-[38%] w-[38%] place-items-center rounded-full bg-ivory text-navy-deep transition-transform duration-500 group-hover:scale-110">
        <ArrowDown size={18} className="transition-transform duration-500 group-hover:translate-y-0.5" />
      </span>
    </a>
  )
}

/** A crossfading film of NADI's photographs (the image seen through the letters). */
function Film({ still, onShot }) {
  const [i, setI] = useState(0)
  useEffect(() => { onShot?.(i) }, [i, onShot])
  useEffect(() => {
    if (still) return
    const id = setInterval(() => { if (document.visibilityState === 'visible') setI((v) => (v + 1) % FILM.length) }, SHOT * 1000)
    return () => clearInterval(id)
  }, [still])
  return (
    <AnimatePresence initial={false}>
      <motion.img key={i} src={FILM[i].photo.src} srcSet={FILM[i].photo.srcSet} sizes="100vw" alt=""
        fetchpriority={i === 0 ? 'high' : undefined} draggable="false"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1.02 }} exit={{ opacity: 0 }}
        transition={{ opacity: { duration: 1.4, ease: 'easeInOut' }, scale: { duration: SHOT + 1.5, ease: 'linear' } }} />
    </AnimatePresence>
  )
}

/** Magnetic pull for fine pointers — the element drifts towards the cursor. */
function useMagnet(strength = 0.3) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * strength); yTo((e.clientY - r.top - r.height / 2) * strength) }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength])
  return ref
}

/* ───────── the hero ───────── */

export default function RiverHero() {
  const show = useRevealed()
  const onAnchor = useAnchorClick()
  const reduce = useRef(prefersReducedMotion()).current
  const desktop = useMedia('(min-width: 1024px)')
  const clock = useClock()

  const ref = useRef(null)
  const slotRef = useRef(null)
  const textRef = useRef(null)
  const [shot, setShot] = useState(0)
  // fitted geometry of the word, in section pixels
  const [geo, setGeo] = useState(null)
  const magnet = useMagnet(0.25)

  const measure = useCallback(() => {
    const sec = ref.current, slot = slotRef.current, text = textRef.current
    if (!sec || !slot || !text) return
    const S = sec.getBoundingClientRect(), R = slot.getBoundingClientRect()
    const bb = text.getBBox() // advance box at font-size 200, baseline at y = 0
    if (!bb.width) return
    // tight vertical bounds from the glyph outlines (getBBox includes the font's line box)
    const c = document.createElement('canvas').getContext('2d')
    c.font = '700 200px "Bricolage Grotesque"'
    const m = c.measureText('NADI')
    const asc = m.actualBoundingBoxAscent || 145, desc = m.actualBoundingBoxDescent || 0
    const b = { x: bb.x, width: bb.width, y: -asc, height: asc + desc }
    const wide = S.width >= 1024
    const room = wide ? R.width - 190 : R.width // leave the seal its own column on desktop
    const k = Math.min(room / b.width, (R.height * 0.86) / b.height)
    const cx = wide ? R.left - S.left + (b.width * k) / 2 : R.left - S.left + R.width / 2
    const cy = R.top - S.top + R.height / 2
    // the stem of the final "I": its character cell, scaled into place
    let stem
    try { stem = text.getExtentOfChar(3) } catch { stem = { x: b.x + b.width * 0.93, width: b.width * 0.07 } }
    const tx = cx - (b.x + b.width / 2) * k
    const ty = cy - (b.y + b.height / 2) * k
    const ox = tx + (stem.x + stem.width / 2) * k
    const oy = ty + (b.y + b.height / 2) * k
    const half = Math.max(4, (stem.width * 0.42 * k) / 2) // conservative half-width of the stroke
    const halfH = b.height * 0.42 * k
    const zoom = 1.25 * Math.max(Math.max(ox, S.width - ox) / half, Math.max(oy, S.height - oy) / halfH)
    setGeo({ w: S.width, h: S.height, k, tx, ty, ox, oy, zoom: Math.min(zoom, 160),
      word: { x: tx + b.x * k, y: ty + b.y * k, w: b.width * k, h: b.height * k } })
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ref.current); ro.observe(slotRef.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])

  // Entrance, once the loader hands over.
  useGsap(ref, () => {
    if (!show) return
    gsap.timeline()
      .fromTo('.rh-plate-in', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out' })
      .fromTo('.rh-film-in', { scale: 1.3 }, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
      .fromTo('.rh-river-in', { opacity: 0 }, { opacity: 0.6, duration: 2 }, 0.4)
      .fromTo('.rh-in', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.07 }, 0.5)
      .fromTo('.rh-found span', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.03, ease: 'expo.out' }, 0.7)
  }, [show])

  // The pinned dive. Rebuilt whenever the fitted geometry changes.
  useGsap(ref, () => {
    if (!show || !geo) return
    // pointer parallax on fine pointers: plate and photo move against each other
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let off = () => {}
    if (fine) {
      const px = gsap.quickTo('.rh-par-plate', 'x', { duration: 1.2, ease: 'power3.out' })
      const py = gsap.quickTo('.rh-par-plate', 'y', { duration: 1.2, ease: 'power3.out' })
      const fx = gsap.quickTo('.rh-par-film', 'x', { duration: 1.6, ease: 'power3.out' })
      const fy = gsap.quickTo('.rh-par-film', 'y', { duration: 1.6, ease: 'power3.out' })
      const move = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5
        px(nx * -14); py(ny * -10); fx(nx * 26); fy(ny * 18)
      }
      window.addEventListener('pointermove', move)
      off = () => window.removeEventListener('pointermove', move)
    }

    // The dive — pinned, scrubbed.
    const mm = gsap.matchMedia()
    mm.add('(min-height: 520px)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${window.innerHeight * (desktop ? 2.2 : 1.8)}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
      })
      const late = { immediateRender: false }
      tl.fromTo('.rh-hud', { opacity: 1, y: 0, filter: 'blur(0px)' }, { opacity: 0, y: -40, filter: 'blur(8px)', duration: 0.12, ...late }, 0)
        .fromTo('.rh-outline', { opacity: 1 }, { opacity: 0, duration: 0.06, ...late }, 0)
        .to('.rh-zoom', { scale: geo.zoom, duration: 0.42, ease: 'power3.in' }, 0.02)
        .fromTo('.rh-river', { opacity: 1 }, { opacity: 0, duration: 0.25, ...late }, 0.05)
        .fromTo('.rh-plate', { opacity: 1 }, { opacity: 0, duration: 0.06, ...late }, 0.4)
        .fromTo('.rh-film', { scale: 1 }, { scale: 1.12, duration: 1, ...late }, 0)
        .to('.rh-wash', { opacity: 1, duration: 0.14 }, 0.36)
        .fromTo('.rh-act2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.44)
        .from('.rh-def', { y: 20, opacity: 0, duration: 0.08 }, 0.45)
        .fromTo('.rh-word', { opacity: 0.16 }, { opacity: 1, duration: 0.02, stagger: 0.012 }, 0.48)
        .from('.rh-stat', { y: 40, opacity: 0, duration: 0.1, stagger: 0.04 }, 0.7)
      gsap.utils.toArray('.rh-num').forEach((el, i) => {
        const o = { v: 0 }, target = STATS[i].v
        tl.to(o, { v: target, duration: 0.18, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(o.v) } }, 0.7 + i * 0.04)
      })
      tl.to({}, { duration: 0.1 }) // hold the finished frame
    })
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => { off(); mm.revert() }
  }, [show, geo?.w, geo?.h, geo?.k, desktop])

  const g = geo
  const words = org.intro.split(' ')

  return (
    <>
      <section id="top" ref={ref} aria-label="NADI Foundation"
        className="relative h-[100svh] min-h-[600px] overflow-hidden text-ivory" style={{ background: PLATE }}>

        {/* photographs: visible only through the letters until the dive */}
        <div className="rh-par-film absolute -inset-8">
          <div className="rh-film absolute inset-0 will-change-transform">
            <div className="rh-film-in absolute inset-0"><Film still={reduce} onShot={setShot} /></div>
          </div>
        </div>
        <div aria-hidden="true" className="rh-wash pointer-events-none absolute inset-0 opacity-0"
          style={{ background: 'linear-gradient(180deg, rgba(6,36,68,.55) 0%, rgba(6,36,68,.35) 35%, rgba(6,36,68,.88) 100%)' }} />

        {/* the plate with NADI cut out of it */}
        <div className="rh-par-plate pointer-events-none absolute -inset-4">
          <div className="rh-plate absolute inset-4"><div className="rh-plate-in absolute inset-0">
            {g && (
              <div className="rh-zoom absolute inset-0 will-change-transform" style={{ transformOrigin: `${g.ox}px ${g.oy}px` }}>
                <svg width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} className="absolute left-0 top-0 block" aria-hidden="true">
                  <defs>
                    <radialGradient id="rh-glow" cx="50%" cy="40%" r="75%">
                      <stop offset="0%" stopColor="#14599A" />
                      <stop offset="60%" stopColor={PLATE} />
                      <stop offset="100%" stopColor="#062A4E" />
                    </radialGradient>
                    <mask id="rh-cut" maskUnits="userSpaceOnUse" x="0" y="0" width={g.w} height={g.h}>
                      <rect width={g.w} height={g.h} fill="#fff" />
                      <text transform={`translate(${g.tx} ${g.ty}) scale(${g.k})`} fontSize="200" className="display" fill="#000">NADI</text>
                    </mask>
                  </defs>
                  {/* oversize so edges never show while parallaxing */}
                  <rect x={-40} y={-40} width={g.w + 80} height={g.h + 80} fill="url(#rh-glow)" mask="url(#rh-cut)" />
</svg>
                <Doodle kind="waves" trigger="manual" play={show} delay={1.3} duration={1.4}
                  className="rh-outline absolute text-[#78BAEC]"
                  style={{ left: g.word.x + g.word.w * 0.01, top: g.word.y + g.word.h * 1.02, width: g.word.w * 0.98, height: Math.max(10, g.word.h * 0.11) }} />
              </div>
            )}
          </div></div>
        </div>
        {/* hidden measuring copy of the word */}
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
          <text ref={textRef} fontSize="200" className="display">NADI</text>
        </svg>

        {/* a living river of light over everything */}
        {!reduce && (
          <div className="rh-river pointer-events-none absolute inset-0 mix-blend-screen">
            <RiverCanvas className="rh-river-in absolute inset-0 h-full w-full opacity-60" density={desktop ? 0.55 : 0.35} speed={0.8} />
          </div>
        )}

        {/* fine grain to bind photo and plate */}
        <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-40" />

        {/* ── Act 1 layout: top meta / word slot / bottom block ── */}
        <div className="rh-hud frame relative z-10 flex h-full flex-col pb-5 pt-[88px] sm:pb-7 sm:pt-[104px]">
          <div className="rh-in flex items-start justify-between gap-4 border-t border-ivory/15 pt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/70 sm:text-[11px]">
            <p className="max-w-[60%] leading-relaxed">Youth-driven nonprofit<span className="hidden sm:inline"> · Est. 2022</span></p>
            <p className="text-right leading-relaxed">
              <span className="hidden sm:inline">8.50° N, 76.95° E · </span>Thiruvananthapuram
              <span className="block text-ivory/50"><span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#78BAEC] align-middle" />{clock} IST</span>
            </p>
          </div>

          {/* the word is fitted into this slot */}
          <div ref={slotRef} className="relative min-h-[90px] flex-1 py-6 sm:py-8">
            <h1 className="sr-only">NADI Foundation — Equity, Equality &amp; Innovation</h1>
            <Seal href="#focus" onClick={(e) => onAnchor(e, '#focus')}
              className="rh-in absolute right-0 top-1/2 -mt-[72px] hidden h-36 w-36 lg:grid" />
          </div>

          <div className="grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <p aria-hidden="true" className="rh-found flex justify-between overflow-hidden font-display text-[clamp(1.05rem,5.2vw,1.9rem)] font-semibold tracking-[0.05em] text-[#BFD6EC] lg:justify-start lg:gap-[0.55em]">
                {'FOUNDATION'.split('').map((c, i) => <span key={i} className="inline-block">{c}</span>)}
              </p>
              <p className="rh-in accent mt-3 text-[clamp(1.35rem,2.1vw,1.9rem)] leading-tight text-ivory">Equity, Equality &amp; Innovation.</p>
            </div>
            <p className="rh-in text-[15px] leading-snug text-ivory/80 sm:text-[17px] lg:col-span-3">
              A river of change for<br /><RotatingWord />
            </p>
            <div className="rh-in flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
              <span ref={magnet} className="inline-block">
                <PillLink href="#work" onClick={(e) => onAnchor(e, '#work')} variant="ivory">Discover our work</PillLink>
              </span>
              <Link to="/donate" className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-ivory/35 px-5 text-[14px] font-semibold text-ivory backdrop-blur-sm transition-colors hover:bg-ivory hover:text-navy-deep">
                Donate <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="rh-in mt-5 flex items-center gap-3 text-[11.5px] text-ivory/60">
            <span className="flex gap-1" aria-hidden="true">
              {FILM.map((_, k) => <span key={k} className={`h-[2px] rounded-full transition-all duration-500 ${k === shot ? 'w-6 bg-ivory' : 'w-2 bg-ivory/30'}`} />)}
            </span>
            <AnimatePresence mode="wait">
              <motion.span key={shot} className="truncate" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
                In the letters: {FILM[shot].caption}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Act 2: surfaces once the dive is complete ── */}
        {!reduce && (
          <div className="rh-act2 invisible absolute inset-0 z-20 opacity-0">
            <Act2 words={words} />
          </div>
        )}
      </section>

      {/* without motion, Act 2 simply follows as its own block */}
      {reduce && (
        <section aria-label="Our mission" className="relative text-ivory" style={{ background: PLATE }}>
          <Act2 words={words} still />
        </section>
      )}
    </>
  )
}

function Act2({ words, still = false }) {
  return (
    <div className={`frame flex flex-col justify-center gap-10 sm:gap-14 ${still ? 'py-24' : 'h-full pb-10 pt-24'}`}>
      <div className="max-w-5xl">
        <p className="rh-def flex flex-wrap items-baseline gap-x-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#BFD6EC]">
          <span className="accent text-[22px] normal-case tracking-normal text-ivory">nadi</span>
          <span>(n.) — a river</span>
          <span className="h-px w-10 bg-ivory/40" />
          <span>Collective action &amp; sustainability</span>
        </p>
        <p className="mt-5 font-display text-[clamp(1.6rem,4.4vw,4rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
          {words.map((w, i) => <span key={i} className={`rh-word ${still ? '' : 'opacity-[.16]'}`}>{w}{' '}</span>)}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ivory/20 pt-6 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.l} className="rh-stat flex flex-col-reverse">
            <dt className="mt-2 text-[12.5px] text-ivory/70 sm:text-[13.5px]">{s.l}</dt>
            <dd className="display text-[clamp(2.2rem,5.5vw,4.6rem)] leading-none tracking-[-0.04em]">
              <span className="rh-num tabular">{still ? fmt(s.v) : '0'}</span><span className="text-[#78BAEC]">{s.s}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
