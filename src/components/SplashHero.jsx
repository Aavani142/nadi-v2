import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { org, impact } from '../data/nadi.js'
import { FILM } from './VideoHero.jsx'
import { PillLink } from './ui.jsx'
import { useRevealed, prefersReducedMotion } from '../lib/intro.js'
import { useAnchorClick } from '../lib/anchors.js'

/**
 * Editorial hero — restrained, institutional, with one memorable gesture: a single river line
 * draws itself across the page and a point of light keeps travelling along it, passing behind an
 * arched window of NADI's own photographs.
 *
 * Cost: one SVG path, a few stacked <img>s crossfading on opacity, and one-time entrance reveals.
 * No canvas, no scroll pinning, no blur/blend filters, no pointer tracking. Loops pause off-screen;
 * reduced-motion visitors get the finished composition.
 */

const SHOTS = FILM.slice(0, 4)
const SHOT_MS = 6500

const pick = (group, label) => impact[group].items.find((x) => x.l === label)
const STATS = [
  { ...pick('profile', 'Beneficiaries reached') },
  { ...pick('profile', 'Active volunteers') },
  { ...pick('yfa', 'Volunteering hours'), l: 'Volunteering hours · Youth for Action' },
  { v: 4, s: '', l: 'Operational districts in Kerala' },
]
const fmt = (n) => Math.round(n).toLocaleString('en-IN')

// one long, unhurried S-curve across the whole hero
const RIVER = 'M-40 760 C 220 700, 360 520, 620 560 S 980 760, 1160 520 S 1360 160, 1500 120'

function Line({ children, d }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="eh-line block" style={{ '--d': d }}>{children}</span>
    </span>
  )
}

/** Counts up once, the first time it is seen. */
function Count({ to, start }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !start) return
    if (prefersReducedMotion()) { el.textContent = fmt(to); return }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now() + 900, dur = 1600
      const step = (t) => {
        const p = Math.max(0, Math.min(1, (t - t0) / dur))
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 4)))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [to, start])
  return <span ref={ref} className="tabular">0</span>
}

/** Thin spinning seal that overlaps the arch. */
function Seal({ href, onClick, className = '' }) {
  return (
    <a href={href} onClick={onClick} aria-label="Scroll to explore" className={`group grid place-items-center rounded-full border border-ivory/20 bg-[#0A3F72] ${className}`}>
      <svg viewBox="0 0 200 200" className="eh-spin absolute inset-0 h-full w-full" aria-hidden="true">
        <defs><path id="eh-seal" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
        <text className="fill-ivory/75" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13.5, letterSpacing: 5, textTransform: 'uppercase' }}>
          <textPath href="#eh-seal">Equity • Equality • Innovation • </textPath>
        </text>
      </svg>
      <ArrowDown size={18} className="relative text-ivory transition-transform duration-500 group-hover:translate-y-1" />
    </a>
  )
}

