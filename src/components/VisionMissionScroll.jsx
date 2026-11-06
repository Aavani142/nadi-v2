import { useRef } from 'react'
import { org, photos } from '../data/nadi.js'
import { gsap, useGsap } from '../lib/gsap.js'
import { Img } from './ui.jsx'

/**
 * Vision · Mission · Commitment — a pinned, scroll-driven sequence.
 * While the section is pinned, each chapter: crossfades its photograph in, fills its title with light
 * from left to right, lifts the previous titles up the stack (dimmed), and brightens its statement
 * word by word. All copy is NADI's own (pamphlet, Annual Report 2025–2026 Director's Message).
 * The same pinned sequence on every device (positions adapt to the screen; scrolling stays natural —
 * the scrub follows the visitor's own scroll). Reduced motion: the chapters stacked, static.
 */
export const CHAPTERS = [
  {
    key: 'vision', label: 'Vision',
    statement: org.vision + '.',
    body: org.intro,
    photo: photos.teamNight,
  },
  {
    key: 'mission', label: 'Mission',
    statement: org.mission + '.',
    body: 'Building resilient community structures through professional, measurable development programmes — working at the grassroots and holding that work to standards of transparency, accountability and long-term impact.',
    photo: photos.campus,
  },
  {
    key: 'commitment', label: 'Commitment',
    statement: `“${org.commitment}”`,
    body: "From the Director's Message, NADI Foundation Annual Report 2025–2026.",
    photo: photos.learningPlay,
  },
]
const N = CHAPTERS.length

function Words({ text, className = '' }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.split(' ').map((w, i) => <span key={i} className="vm-w">{w} </span>)}</span>
    </span>
  )
}

