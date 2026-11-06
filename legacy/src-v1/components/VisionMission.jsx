import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { org, photos } from '../data/nadi.js'
import { Img, Lines, EASE } from './ui.jsx'
import { Clay } from './Clay.jsx'
import { ImageReveal, Reveal, WordsOnScroll } from '../lib/Motion.jsx'

/** A thin rule that draws itself in when it enters view. */
function Rule({ className = '' }) {
  return (
    <motion.span aria-hidden="true" className={`block h-px origin-left ${className}`}
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.2, ease: EASE }} />
  )
}

function Statement({ n, label, lines, tone }) {
  const dark = tone === 'dark'
  return (
    <div className={`relative overflow-hidden flex flex-col justify-between px-5 py-14 sm:px-10 lg:min-h-[86vh] lg:px-14 lg:py-20 ${dark ? 'g-coral text-white' : 'g-sun text-heading'}`}>
      <div>
        <div className={`flex items-baseline justify-between text-[12px] font-semibold uppercase tracking-[0.2em] ${dark ? 'text-white/70' : 'text-heading/60'}`}>
          <span>{label}</span>
          <span className="tabular-nums">{n}</span>
        </div>
        <Rule className={`mt-4 ${dark ? 'bg-white/35' : 'bg-heading/25'}`} />
      </div>
      {/* poster clay object, bleeding off the panel edge */}
      <Clay kind={dark ? 'hands' : 'wave'} float
        className={`absolute ${dark ? '-bottom-6 -right-10 w-56 sm:w-80' : 'right-6 top-24 w-32 lg:right-12 lg:top-32 lg:w-52'}`} />
      <Lines as="p" stagger={0.12}
        className="display relative z-10 mt-12 text-[clamp(3.2rem,7.2vw,7.6rem)] leading-[0.9] lg:mt-20"
        lines={lines.map((l, i) => (i === lines.length - 1
          ? <span key={i} className={`accent ${dark ? 'text-sun' : 'text-accent'}`}>{l}</span>
          : l))} />
    </div>
  )
}

export default function VisionMission() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section ref={ref} aria-label="Vision and mission" className="relative bg-page">
      <h2 className="sr-only">Our vision and mission</h2>
      <div className="grid lg:grid-cols-2">
        <Statement n="01" label="Our vision" tone="light" lines={['Equity,', 'Equality', '& Innovation.']} />
        <Statement n="02" label="Our mission" tone="dark" lines={['Collective', 'Action &', 'Sustainability.']} />
      </div>

      {/* a real moment, full width */}
      <figure className="relative">
        <ImageReveal className="h-[56vw] max-h-[620px] overflow-hidden">
          <motion.div className="h-[112%] w-full -translate-y-[6%]" style={{ y: photoY }}>
            <Img photo={photos.volunteersMural} sizes="100vw" />
          </motion.div>
        </ImageReveal>
        <figcaption className="frame flex items-center justify-between py-4 text-[12.5px] text-fg/60">
          <span>Youth for Action volunteers, Thiruvananthapuram</span>
          <span className="hidden sm:inline">NADI Foundation · Annual Report 2025–2026</span>
        </figcaption>
      </figure>

      {/* Commitment — verbatim from the Director's Message */}
      <div className="frame grid gap-8 pb-24 pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-20">
        <div className="lg:col-span-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-heading/60">Our commitment</p>
          <Rule className="mt-4 bg-heading/25" />
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <WordsOnScroll text={org.commitment} className="font-display text-[clamp(1.9rem,3.6vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.03em] text-heading" />
          <Reveal>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-fg/70">
              NADI works to build resilient community structures through professional, measurable development programmes — rooted in empathy, inclusion and social justice.
            </p>
            <p className="mt-4 text-[12px] text-fg/50">Director's Message, Annual Report 2025–2026 · NADI Foundation pamphlet</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
