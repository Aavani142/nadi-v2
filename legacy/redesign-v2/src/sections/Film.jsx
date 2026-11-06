import { useRef } from 'react'
import { photos } from '../data/nadi.js'
import { gsap, useGsap } from '../lib/motion.js'
import { Img, SplitWords } from '../components/ui.jsx'

/**
 * A framed photograph that opens to full-bleed as you scroll, pinned for one screen.
 * Bridges the light hero into the dark About section.
 */
export default function Film() {
  const root = useRef(null)

  useGsap(root, () => {
    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, ({ conditions }) => {
      const from = conditions.desktop ? 'inset(12% 20% 12% 20% round 28px)' : 'inset(14% 5% 14% 5% round 20px)'
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=110%', scrub: 0.8, pin: true },
      })
      tl.fromTo('.film-clip', { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 })
        .fromTo('.film-img', { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .from('.film-shade', { opacity: 0, duration: 0.4 }, 0.55)
        .from('.film-text .w-in', { yPercent: 115, stagger: 0.04, duration: 0.35, ease: 'power3.out' }, 0.6)
        .from('.film-cap', { opacity: 0, y: 12, duration: 0.3 }, 0.75)
    })
  })

  return (
    <section ref={root} aria-label="The NADI team" className="relative h-[100svh] overflow-hidden bg-paper">
      <div className="film-clip absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(3% 3% 3% 3% round 20px)' }}>
        <Img photo={photos.teamNight} sizes="100vw" className="film-img h-full w-full object-cover" />
        <div className="film-shade absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="frame absolute inset-x-0 bottom-0 pb-10 text-paper sm:pb-14">
          <p className="film-text display max-w-[16ch] text-[11vw] uppercase sm:text-[7.5vw] lg:text-[6.2vw]">
            <SplitWords text="Built by the young." />
          </p>
          <p className="film-cap mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-paper/75">
            <span className="kicker">The NADI team · Thiruvananthapuram</span>
            <span>Founded 10 September 2022</span>
          </p>
        </div>
      </div>
    </section>
  )
}