export default function VisionMissionScroll({ id }) {
  const ref = useRef(null)

  useGsap(ref, () => {
    const mm = gsap.matchMedia()

    // ── The pinned, scrubbed sequence — identical on every device; only the pin length adapts ──
    mm.add({ wide: '(min-width: 1024px)', narrow: '(max-width: 1023px)' }, ({ conditions }) => {
      const lineH = () => ref.current.querySelector('.vm-title').offsetHeight
      const descs = gsap.utils.toArray('.vm-desc')
      const bgs = gsap.utils.toArray('.vm-bg')
      const fills = gsap.utils.toArray('.vm-fill')
      const bases = gsap.utils.toArray('.vm-base')

      gsap.set(bgs, { opacity: (i) => (i ? 0 : 1) })
      gsap.set(descs, { autoAlpha: (i) => (i ? 0 : 1) })
      gsap.set(fills, { clipPath: 'inset(0% 100% 0% 0%)' })
      gsap.set(bases, { opacity: (i) => (i ? 0 : 1) })
      gsap.set('.vm-w', { opacity: 0.18 })
      gsap.set('.vm-stack', { y: () => -lineH() }) // chapter 0 sits on the rule; later titles wait below it

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.vm-pinned', start: 'top top', end: () => `+=${window.innerHeight * N * (conditions.wide ? 1.15 : 0.95)}`,
          pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        },
      })
      CHAPTERS.forEach((_, i) => {
        const at = i * 1.0
        if (i > 0) {
          tl.to(descs[i - 1], { autoAlpha: 0, y: -24, duration: 0.25 }, at)
            .to(fills[i - 1], { opacity: 0, duration: 0.25 }, at)
            .to(bases[i - 1], { opacity: 0.22, duration: 0.25 }, at)
            .to(bgs[i - 1], { opacity: 0, duration: 0.35 }, at)
            .to('.vm-stack', { y: () => -lineH() * (i + 1), duration: 0.35, ease: 'power2.inOut' }, at)
            .to(bgs[i], { opacity: 1, duration: 0.35 }, at)
            .to(bases[i], { opacity: 1, duration: 0.2 }, at + 0.1)
            .fromTo(descs[i], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.15)
        }
        tl.to(fills[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45 }, at + 0.15)
          .to(descs[i].querySelectorAll('.vm-w'), { opacity: 1, stagger: 0.02, duration: 0.15 }, at + 0.2)
        tl.fromTo(bgs[i].querySelector('img'), { scale: 1.12 }, { scale: 1, duration: 1.2 }, at)
      })
      tl.to('.vm-progress', { scaleX: 1, duration: N, ease: 'none' }, 0)
      tl.to({}, { duration: 0.35 })
    })
  })

  return (
    <section id={id} ref={ref} aria-labelledby="vm-title" className="relative overflow-hidden bg-navy-deep text-ivory">
      <h2 id="vm-title" className="sr-only">Our vision, mission and commitment</h2>

      {/* ── pinned sequence (all devices) ── */}
      <div className="vm-pinned relative h-[100svh] min-h-[560px] motion-reduce:hidden">
        {CHAPTERS.map((c) => (
          <div key={c.key} className="vm-bg absolute inset-0" aria-hidden="true">
            <Img photo={c.photo} sizes="100vw" alt="" />
          </div>
        ))}
        <div aria-hidden="true" className="absolute inset-0 bg-[#073058]/35" />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,48,88,.15) 0%, rgba(7,48,88,.55) 45%, rgba(7,48,88,.92) 100%), linear-gradient(to right, rgba(7,48,88,.55), rgba(7,48,88,0) 60%)' }} />

        <div className="frame relative h-full">
          <div className="absolute inset-x-5 top-[54%] sm:inset-x-8 lg:inset-x-12">
            <div className="h-px w-full bg-ivory/20" />
            <div className="vm-progress absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ivory/80" />
          </div>
          <p className="eyebrow absolute left-5 top-[54%] mt-4 text-ivory/60 sm:left-8 lg:left-12">Our</p>
          <div className="absolute left-5 right-5 top-[54%] sm:left-8 lg:left-24 lg:right-auto">
            <div className="vm-stack">
              {CHAPTERS.map((c) => (
                <h3 key={c.key} className="vm-title relative font-display text-[clamp(2.6rem,min(9.5vw,13svh),7.8rem)] font-extrabold uppercase leading-[0.95] tracking-[0.01em]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <span className="vm-base block text-ivory/25">{c.label}</span>
                  <span aria-hidden="true" className="vm-fill absolute inset-0 block text-ivory">{c.label}</span>
                </h3>
              ))}
            </div>
          </div>
          <div className="absolute left-5 right-5 top-[54%] mt-12 sm:left-8 md:left-auto md:right-8 md:mt-6 md:w-[min(44vw,560px)] lg:right-12 lg:w-[min(42vw,560px)]">
            {CHAPTERS.map((c) => (
              <div key={c.key} className="vm-desc absolute inset-x-0 top-0">
                <p className="accent text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.08] text-ivory"><Words text={c.statement} /></p>
                <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ivory/70 sm:text-[15.5px]"><Words text={c.body} /></p>
              </div>
            ))}
          </div>
          <p className="eyebrow absolute bottom-6 left-5 right-5 text-ivory/45 sm:left-8 lg:left-12">NADI Foundation · Pamphlet &amp; Annual Report 2025–2026</p>
        </div>
      </div>

      {/* ── reduced motion only: the same chapters, stacked and static ── */}
      <div className="hidden motion-reduce:block">
        {CHAPTERS.map((c, i) => (
          <article key={c.key} className="vs-chapter relative flex min-h-[86svh] flex-col justify-end overflow-hidden sm:min-h-[72svh]">
            <div aria-hidden="true" className="absolute inset-0">
              <Img photo={c.photo} sizes="100vw" alt="" />
            </div>
            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,48,88,.96) 0%, rgba(7,48,88,.85) 42%, rgba(7,48,88,.3) 75%, rgba(7,48,88,.5) 100%)' }} />
            <div className="frame relative pb-14 pt-28 sm:pb-16">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-ivory/65">Our</p>
                <p className="eyebrow tabular-nums text-ivory/45">{String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</p>
              </div>
              <h3 className="relative mt-3 font-display text-[clamp(2.8rem,13vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-[0.01em]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <span className="block text-ivory/25">{c.label}</span>
                <span aria-hidden="true" className="vs-fill absolute inset-0 block text-ivory">{c.label}</span>
              </h3>
              <div className="vs-rule mt-4 h-px origin-left bg-ivory/40" />
              <div className="mt-6 sm:grid sm:grid-cols-2 sm:gap-10">
                <p className="vs-text accent text-[clamp(1.6rem,6.4vw,2.4rem)] leading-[1.1]">{c.statement}</p>
                <p className="vs-text mt-4 text-[15.5px] leading-relaxed text-ivory/75 sm:mt-1">{c.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
