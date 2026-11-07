import { useRef } from 'react'
import { gsap, useGsap } from '../lib/gsap.js'
import { flipChars } from '../lib/aboutMotion.js'
import { CHAPTERS } from './VisionMissionScroll.jsx'
import { Img } from './ui.jsx'

/**
 * About page — Vision · Mission · Commitment as a horizontal journey (the homepage tells the same
 * three chapters vertically). While pinned, the track slides sideways chapter by chapter; each photo
 * drifts against the motion, each title flips in letter by letter as its panel arrives, and a
 * counter tracks the chapter. Same on every device; reduced motion stacks the panels.
 */
export default function VisionMissionJourney() {
  const ref = useRef(null)

  useGsap(ref, () => {
    const track = ref.current.querySelector('.vj-track')
    const panels = gsap.utils.toArray('.vj-panel')
    const move = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth), ease: 'none',
      scrollTrigger: {
        trigger: ref.current, start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        // snap to whole chapters so a panel never rests half-way
        snap: { snapTo: 1 / (panels.length - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut' },
        onUpdate: (self) => {
          const i = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)))
          const el = ref.current?.querySelector('.vj-count')
          if (el && el.dataset.i !== String(i)) { el.dataset.i = String(i); el.textContent = String(i + 1).padStart(2, '0') }
        },
      },
    })
    gsap.to('.vj-bar', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth}`, scrub: true } })
    panels.forEach((panel, i) => {
      // photo drifts against the travel
      gsap.fromTo(panel.querySelector('img'), { xPercent: 8 }, {
        xPercent: -8, ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
      })
      const title = panel.querySelector('.vj-title')
      const text = panel.querySelectorAll('.vj-text')
      if (i === 0) {
        flipChars(title, { trigger: ref.current })
        gsap.from(text, { x: 40, opacity: 0, filter: 'blur(8px)', duration: 1.1, stagger: 0.1, ease: 'expo.out', clearProps: 'filter', scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
      } else {
        const { tween } = flipChars(title, { stagger: 0.03, paused: true })
        // play as the panel reaches the middle of the screen
        gsap.timeline({ scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left 55%', once: true } })
          .add(() => tween.play())
          .from(text, { x: 40, opacity: 0, filter: 'blur(8px)', duration: 1, stagger: 0.1, ease: 'expo.out', clearProps: 'filter' }, 0.2)
      }
    })
  })

  return (
    <section aria-labelledby="vj-title" className="relative overflow-hidden bg-navy-deep text-ivory">
      <h2 id="vj-title" className="sr-only">Our vision, mission and commitment</h2>
      <div ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden motion-reduce:h-auto">
        <div className="vj-track flex h-full w-max motion-reduce:w-full motion-reduce:flex-col">
          {CHAPTERS.map((c, i) => (
            <article key={c.key} className="vj-panel relative h-full w-screen shrink-0 overflow-hidden motion-reduce:min-h-[80svh]">
              <div aria-hidden="true" className="absolute inset-[-4%]">
                <Img photo={c.photo} sizes="100vw" alt="" className="scale-110" />
              </div>
              <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(9,58,104,.94) 0%, rgba(9,58,104,.78) 45%, rgba(9,58,104,.35) 100%)' }} />
              <div className="frame relative flex h-full flex-col justify-center pb-16 pt-24">
                <p className="vj-text eyebrow text-ivory/60">Our {c.label.toLowerCase()}</p>
                <h3 className="vj-title mt-4 font-display text-[clamp(2.2rem,11vw,10rem)] font-extrabold uppercase leading-[0.9] tracking-[0.005em]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {c.label}
                </h3>
                <p className="vj-text accent mt-6 max-w-2xl text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.08]">{c.statement}</p>
                <p className="vj-text mt-5 max-w-xl text-[15.5px] leading-relaxed text-ivory/70">{c.body}</p>
              </div>
              <span aria-hidden="true" className="display pointer-events-none absolute -right-[2vw] bottom-[-0.12em] text-[38vw] leading-none text-ivory/[0.05] sm:text-[24vw]">{String(i + 1).padStart(2, '0')}</span>
            </article>
          ))}
        </div>
        {/* chapter counter + progress, fixed while the track moves */}
        <div className="frame pointer-events-none absolute inset-x-0 bottom-6 flex items-center gap-5 motion-reduce:hidden">
          <p className="font-mono text-[12px] tabular-nums tracking-[0.14em] text-ivory/70"><span className="vj-count" data-i="0">01</span> / {String(CHAPTERS.length).padStart(2, '0')}</p>
          <div className="h-px flex-1 bg-ivory/15"><div className="vj-bar h-px origin-left scale-x-0 bg-ivory/80" /></div>
          <p className="eyebrow hidden text-ivory/50 sm:block">Scroll →</p>
        </div>
      </div>
    </section>
  )
}
