import { useRef } from 'react'
import { impact } from '../data/nadi.js'
import { gsap, useGsap, fmt } from '../lib/motion.js'
import { Kicker, SplitWords } from '../components/ui.jsx'

/** A figure that counts up from zero when it scrolls into view. Final value is in the markup. */
function Count({ v, s, className = '', plus = '' }) {
  return (
    <span className={`tabular ${className}`}>
      <span className="count" data-to={v}>{fmt(v)}</span>
      <span className={`text-ember ${plus}`}>{s}</span>
    </span>
  )
}

const [beneficiaries, volunteers, staff] = impact.profile.items

export default function Impact() {
  const root = useRef(null)

  useGsap(root, () => {
    gsap.from('.impact-title .w-in', {
      yPercent: 115, stagger: 0.06, duration: 1.4,
      scrollTrigger: { trigger: '.impact-title', start: 'top 85%' },
    })
    gsap.utils.toArray('.count').forEach((el) => {
      const to = Number(el.dataset.to)
      const o = { n: 0 }
      gsap.to(o, {
        n: to, duration: 2.2, ease: 'expo.out',
        onUpdate: () => (el.textContent = fmt(o.n)),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onStart: () => (el.textContent = '0'),
      })
      el.textContent = '0'
    })
    // The headline figure slides in against the scroll
    gsap.fromTo('.impact-hero', { xPercent: 8 }, {
      xPercent: -4, ease: 'none',
      scrollTrigger: { trigger: '.impact-hero', start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.from('.impact-cell', {
      y: 40, opacity: 0, stagger: 0.06, duration: 1.2,
      scrollTrigger: { trigger: '.impact-grid', start: 'top 85%' },
    })
  })

  return (
    <section id="impact" ref={root} aria-labelledby="impact-title" className="relative overflow-hidden bg-river py-28 text-paper sm:py-40">
      <div className="frame">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Kicker n="03" className="text-paper/70">Impact</Kicker>
            <h2 id="impact-title" className="impact-title display mt-8 text-[14vw] uppercase sm:text-[9vw] lg:text-[7.6vw] min-[1520px]:text-[116px]">
              <SplitWords text="Small acts," className="block" />
              <span className="line-mask block"><span className="w-in italic-serif inline-block normal-case">at scale.</span></span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-paper/70">
            Figures from the NADI Annual Report 2025–2026, each shown in the context it was reported in.
          </p>
        </div>
      </div>

      {/* Headline figure, full width */}
      <div className="mt-16 sm:mt-24">
        <p className="impact-hero frame flex flex-wrap items-end gap-x-8 gap-y-2">
          <Count v={beneficiaries.v} s={beneficiaries.s} plus="inline-block align-top text-[0.55em] leading-none" className="display text-[30vw] leading-[0.8] sm:text-[24vw] min-[1520px]:text-[340px]" />
          <span className="max-w-[16ch] pb-[2vw] text-xl font-medium leading-tight sm:text-2xl">{beneficiaries.l}</span>
        </p>
      </div>

      <div className="frame">
        <dl className="impact-grid mt-16 grid border-t border-paper/25 sm:grid-cols-3">
          {[volunteers, staff, { v: 4, s: '', l: 'Operational districts' }].map((it) => (
            <div key={it.l} className="impact-cell flex flex-col-reverse border-b border-paper/25 py-8 sm:border-b-0 sm:pr-8 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-8">
              <dt className="mt-2 text-paper/75">{it.l}</dt>
              <dd className="display text-7xl sm:text-8xl"><Count v={it.v} s={it.s} /></dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 grid gap-10 sm:mt-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker text-paper/70">{impact.yfa.context}</p>
            <p className="mt-4 max-w-sm text-2xl font-medium leading-snug tracking-[-0.02em]">{impact.yfa.note}.</p>
          </div>
          <dl className="impact-grid grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:col-span-8">
            {impact.yfa.items.map((it) => (
              <div key={it.l} className="impact-cell flex flex-col-reverse border-t border-paper/25 pt-5">
                <dt className="mt-2 text-sm leading-snug text-paper/75">{it.l}</dt>
                <dd className="display text-5xl sm:text-6xl"><Count v={it.v} s={it.s} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
