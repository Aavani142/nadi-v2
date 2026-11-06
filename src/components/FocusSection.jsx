import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowDownRight } from 'lucide-react'
import { focusAreas, initiatives } from '../data/nadi.js'
import { gsap, revealIn, useGsap, reducedMotion, ScrollTrigger } from '../lib/gsap.js'
import { scrollToY } from '../lib/SmoothScroll.jsx'
import { scrollToInitiative, INITIATIVE_IDS } from './InitiativesSection.jsx'
import { Doodled } from './Doodle.jsx'
import { BreathMotif, PathMotif, GatherMotif } from './FocusMotifs.jsx'

/**
 * THREE CORE AREAS — one pinned stage. Scrolling moves through the areas; each brings its own ground
 * colour, its own living motif (breath · learning path · gathering) and its own photograph.
 * The same experience on phones, tablets and desktop; tabs jump straight to an area.
 * Reduced motion: the three areas are simply listed.
 */
// one family: warm-light grounds a shade apart, accents in NADI's own tones (Kappiness terracotta,
// Prabodhini leaf green, NADI logo blue) — distinct per area, but they belong together
const LOOK = {
  'mental-health': { ground: '#F8EEE8', accent: '#C2603F', Motif: BreathMotif },
  education: { ground: '#EDF4EE', accent: '#2E7D57', Motif: PathMotif },
  community: { ground: '#E9F1F9', accent: '#0468B1', Motif: GatherMotif },
}
const N = focusAreas.length

function Chars({ text }) {
  return text.split(' ').map((w, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-top">
      <span className="fc-char inline-block">{w}&nbsp;</span>
    </span>
  ))
}

