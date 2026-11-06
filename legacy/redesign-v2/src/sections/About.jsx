import { useRef } from 'react'
import { motion } from 'framer-motion'
import { org } from '../data/nadi.js'
import { gsap, useGsap, EXPO } from '../lib/motion.js'
import { Kicker } from '../components/ui.jsx'

// The statement, with the phrases that carry it set in the serif italic.
const STATEMENT = [
  ['A '], ['youth-driven', 'em'], [' organisation building resilient communities across Kerala — through '],
  ['mental health', 'em'], [', '], ['education', 'em'], [', youth leadership and sustainable development.'],
]

const FACTS = [
  { v: '2022', l: 'Established on 10 September 2022 in Thiruvananthapuram' },
  { v: '4', l: 'Districts: Thiruvananthapuram, Wayanad, Ernakulam, Pathanamthitta' },
  { v: 'ISO', l: '9001:2015 certified, affiliated with the Ministry of Youth Affairs and Sports' },
  { v: '80G', l: '12A & 80G certified — donations are eligible for tax benefits' },
]

export default function About() {
  const root = useRef(null)

  useGsap(root, () => {
    // Each word brightens as the statement passes through the viewport
    gsap.fromTo('.aw', { opacity: 0.14 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: '.statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
    })
  })

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="grain relative bg-ink py-28 text-paper sm:py-40">
      <div className="frame">
        <Kicker n="01" className="text-paper/60"><span id="about-title">About NADI</span></Kicker>

        <p className="statement mt-10 max-w-[24ch] text-[clamp(2.1rem,5.4vw,5.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] sm:mt-14">
          {STATEMENT.map(([text, style], i) => (
            <span key={i} className={style ? 'italic-serif font-normal text-river-light' : ''}>
              {text.split(/(\s+)/).map((w, j) => (w.trim() ? <span key={j} className="aw">{w}</span> : w))}
            </span>
          ))}
        </p>

        <div className="mt-24 grid gap-14 md:grid-cols-12 md:gap-8 sm:mt-32">
          <div className="space-y-5 text-lg leading-relaxed text-paper/70 md:col-span-5">
            <p>{org.whoWeAre}</p>
            <p>{org.approach}</p>
          </div>
          <dl className="md:col-span-6 md:col-start-7">
            {[['Vision', org.vision], ['Mission', org.mission]].map(([label, value]) => (
              <motion.div
                key={label}
                className="border-t border-paper/15 py-7 first:pt-7"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 1.2, ease: EXPO }}
              >
                <dt className="kicker text-paper/50">{label}</dt>
                <dd className="italic-serif mt-3 text-[clamp(2.25rem,4.4vw,4rem)] leading-[1]">{value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        <motion.ul
          className="mt-20 grid gap-px overflow-hidden border-y border-paper/15 sm:grid-cols-2 lg:grid-cols-4"
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: '-10% 0px' }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {FACTS.map((f) => (
            <motion.li
              key={f.v}
              variants={{ hide: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: EXPO } } }}
              className="flex flex-col gap-6 py-8 sm:pr-8 lg:[&:not(:first-child)]:pl-8 lg:[&:not(:first-child)]:border-l lg:border-paper/15"
            >
              <span className="display text-6xl text-paper">{f.v}</span>
              <span className="max-w-[28ch] text-sm leading-relaxed text-paper/60">{f.l}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
