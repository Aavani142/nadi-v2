import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { leadership as L } from '../data/nadi.js'
import { ImageReveal, Reveal, WordsOnScroll } from '../lib/Motion.jsx'
import { Eyebrow, Img, Lines } from './ui.jsx'

export default function LeadershipSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], [80, -40])
  const yB = useTransform(scrollYProgress, [0, 1], [140, -100])

  return (
    <section id="team" ref={ref} className="g-leaf relative overflow-hidden pb-28 pt-24 sm:pt-32 lg:pb-40 lg:pt-40">
      <div className="frame relative">
        <Eyebrow>Team</Eyebrow>
        <Lines className="display mt-10 max-w-4xl text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.95]"
          lines={['The people', <span key="i" className="accent text-accent">behind NADI.</span>]} />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* Director */}
          <motion.figure style={{ y: yA }} className="lg:col-span-5">
            <div className="relative">
              <div aria-hidden="true" className="absolute -left-4 -top-4 h-full w-full rounded-t-full bg-tint" />
              <ImageReveal className="relative aspect-[4/5] rounded-t-full bg-page">
                <Img photo={L.director.photo} sizes="(min-width:1024px) 36vw, 92vw" className="object-top" />
              </ImageReveal>
            </div>
            <figcaption className="mt-6 flex items-end justify-between gap-4 border-t-2 border-heading pt-4">
              <span className="font-display text-[clamp(2rem,3.4vw,3rem)] font-bold leading-none tracking-[-0.04em]">{L.director.name}</span>
              <span className="eyebrow pb-1 text-accent">{L.director.role}</span>
            </figcaption>
          </motion.figure>

          {/* Message + co-founders */}
          <div className="flex flex-col lg:col-span-6 lg:col-start-7 lg:pt-10">
            <span aria-hidden="true" className="font-serif text-[7rem] leading-[0.6] text-accent">“</span>
            <blockquote>
              <WordsOnScroll text={L.quote} className="font-serif text-[clamp(1.6rem,2.8vw,2.6rem)] font-light leading-[1.18] tracking-[-0.02em]" />
              <Reveal>
                <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-fg/65">“{L.message}”</p>
                <footer className="eyebrow mt-5 text-fg/50">— Director’s Message, Annual Report 2025–2026</footer>
              </Reveal>
            </blockquote>

            <motion.ul style={{ y: yB }} className="mt-16 grid grid-cols-2 gap-6 sm:gap-10 lg:mt-auto lg:pt-16">
              {L.cofounders.map((c, k) => (
                <Reveal as="li" key={c.name} delay={k * 0.12} className={k === 1 ? 'mt-14' : ''}>
                  <figure className="group">
                    <div className="aspect-square overflow-hidden rounded-full bg-page ring-[6px]" style={{ ["--tw-ring-color"]: k ? "#10589A" : "#0468B1" }}>
                      <Img photo={c.photo} sizes="(min-width:1024px) 20vw, 44vw" className="object-top grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0" />
                    </div>
                    <figcaption className="mt-4">
                      <p className="font-display text-[clamp(1.25rem,2vw,1.7rem)] font-bold leading-tight tracking-[-0.03em]">{c.name}</p>
                      <p className="eyebrow mt-1.5 text-accent">{c.role}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  )
}
