import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { leadership as L, org } from '../data/nadi.js'
import { gsap, revealIn, useGsap, distanceScale } from '../lib/gsap.js'
import { Img } from './ui.jsx'
import { Doodled, Doodle } from './Doodle.jsx'

/**
 * A MESSAGE FROM THE DIRECTOR — every sentence here is a verbatim excerpt from the Director's Message
 * in the NADI Annual Report 2025–2026 (data/nadi.js → leadership, org.commitment). The full message
 * appears on the About page once NADI supplies the approved text.
 */
export default function DirectorSection() {
  const ref = useRef(null)
  useGsap(ref, () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true } })
    tl.from('.dm-title', { yPercent: 110, duration: 1.2, stagger: 0.08 })
      .fromTo('.dm-photo', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0.1)
      .fromTo('.dm-photo img', { scale: 1.3 }, { scale: 1, duration: 2 }, 0.1)
      .from('.dm-word', { yPercent: 105, opacity: 0, duration: 1, stagger: 0.022 }, 0.5)
      .from('.dm-rule', { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, 0.9)
    gsap.to('.dm-photo-wrap', { y: -50 * distanceScale(), ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    revealIn(ref.current)
  })

  return (
    <section id="director" ref={ref} aria-labelledby="director-title" className="g-ivory relative overflow-hidden pb-28 pt-24 sm:pb-36 sm:pt-32 lg:pb-44 lg:pt-40">
      <div className="frame">
        <p className="eyebrow flex items-center gap-3 text-accent"><span aria-hidden="true" className="h-px w-8 bg-current" />Director's message</p>
        <h2 id="director-title" className="display mt-6 text-[clamp(2.6rem,6vw,6rem)] leading-[0.9] text-heading">
          <span className="block overflow-hidden pb-[0.05em]"><span className="dm-title block">A message from</span></span>
          <Doodled kind="underline" delay={1}><span className="block overflow-hidden pb-[0.08em]"><span className="dm-title accent block text-accent">the Director.</span></span></Doodled>
        </h2>

        <div className="mt-12 grid gap-12 sm:mt-16 md:grid-cols-12 md:gap-8 lg:mt-24">
          <figure className="dm-photo-wrap mx-auto w-full max-w-[420px] md:col-span-5 md:max-w-none lg:col-span-4">
            <div className="dm-photo relative aspect-[4/5] overflow-hidden rounded-[6px] bg-surface">
              <Img photo={L.director.photo} sizes="(min-width:1024px) 30vw, 90vw" className="object-top" />
            </div>
            <figcaption className="mt-5 border-t border-heading/80 pt-4">
              <p className="font-display text-[1.9rem] font-bold leading-none tracking-[-0.04em] text-heading">{L.director.name}</p>
              <p className="eyebrow mt-2 text-accent">{L.director.role}, NADI Foundation</p>
            </figcaption>
          </figure>

          <div className="md:col-span-7 md:pt-2 lg:col-span-7 lg:col-start-6 lg:pt-4">
            <blockquote>
              <p className="font-serif text-[clamp(1.75rem,3.3vw,3.1rem)] font-light leading-[1.14] tracking-[-0.02em] text-heading">
                <span className="sr-only">{L.quote}</span>
                <span aria-hidden="true">
                  <span className="text-accent">“</span>
                  {L.quote.split(' ').map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top"><span className="dm-word inline-block">{w}&nbsp;</span></span>
                  ))}
                  <span className="text-accent">”</span>
                </span>
              </p>
              <span aria-hidden="true" className="dm-rule mt-10 block h-px w-full origin-left bg-heading/20" />
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <p data-reveal className="text-[16px] leading-relaxed text-fg/75">“{L.message}”</p>
                <p data-reveal data-delay="0.1" className="text-[16px] leading-relaxed text-fg/75">“{org.commitment}”</p>
              </div>
              <footer data-reveal className="mt-8 text-[12.5px] text-fg/50">Excerpts from the Director's Message, NADI Foundation Annual Report 2025–2026.</footer>
            </blockquote>
            <Link data-reveal to="/about#director" className="group mt-8 inline-flex min-h-[48px] items-center gap-2 text-[15px] font-semibold text-accent">
              Read more on the About page
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
