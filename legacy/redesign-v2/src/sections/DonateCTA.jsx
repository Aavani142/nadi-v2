import { useRef } from 'react'
import { ctas, donateLink } from '../data/nadi.js'
import { gsap, useGsap } from '../lib/motion.js'
import { Button } from '../components/ui.jsx'

const PHRASE = 'Keep the river moving'

export default function DonateCTA() {
  const root = useRef(null)

  useGsap(root, () => {
    gsap.fromTo('.cta-line-a', { xPercent: 0 }, {
      xPercent: -22, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.fromTo('.cta-line-b', { xPercent: -22 }, {
      xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.from('.cta-body > *', {
      y: 30, opacity: 0, stagger: 0.08, duration: 1.2,
      scrollTrigger: { trigger: '.cta-body', start: 'top 85%' },
    })
  })

  const line = (cls, outline) => (
    <p aria-hidden className={`${cls} display flex w-max whitespace-nowrap text-[19vw] uppercase leading-[0.82] sm:text-[15vw]`}>
      {[0, 1, 2].map((k) => (
        <span key={k} className={`pr-[0.25em] ${outline ? 'text-transparent [-webkit-text-stroke:2px_#0B1020]' : ''}`}>
          {PHRASE}<span className="text-paper">.</span>
        </span>
      ))}
    </p>
  )

  return (
    <section aria-labelledby="cta-title" className="overflow-hidden bg-ember py-24 text-ink sm:py-32">
      <h2 id="cta-title" className="sr-only">{PHRASE}. Donate to NADI Foundation.</h2>
      {line('cta-line-a', false)}
      {line('cta-line-b', true)}

      <div className="cta-body frame mt-16 grid gap-10 sm:mt-24 md:grid-cols-12 md:items-end">
        <p className="max-w-xl text-2xl font-medium leading-snug tracking-[-0.02em] sm:text-3xl md:col-span-7">
          Your support funds counselling, classrooms, skills training and youth-led action across Kerala. NADI is 12A &amp; 80G certified.
        </p>
        <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
          <Button to={donateLink.path} variant="ink" size="lg">Donate</Button>
          <Button href={ctas.volunteer.href} variant="ghostDark" size="lg">Volunteer</Button>
        </div>
      </div>
    </section>
  )
}
