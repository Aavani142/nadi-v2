import { useRef } from 'react'
import { leadership as L, impact } from '../data/nadi.js'
import { gsap, revealIn, useGsap, ScrollTrigger } from '../lib/gsap.js'
import { Img } from './ui.jsx'
import { Doodled, Doodle } from './Doodle.jsx'

/** Team — only the people documented in the Annual Report 2025–2026 (pp. 2–3). No invented bios. */
const PEOPLE = [L.director, ...L.cofounders]
const staff = impact.profile.items.find((i) => /staff/i.test(i.l))
const volunteers = impact.profile.items.find((i) => /volunteer/i.test(i.l))

export default function TeamSection() {
  const ref = useRef(null)
  useGsap(ref, () => {
    gsap.from('.tm-line', { yPercent: 110, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: '.tm-head', start: 'top 80%', once: true } })
    gsap.utils.toArray('.tm-card').forEach((card, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } })
      tl.fromTo(card.querySelector('.tm-photo'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', delay: i * 0.12 })
        .fromTo(card.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 1.8 }, '<')
        .from(card.querySelector('figcaption'), { y: 20, opacity: 0, duration: 1 }, '-=0.9')
    })
    // touch screens have no hover: a portrait colours in while it is in the centre of the screen
    gsap.matchMedia().add('(hover: none)', () => {
      gsap.utils.toArray('.tm-card').forEach((card) => ScrollTrigger.create({
        trigger: card, start: 'top 65%', end: 'bottom 35%',
        toggleClass: { targets: card.querySelector('img'), className: '!grayscale-0' },
      }))
    })
    revealIn(ref.current)
  })

  return (
    <section id="team" ref={ref} aria-labelledby="team-title" className="g-ivory relative overflow-hidden pb-28 pt-24 sm:pt-32 lg:pb-40 lg:pt-40">
      <div className="frame">
        <div className="tm-head grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow flex items-center gap-3 text-accent"><span aria-hidden="true" className="h-px w-8 bg-current" />Team</p>
            <h2 id="team-title" className="display mt-6 text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.9] text-heading">
              <span className="block overflow-hidden pb-[0.05em]"><span className="tm-line block">The people</span></span>
              <Doodled kind="squiggle" delay={1}><span className="block overflow-hidden pb-[0.08em]"><span className="tm-line accent block text-accent">behind NADI.</span></span></Doodled>
            </h2>
          </div>
          <p data-reveal className="text-[16px] leading-relaxed text-fg/70 lg:col-span-4 lg:pb-3">
            Founded and led by young people, NADI Foundation works with a staff of {staff?.v} and more than {volunteers?.v.toLocaleString('en-IN')} active volunteers ({impact.profile.context.toLowerCase()}, Annual Report 2025–2026).
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          {PEOPLE.map((p, i) => (
            <li key={p.name} className={`tm-card ${['col-span-2 sm:col-span-1 lg:col-span-5', 'sm:mt-12 lg:col-span-3 lg:col-start-7 lg:mt-24', 'sm:mt-24 lg:col-span-3 lg:mt-48'][i]}`}>
              <figure className="group">
                <div className="tm-photo aspect-[4/5] overflow-hidden rounded-[6px] bg-surface">
                  <Img photo={p.photo} sizes="(min-width:1024px) 34vw, (min-width:640px) 46vw, 92vw" className="object-top grayscale transition-[filter] duration-700 group-hover:grayscale-0" />
                </div>
                <figcaption className="mt-5 border-t border-heading/70 pt-4">
                  <p className="font-display text-[clamp(1.15rem,2.4vw,2.2rem)] font-bold leading-tight tracking-[-0.04em] text-heading">{p.name}</p>
                  <p className="eyebrow mt-2 text-accent">{p.role}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p data-reveal className="mt-14 text-[12.5px] text-fg/50">Names and roles as published in the NADI Foundation Annual Report 2025–2026. Further team profiles will be added as NADI supplies them.</p>
      </div>
    </section>
  )
}
