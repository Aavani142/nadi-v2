import { useRef } from 'react'
import { motion } from 'framer-motion'
import { leadership } from '../data/nadi.js'
import { EXPO, gsap, useGsap } from '../lib/motion.js'
import { Img, Kicker } from '../components/ui.jsx'

const PEOPLE = [leadership.director, ...leadership.cofounders]

export default function Team() {
  const root = useRef(null)

  useGsap(root, () => {
    gsap.from('.q-word', {
      yPercent: 110, opacity: 0, stagger: 0.025, duration: 1.2,
      scrollTrigger: { trigger: '.quote', start: 'top 80%' },
    })
  })

  return (
    <section id="team" ref={root} aria-labelledby="team-title" className="bg-paper-dim py-28 sm:py-40">
      <div className="frame">
        <Kicker n="06" className="text-ink/60"><span id="team-title">Team</span></Kicker>

        <figure className="mt-12 sm:mt-16">
          <blockquote className="quote italic-serif max-w-[30ch] text-[clamp(2.1rem,4.8vw,4.6rem)] leading-[1.04] text-ink">
            <span className="sr-only">{leadership.quote}</span>
            <span aria-hidden>
              <span className="text-river">“</span>
              {leadership.quote.split(' ').map((w, i) => (
                <span key={i} className="line-mask inline-block align-top">
                  <span className="q-word inline-block">{w}&nbsp;</span>
                </span>
              ))}
              <span className="text-river">”</span>
            </span>
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <span className="h-px w-10 bg-ink/40" />
            <span className="text-sm"><strong className="font-semibold">{leadership.director.name}</strong> <span className="text-ink/60">— {leadership.director.role}, Annual Report 2025–26</span></span>
          </figcaption>
        </figure>

        <div className="mt-20 grid gap-12 border-t border-ink/15 pt-10 sm:mt-28 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h3 className="display text-5xl uppercase sm:text-6xl">The founders</h3>
            <p className="mt-5 max-w-sm leading-relaxed text-ink/70">{leadership.message}</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:col-span-8">
            {PEOPLE.map((p, i) => (
              <motion.li
                key={p.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 1.1, ease: EXPO, delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-[6px] bg-paper-line">
                  <Img
                    photo={p.photo}
                    sizes="(min-width: 1024px) 20vw, 45vw"
                    className="h-full w-full object-cover grayscale transition-[filter,transform] duration-700 ease-expo group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                </div>
                <p className="mt-4 font-semibold tracking-[-0.01em]">{p.name}</p>
                <p className="text-sm text-ink/60">{p.role}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
