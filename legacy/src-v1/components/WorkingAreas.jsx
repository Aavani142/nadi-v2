import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Photo from './Photo.jsx'
import SectionHead from './SectionHead.jsx'
import { SplitWords } from '../lib/Motion.jsx'
import { assets } from '../data/assets.js'

const areas = [
  { n: '01', title: 'Mental Health', body: 'Mental wellbeing made accessible — through awareness, counselling and community support.', src: assets.areas.mentalHealth, tone: '#216FA5', accent: '#D8ECF5', file: 'area-mental-health.jpg' },
  { n: '02', title: 'Tribal Education', body: 'Educational inclusion, academic support and learning opportunities that empower tribal communities.', src: assets.areas.tribalEducation, tone: '#8A6A1E', accent: '#F3CE68', file: 'area-tribal-education.jpg' },
  { n: '03', title: 'Youth & Community Development', body: 'Youth leadership, volunteering and community participation driving sustainable development.', src: assets.areas.youth, tone: '#175B91', accent: '#EF8875', file: 'area-youth-community.jpg' },
]

export default function WorkingAreas() {
  const [active, setActive] = useState(0)
  return (
    <section className="bg-ink px-4 py-24 text-cream sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHead label="What we do" />
        <SplitWords text="Our areas of work" className="mt-10 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-7xl" />

        <div className="mt-14 flex flex-col gap-3 md:h-[640px] md:flex-row">
          {areas.map((a, i) => {
            const on = active === i
            return (
              <motion.article key={a.title} tabIndex={0} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} data-cursor
                animate={{ flexGrow: on ? 3.2 : 1 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="relative min-h-[420px] basis-0 cursor-pointer overflow-hidden md:min-h-0">
                <Photo src={a.src} label={a.file} tone={a.tone} className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
                <span className="absolute inset-x-0 top-0 h-1" style={{ background: a.accent }} />
                <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7">
                  <span className="label" style={{ color: a.accent }}>{a.n}</span>
                  <div>
                    <h3 className={`font-display font-extrabold uppercase leading-[0.9] tracking-[-0.03em] ${on ? 'text-4xl sm:text-6xl' : 'text-3xl md:[writing-mode:vertical-rl] md:rotate-180 md:text-4xl'}`}>{a.title}</h3>
                    <AnimatePresence initial={false}>
                      <motion.p key={on ? 'on' : 'off'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: on ? 0.35 : 0 }}
                        className={`mt-4 max-w-md text-base text-cream/85 sm:text-lg ${on ? 'block' : 'block md:hidden'}`}>{a.body}</motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}