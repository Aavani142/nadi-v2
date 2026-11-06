import { useRef } from 'react'
import { initiatives, photos, stories } from '../data/nadi.js'
import { gsap, useGsap } from '../lib/motion.js'
import { Img, Kicker, SplitWords, TextLink } from '../components/ui.jsx'

const ITEMS = [
  stories.featured,
  { photo: photos.ekatvaConvocation, tag: 'EKATVA · Ernakulam', title: 'Convocation day', text: '17 transgender beneficiaries who completed the beautician programme were recognised with certificates on 12 June 2026.' },
  stories.grid[0],
  { photo: photos.kappinessReading, tag: 'Kappiness', title: "India's first mental health café", text: initiatives.kappiness.lede },
  ...stories.grid.slice(1),
]

export default function Stories() {
  const root = useRef(null)
  const track = useRef(null)

  useGsap(root, () => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const el = track.current
      gsap.set(el, { overflow: 'visible' })
      const distance = () => el.scrollWidth - window.innerWidth
      const tween = gsap.to(el, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => `+=${distance()}`,
          pin: true, scrub: 0.6, invalidateOnRefresh: true,
        },
      })
      gsap.to('.stories-bar', {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      })
      // Photos drift inside their frames as the reel moves
      gsap.utils.toArray('.story-img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -7 }, {
          xPercent: 7, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        })
      })
    })
    gsap.from('.stories-title .w-in', {
      yPercent: 115, stagger: 0.06, duration: 1.4,
      scrollTrigger: { trigger: root.current, start: 'top 70%' },
    })
  })

  return (
    <section id="stories" ref={root} aria-labelledby="stories-title" className="grain relative overflow-hidden bg-ink text-paper">
      <div className="flex flex-col justify-center py-24 sm:py-32 lg:h-[100svh] lg:py-0">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 sm:scroll-px-8 sm:gap-8 sm:px-8 lg:snap-none lg:gap-12 lg:px-12"
          tabIndex={0}
          aria-label="Stories from the field — scroll sideways"
        >
          <header className="flex w-[84vw] shrink-0 snap-start flex-col justify-between sm:w-[58vw] lg:w-[34vw]">
            <div>
              <Kicker n="04" className="text-paper/60">Stories</Kicker>
              <h2 id="stories-title" className="stories-title display mt-8 text-[17vw] uppercase sm:text-[11vw] lg:text-[7.4vw] min-[1520px]:text-[112px]">
                <SplitWords text="From the" className="block" />
                <span className="line-mask block"><span className="w-in italic-serif inline-block normal-case text-river-light">field.</span></span>
              </h2>
            </div>
            <p className="mt-8 max-w-sm leading-relaxed text-paper/65">
              Campaigns, classrooms, convocations and quiet counselling rooms — a year of NADI’s work, as documented in our Annual Report.
            </p>
          </header>

          {ITEMS.map((s, i) => (
            <article key={s.title} className="group w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[29vw]">
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-ink-soft">
                <Img
                  photo={s.photo}
                  sizes="(min-width: 1024px) 30vw, 80vw"
                  className="story-img absolute inset-y-0 left-[-8%] h-full w-[116%] max-w-none object-cover transition-[filter] duration-700 group-hover:brightness-110"
                />
                <span className="kicker absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-paper backdrop-blur">{String(i + 1).padStart(2, '0')}</span>
              </figure>
              <p className="kicker mt-5 text-river-light">{s.tag}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">{s.title}</h3>
              <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-paper/60">{s.text}</p>
            </article>
          ))}

          <aside className="flex w-[70vw] shrink-0 snap-start flex-col justify-center sm:w-[40vw] lg:w-[24vw]">
            <p className="italic-serif text-5xl leading-none sm:text-6xl">More every week.</p>
            <p className="mt-4 text-paper/60">Follow the work as it happens.</p>
            <TextLink href="https://www.instagram.com/nadi.india/" className="mt-6 self-start">@nadi.india on Instagram</TextLink>
          </aside>
          <span aria-hidden className="w-px shrink-0 lg:w-12" />
        </div>

        <div className="frame mt-12 hidden lg:block">
          <div className="h-px w-full bg-paper/15">
            <div className="stories-bar h-px w-full origin-left scale-x-0 bg-paper" />
          </div>
        </div>
      </div>
    </section>
  )
}