function Chapter({ area, active, index }) {
  const { accent, Motif } = LOOK[area.id]
  return (
    <article
      aria-hidden={!active}
      className="fc-chapter absolute inset-0 grid grid-rows-[auto_1fr] content-center gap-5 sm:gap-8 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-10"
      style={{ visibility: index === 0 ? 'visible' : 'hidden' }}
    >
      {/* motif: top on phones, right on desktop */}
      <div className="fc-motif mx-auto w-[min(68vw,29svh)] sm:w-[min(48vw,32svh)] lg:order-2 lg:col-span-6 lg:w-[min(38vw,54svh)]">
        <Motif photo={area.photo} color={accent} active={active} />
      </div>

      <div className="lg:order-1 lg:col-span-6">
        <div className="flex items-baseline gap-4">
          <span className="fc-num display text-[clamp(2.4rem,8vw,4.6rem)] leading-none" style={{ color: accent }}>{area.n}</span>
          <span className="fc-rule h-px flex-1 origin-left" style={{ background: accent, opacity: 0.45 }} />
        </div>
        <h3 className="display mt-2 text-[clamp(2rem,8.6vw,5.2rem)] leading-[0.92] text-[#09325A] sm:mt-3">
          <Chars text={area.title} />
          {area.sub && <span className="fc-fade accent mt-1 block text-[0.5em] font-normal" style={{ color: accent }}>{area.sub}</span>}
        </h3>
        <p className="fc-fade mt-3 max-w-xl text-[14.5px] leading-relaxed text-[#1C2634]/75 sm:mt-4 sm:text-[16.5px] [@media(max-height:700px)]:line-clamp-3">{area.text}</p>
        <ul className="fc-fade mt-4 hidden flex-wrap gap-2 sm:flex [@media(max-height:760px)]:hidden" aria-label="Focus">
          {area.keywords.map((k) => (
            <li key={k} className="rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ borderColor: `${accent}66`, color: accent }}>{k}</li>
          ))}
        </ul>
        <ul className="fc-fade mt-4 flex flex-wrap gap-2 sm:mt-5" aria-label="Initiatives in this area">
          {area.initiatives.map((key) => (
            <li key={key}>
              <a href={`#work-${INITIATIVE_IDS[key]}`} tabIndex={active ? 0 : -1}
                onClick={(e) => { e.preventDefault(); scrollToInitiative(INITIATIVE_IDS[key]) }}
                className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white px-3.5 text-[13.5px] font-semibold text-[#09325A] shadow-[0_6px_18px_-12px_rgba(9,50,90,.6)] transition-colors hover:bg-[#09325A] hover:text-white active:scale-[0.97] sm:gap-2 sm:px-4 sm:text-[14px]">
                {initiatives[key].name}
                <ArrowDownRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/** Reduced motion: the same content, listed and static. */
function StaticList() {
  return (
    <div className="grid gap-px">
      {focusAreas.map((a) => {
        const { ground, accent, Motif } = LOOK[a.id]
        return (
          <div key={a.id} className="py-16" style={{ background: ground }}>
            <div className="frame grid items-center gap-10 lg:grid-cols-2">
              <div className="mx-auto w-[min(72vw,380px)]"><Motif photo={a.photo} color={accent} active={false} /></div>
              <div>
                <p className="display text-5xl" style={{ color: accent }}>{a.n}</p>
                <h3 className="display mt-2 text-[clamp(2.1rem,6vw,4.4rem)] leading-[0.95] text-[#09325A]">{a.title}</h3>
                <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[#1C2634]/75">{a.text}</p>
                <p className="mt-4 text-[14px] font-semibold text-[#09325A]">{a.initiatives.map((k) => initiatives[k].name).join(' · ')}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function FocusSection() {
  const ref = useRef(null)
  const stage = useRef(null)
  const st = useRef(null)
  const [reduce] = useState(() => reducedMotion())
  const [active, setActive] = useState(0)
  const prev = useRef(0)

  // section intro
  useGsap(ref, () => {
    gsap.from('.focus-line', { yPercent: 110, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: '.focus-head', start: 'top 80%', once: true } })
    revealIn(ref.current.querySelector('.focus-head'))
  })

  // the pinned stage
  useGsap(stage, () => {
    st.current = ScrollTrigger.create({
      trigger: stage.current, start: 'top top', end: () => `+=${window.innerHeight * (N - 1) * 0.9}`,
      pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power2.inOut', delay: 0.05 },
      onUpdate: (self) => {
        const i = Math.round(self.progress * (N - 1))
        setActive((a) => (a === i ? a : i))
        const bar = stage.current?.querySelector('.fc-progress')
        if (bar) bar.style.transform = `scaleX(${(self.progress * (N - 1) + 1) / N})`
      },
    })
    // first chapter's entrance as the stage arrives
    gsap.from(stage.current.querySelectorAll('.fc-chapter')[0].querySelectorAll('.fc-char'), {
      yPercent: 110, duration: 1, stagger: 0.05, ease: 'expo.out',
      scrollTrigger: { trigger: stage.current, start: 'top 60%', once: true },
    })
  })

  // chapter change: ground shifts colour, outgoing steps back, incoming builds itself
  useLayoutEffect(() => {
    if (reduce || !stage.current || prev.current === active) return
    const chapters = stage.current.querySelectorAll('.fc-chapter')
    const out = chapters[prev.current], inc = chapters[active]
    const dir = active > prev.current ? 1 : -1
    prev.current = active
    const ctx = gsap.context(() => {
      gsap.to(stage.current, { backgroundColor: LOOK[focusAreas[active].id].ground, duration: 0.8, ease: 'power2.out' })
      gsap.killTweensOf([out, inc])
      gsap.to(out, { autoAlpha: 0, y: -30 * dir, duration: 0.45, ease: 'power2.in' })
      gsap.set(inc, { autoAlpha: 1, y: 0 })
      gsap.timeline()
        .fromTo(inc.querySelector('.fc-motif'), { scale: 0.85, opacity: 0, rotate: -6 * dir }, { scale: 1, opacity: 1, rotate: 0, duration: 1.1, ease: 'expo.out' }, 0.15)
        .fromTo(inc.querySelector('.fc-num'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.2)
        .fromTo(inc.querySelector('.fc-rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, 0.2)
        .fromTo(inc.querySelectorAll('.fc-char'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, 0.25)
        .fromTo(inc.querySelectorAll('.fc-fade'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'expo.out' }, 0.45)
    }, stage)
    return () => ctx.kill() // let the tweens finish visually if state changes again; no revert (would undo visibility)
  }, [active, reduce])

  const jump = (i) => {
    const s = st.current
    if (!s) return
    scrollToY(s.start + ((s.end - s.start) * i) / (N - 1) + 2)
  }

  return (
    <section id="focus" ref={ref} aria-labelledby="focus-title" className="relative">
      <div className="g-ivory">
        <div className="focus-head frame grid gap-8 pb-16 pt-24 sm:pb-20 sm:pt-32 lg:grid-cols-12 lg:items-end lg:pb-24 lg:pt-40">
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
      </div>

      {reduce ? <StaticList /> : (
        <div ref={stage} className="relative h-[100svh] min-h-[600px] overflow-hidden text-[#09325A]" style={{ background: LOOK[focusAreas[0].id].ground }}>
          {/* fine grain + a soft vignette so the colour fields feel like light, not flat fills */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 70% 45%, rgba(255,255,255,.7), transparent 70%)' }} />

          <div className="frame relative flex h-full flex-col pb-5 pt-[72px] sm:pt-24">
            {/* tabs — tap to jump; the bar tracks progress */}
            <div className="shrink-0">
              <div role="tablist" aria-label="Core areas" className="grid grid-cols-3 gap-2">
                {focusAreas.map((a, i) => (
                  <button key={a.id} role="tab" type="button" aria-selected={active === i} onClick={() => jump(i)}
                    className={`min-h-[44px] text-left font-mono text-[10.5px] uppercase leading-tight tracking-[0.12em] transition-colors sm:text-[11.5px] ${active === i ? 'text-[#09325A]' : 'text-[#09325A]/45 hover:text-[#09325A]/80'}`}>
                    <span className="tabular-nums">{a.n}</span> <span className="hidden sm:inline">· </span><br className="sm:hidden" />{a.title}
                  </button>
                ))}
              </div>
              <div className="mt-1 h-[2px] w-full bg-[#09325A]/12">
                <div className="fc-progress h-full origin-left transition-colors duration-500" style={{ transform: `scaleX(${1 / N})`, background: LOOK[focusAreas[active].id].accent }} />
              </div>
            </div>

            <div className="relative mt-4 flex-1 sm:mt-6">
              {focusAreas.map((a, i) => <Chapter key={a.id} area={a} index={i} active={active === i} />)}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
