import { useRef } from 'react'
import { ArrowDownRight } from 'lucide-react'
import { focusAreas, initiatives, photos } from '../data/nadi.js'
import { gsap, revealIn, useGsap } from '../lib/gsap.js'
import { Img } from './ui.jsx'
import { scrollToInitiative, INITIATIVE_IDS } from './InitiativesSection.jsx'
import { Doodled, Doodle } from './Doodle.jsx'

/** Muted, area-specific accents — used only on the number and rule, never as a ground. */
const LOOK = {
  'mental-health': { tone: '#B0674F', second: photos.kappinessGarden, secondCaption: 'Kappiness, Vazhuthacaud', layout: 'a' },
  education: { tone: '#3F6E55', second: photos.prabodhiniClass, secondCaption: 'A Prabodhini classroom', layout: 'b' },
  community: { tone: '#0468B1', second: photos.hivDay, secondCaption: 'An HIV/AIDS awareness campaign', layout: 'c' },
}

function Area({ area }) {
  const look = LOOK[area.id]
  const flip = look.layout === 'b'
  const main = {
    a: 'aspect-[4/3] md:aspect-[4/5] md:col-span-6 lg:aspect-[16/11] lg:col-span-7',
    b: 'aspect-[4/3] md:aspect-[4/5] md:col-span-6 md:col-start-7 md:row-start-1 lg:col-span-5 lg:col-start-8',
    c: 'aspect-[4/3] md:aspect-[4/5] md:col-span-6 lg:aspect-[16/9] lg:col-span-8',
  }[look.layout]
  const text = {
    a: 'md:col-span-6 md:col-start-7 lg:col-span-4 lg:col-start-9',
    b: 'md:col-span-6 md:col-start-1 md:row-start-1 lg:col-span-5',
    c: 'md:col-span-6 md:col-start-7 lg:col-span-3 lg:col-start-10',
  }[look.layout]

  return (
    <article id={`focus-${area.id}`} className="grid items-end gap-12 md:grid-cols-12 md:gap-8">
      <figure className={`relative ${main}`}>
        <div data-reveal-img={flip ? 'left' : undefined} className="relative h-full w-full overflow-hidden rounded-[6px]">
          <Img photo={area.photo} sizes="(min-width:1024px) 55vw, 92vw" />
        </div>
        {/* second photograph, offset and drifting against the scroll */}
        <div data-parallax="40"
          className={`absolute bottom-[-8%] w-[34%] ${flip ? 'left-3 lg:-left-[12%]' : 'right-3 md:-right-[6%]'}`}>
          <div className="overflow-hidden rounded-[4px] border-[6px] border-page shadow-[0_24px_50px_-28px_rgba(6,29,53,.5)]">
            <div className="aspect-[4/5]"><Img photo={look.second} sizes="(min-width:1024px) 18vw, 32vw" /></div>
          </div>
        </div>
        <figcaption className={`mt-4 text-[12.5px] text-fg/55 ${flip ? 'lg:text-right' : ''}`}>{area.caption}</figcaption>
      </figure>

      <div className={text}>
        <div data-reveal className="flex items-baseline gap-4">
          <span className="display text-[clamp(3rem,5vw,4.4rem)] leading-none" style={{ color: look.tone }}>{area.n}</span>
          <span className="h-px flex-1" style={{ background: look.tone, opacity: 0.4 }} />
        </div>
        <div data-reveal-lines className="mt-5">
          <h3 className="display text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.92] text-heading">
            <span className="block overflow-hidden pb-[0.06em]"><span data-line className="block">{area.title}</span></span>
            {area.sub && <span className="block overflow-hidden"><span data-line className="accent block text-[0.62em] text-fg/70">{area.sub}</span></span>}
          </h3>
        </div>
        <p data-reveal className="mt-5 text-[16px] leading-relaxed text-fg/75">{area.text}</p>
        <ul data-reveal className="eyebrow mt-5 flex flex-wrap gap-x-3 gap-y-1 text-fg/55">
          {area.keywords.map((k, i) => <li key={k}>{k}{i < area.keywords.length - 1 && <span aria-hidden="true" className="ml-3">·</span>}</li>)}
        </ul>
        <ul data-reveal className="mt-7 border-t border-fg/10">
          {area.initiatives.map((key) => (
            <li key={key} className="border-b border-fg/10">
              <a href={`#work-${INITIATIVE_IDS[key]}`} onClick={(e) => { e.preventDefault(); scrollToInitiative(INITIATIVE_IDS[key]) }}
                className="group flex min-h-[48px] items-center justify-between py-3 text-[15px] font-semibold text-heading">
                <span className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">{initiatives[key].name}</span>
                <ArrowDownRight size={16} className="text-fg/35 transition-colors group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function FocusSection() {
  const ref = useRef(null)
  useGsap(ref, () => {
    gsap.from('.focus-line', { yPercent: 110, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: '.focus-head', start: 'top 80%', once: true } })
    revealIn(ref.current)
  })

  return (
    <section id="focus" ref={ref} aria-labelledby="focus-title" className="g-ivory relative overflow-hidden pb-32 pt-24 sm:pt-32 lg:pb-44 lg:pt-40">
      <div className="frame">
        <div className="focus-head grid gap-10 lg:grid-cols-12 lg:items-end">
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

        <div className="mt-16 grid gap-24 sm:mt-24 md:gap-32 lg:mt-36 lg:gap-44">
          {focusAreas.map((a) => <Area key={a.id} area={a} />)}
        </div>
      </div>
    </section>
  )
}