export default function SplashHero() {
  const show = useRevealed()
  const onAnchor = useAnchorClick()
  const ref = useRef(null)
  const [off, setOff] = useState(false)
  const [i, setI] = useState(0)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOff(!e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!show || off || prefersReducedMotion()) return
    const id = setInterval(() => { if (!document.hidden) setI((v) => (v + 1) % SHOTS.length) }, SHOT_MS)
    return () => clearInterval(id)
  }, [show, off])

  return (
    <section id="top" ref={ref} aria-label="NADI Foundation"
      className={`eh relative overflow-hidden bg-[#0A3F72] text-ivory ${show ? 'is-in' : ''} ${off ? 'is-off' : ''}`}
      style={{ backgroundImage: 'radial-gradient(80% 70% at 78% 30%, #14599A 0%, rgba(20,89,154,0) 62%)' }}>

      {/* the river: drawn once, then a point of light keeps travelling along it */}
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
        <path d={RIVER} pathLength="1000" fill="none" stroke="rgba(191,214,236,.22)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" className="eh-river" />
        <path d={RIVER} pathLength="1000" fill="none" stroke="#9CCBF0" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="eh-glint" />
      </svg>

      <div className="frame relative z-10 flex min-h-[100svh] flex-col pb-8 pt-[100px] sm:pt-[116px]">
        {/* meta row */}
        <div className="eh-fade flex items-start justify-between gap-4 border-t border-ivory/15 pt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ivory/60 sm:text-[11px]" style={{ '--d': '.1s' }}>
          <p>NADI Foundation<span className="hidden sm:inline"> · Est. 2022 · ISO 9001:2015</span></p>
          <p className="text-right">Thiruvananthapuram, Kerala</p>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-12 lg:gap-8 lg:py-12">
          {/* words */}
          <div className="lg:col-span-7">
            <p className="eh-fade eyebrow flex items-center gap-3 text-[#BFD6EC]" style={{ '--d': '.2s' }}>
              <span className="accent text-[20px] normal-case tracking-normal text-ivory">nadi</span>
              <span>(n.) — a river</span>
            </p>
            <h1 className="display mt-6 text-[clamp(2.9rem,7.4vw,7.6rem)] leading-[0.94] text-ivory">
              <span className="sr-only">NADI Foundation — a river of change, shaped by young people.</span>
              <span aria-hidden="true">
                <Line d=".25s">A river of <span className="accent text-[#9CCBF0]">change,</span></Line>
                <Line d=".35s">shaped by</Line>
                <Line d=".45s">young people.</Line>
              </span>
            </h1>
            <p className="eh-fade mt-8 max-w-[34rem] text-[16px] leading-relaxed text-ivory/75 sm:text-[17.5px]" style={{ '--d': '.75s' }}>
              {org.intro}
            </p>
            <div className="eh-fade mt-8 flex flex-wrap items-center gap-3" style={{ '--d': '.85s' }}>
              <PillLink href="#work" onClick={(e) => onAnchor(e, '#work')} variant="ivory">Discover our work</PillLink>
              <Link to="/donate" className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-ivory/35 px-5 text-[14px] font-semibold text-ivory transition-colors duration-300 hover:bg-ivory hover:text-[#0A3F72]">
                Donate <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          {/* arched window of photographs */}
          <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
            <div className="eh-arch relative aspect-[4/5] overflow-hidden rounded-b-[28px] rounded-t-[999px] bg-[#0B4880] lg:ml-auto">
              {SHOTS.map((s, k) => (
                <img key={k} src={s.photo.src} srcSet={s.photo.srcSet} sizes="(min-width:1024px) 40vw, 90vw" alt={k === i ? s.photo.alt : ''}
                  loading={k === 0 ? 'eager' : 'lazy'} fetchpriority={k === 0 ? 'high' : undefined} decoding="async" draggable="false"
                  className={`eh-shot absolute inset-0 h-full w-full object-cover ${k === i ? 'is-on' : ''}`} />
              ))}
              <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,36,68,.55), rgba(6,36,68,0) 40%)' }} />
              <p className="absolute inset-x-5 bottom-4 flex items-baseline gap-3 text-[12.5px] text-ivory/90">
                <span className="font-mono text-[10.5px] tracking-[0.14em] text-ivory/60 tabular">{String(i + 1).padStart(2, '0')} / {String(SHOTS.length).padStart(2, '0')}</span>
                <span key={i} className="eh-cap truncate">{SHOTS[i].caption}</span>
              </p>
            </div>
            <Seal href="#focus" onClick={(e) => onAnchor(e, '#focus')}
              className="eh-fade absolute -left-6 bottom-[14%] hidden h-28 w-28 lg:grid" />
          </div>
        </div>

        {/* figures */}
        <dl className="eh-fade grid grid-cols-2 border-t border-ivory/15 lg:grid-cols-4" style={{ '--d': '1s' }}>
          {STATS.map((s, k) => (
            <div key={s.l} className={`flex flex-col-reverse py-5 pr-4 ${k % 2 ? 'pl-5 border-l border-ivory/15' : ''} ${k > 1 ? 'border-t border-ivory/15 lg:border-t-0' : ''} ${k === 2 ? 'lg:border-l lg:pl-5' : ''}`}>
              <dt className="mt-2 text-[12.5px] leading-snug text-ivory/60 sm:text-[13px]">{s.l}</dt>
              <dd className="display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-none tracking-[-0.03em]">
                <Count to={s.v} start={show} /><span className="text-[#9CCBF0]">{s.s}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
