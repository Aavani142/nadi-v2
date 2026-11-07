import { useRef, useState } from 'react'
import { ArrowDownRight } from 'lucide-react'
import { focusAreas, initiatives } from '../data/nadi.js'
import { gsap, revealIn, useGsap } from '../lib/gsap.js'
import { scrollToInitiative, INITIATIVE_IDS } from './InitiativesSection.jsx'
import { Doodled } from './Doodle.jsx'
import PaperBackdrop from './PaperBackdrop.jsx'

/**
 * THREE CORE AREAS — three photo panels side by side. The one you hover, focus or tap opens up and
 * tells its story; the others stay as narrow photo strips with their name. No scroll pinning, so the
 * page always scrolls normally and only one area's text is ever on screen at a time.
 * Phones/tablets: the three areas are stacked cards, all open.
 */
// one accent per area, in NADI's own tones (Kappiness terracotta, Prabodhini leaf green, NADI logo blue)
const ACCENT = { 'mental-health': '#E08A6A', education: '#7CC79E', community: '#7DB8E8' }

function Initiatives({ area, tabbable = true }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={`Initiatives in ${area.title}`}>
      {area.initiatives.map((key) => (
        <li key={key}>
          <a href={`#work-${INITIATIVE_IDS[key]}`} tabIndex={tabbable ? 0 : -1}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToInitiative(INITIATIVE_IDS[key]) }}
            className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white px-4 text-[14px] font-semibold text-[#1C3557] transition-colors hover:bg-[#4A5E88] hover:text-white active:scale-[0.97]">
            {initiatives[key].name}
            <ArrowDownRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
        </li>
      ))}
    </ul>
  )
}

function Keywords({ area }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Focus">
      {area.keywords.map((k) => (
        <li key={k} className="rounded-full border border-white/35 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/85">{k}</li>
      ))}
    </ul>
  )
}

function Img({ photo, sizes }) {
  return (
    <img src={photo.src} srcSet={photo.srcSet} sizes={photo.srcSet ? sizes : undefined} alt={photo.alt}
      loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
  )
}

/** Desktop: one expanding panel. */
function Panel({ area, open, onOpen }) {
  const accent = ACCENT[area.id]
  return (
    <article
      onMouseEnter={onOpen} onFocus={onOpen} onClick={onOpen}
      className="group relative min-w-0 cursor-pointer overflow-hidden rounded-[28px] bg-[#4A5E88] transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
      style={{ flexGrow: open ? 5 : 1, flexBasis: 0 }}
      aria-expanded={open}
    >
      <div className={`absolute inset-0 transition-transform duration-[1200ms] ease-out ${open ? 'scale-100' : 'scale-110'}`}>
        <Img photo={area.photo} sizes="60vw" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#061f38] via-[#061f38]/55 to-[#061f38]/10" />
      <div aria-hidden="true" className={`absolute inset-0 bg-[#061f38]/40 transition-opacity duration-500 ${open ? 'opacity-0' : 'opacity-100 group-hover:opacity-60'}`} />

      {/* closed: the area's name, reading upwards */}
      <div aria-hidden={open} className={`absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-between py-8 transition-opacity duration-300 ${open ? 'pointer-events-none opacity-0' : 'opacity-100 delay-200'}`}>
        <span className="display text-3xl leading-none" style={{ color: accent }}>{area.n}</span>
        <span className="display whitespace-nowrap text-[clamp(1.4rem,2vw,2rem)] text-white [writing-mode:vertical-rl] rotate-180">{area.title}</span>
      </div>

      {/* open: the story */}
      <div aria-hidden={!open} className={`absolute inset-x-0 bottom-0 p-10 xl:p-12 ${open ? 'opacity-100 translate-y-0 transition-all delay-300 duration-700' : 'pointer-events-none translate-y-6 opacity-0 transition-none'}`}>
        <div className="max-w-[560px]">
          <div className="flex items-center gap-4">
            <span className="display text-5xl leading-none" style={{ color: accent }}>{area.n}</span>
            <span className="h-px w-16" style={{ background: accent }} />
            {area.sub && <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/75">{area.sub}</span>}
          </div>
          <h3 className="display mt-4 text-[clamp(2.4rem,4vw,4rem)] leading-[0.95] text-white">{area.title}</h3>
          <p className="mt-4 text-[16.5px] leading-relaxed text-white/85">{area.text}</p>
          <div className="mt-5"><Keywords area={area} /></div>
          <div className="mt-6"><Initiatives area={area} tabbable={open} /></div>
        </div>
      </div>
    </article>
  )
}

/** Phones/tablets: a stacked card. */
function Card({ area }) {
  const accent = ACCENT[area.id]
  return (
    <article data-reveal className="overflow-hidden rounded-[24px] bg-[#4A5E88] text-white">
      <div className="relative aspect-[4/3] sm:aspect-[16/9]">
        <Img photo={area.photo} sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#1C3557] via-transparent to-transparent" />
        <span className="display absolute bottom-4 left-5 text-5xl leading-none" style={{ color: accent }}>{area.n}</span>
      </div>
      <div className="p-6 sm:p-8">
        {area.sub && <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">{area.sub}</p>}
        <h3 className="display mt-1 text-[clamp(2rem,8vw,3rem)] leading-[0.95]">{area.title}</h3>
        <p className="mt-3 text-[15.5px] leading-relaxed text-white/85">{area.text}</p>
        <div className="mt-4"><Keywords area={area} /></div>
        <div className="mt-5"><Initiatives area={area} /></div>
      </div>
    </article>
  )
}

export default function FocusSection() {
  const ref = useRef(null)
  const [open, setOpen] = useState(0)

  useGsap(ref, () => {
    gsap.from('.focus-line', { yPercent: 110, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: '.focus-head', start: 'top 80%', once: true } })
    revealIn(ref.current)
  })

  return (
    <section id="focus" ref={ref} aria-labelledby="focus-title" className="g-ivory relative pb-24 sm:pb-32">
      <PaperBackdrop tone="light" seed={5} />
      <div className="focus-head frame grid gap-8 pb-12 pt-24 sm:pb-16 sm:pt-32 lg:grid-cols-12 lg:items-end lg:pb-20 lg:pt-40">
        <div className="lg:col-span-8">
          <p className="eyebrow flex items-center gap-3 text-accent"><span aria-hidden="true" className="h-px w-8 bg-current" />Our three core areas</p>
          <h2 id="focus-title" className="display mt-6 text-[clamp(2.9rem,7vw,7.2rem)] leading-[0.9] text-heading">
            <span className="block overflow-hidden pb-[0.05em]"><span className="focus-line block">Three core areas.</span></span>
            <Doodled kind="underline" delay={1}><span className="block overflow-hidden pb-[0.08em]"><span className="focus-line accent block text-accent">One collective purpose.</span></span></Doodled>
          </h2>
        </div>
        <p data-reveal className="text-[17px] leading-relaxed text-fg/75 lg:col-span-4 lg:pb-3">
          NADI Foundation works towards meaningful social transformation through mental health, education and community development.
        </p>
      </div>

      <div className="frame">
        {/* desktop: expanding panels */}
        <div data-reveal className="hidden h-[min(78svh,720px)] min-h-[560px] gap-3 lg:flex">
          {focusAreas.map((a, i) => <Panel key={a.id} area={a} open={open === i} onOpen={() => setOpen(i)} />)}
        </div>
        {/* phones & tablets: stacked cards */}
        <div className="grid gap-5 lg:hidden">
          {focusAreas.map((a) => <Card key={a.id} area={a} />)}
        </div>
      </div>
    </section>
  )
}
