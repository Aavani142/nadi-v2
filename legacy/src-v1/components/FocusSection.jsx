import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { photos } from '../data/nadi.js'
import { Reveal } from '../lib/Motion.jsx'
import { Clay, ClayClouds } from './Clay.jsx'
import { Img, Lines, EASE } from './ui.jsx'
import { scrollToInitiative } from './InitiativesSection.jsx'

/** NADI's three working areas [PM][AR p5], each as a festival stamp with its own clay object. */
const FOCUS = [
  {
    n: '01', title: 'Mental Health', clay: 'heart', stamp: '#E23E2A', ink: '#FFFFFF',
    text: 'Safe, stigma-free spaces for awareness, counselling and emotional wellbeing — from a mental health café to community care networks.',
    photo: photos.kappinessReading,
    caption: 'Kappiness, Vazhuthacaud',
    links: [{ id: 'kappiness', label: 'Kappiness' }, { id: 'navajeevana', label: 'Navajeevana' }],
  },
  {
    n: '02', title: 'Tribal Education', clay: 'book', stamp: '#F5B301', ink: '#0A1D31',
    text: 'Educational inclusion for children in tribal communities of Amboori Panchayat, through rural resource libraries and structured mentorship.',
    photo: photos.learningPlay,
    caption: 'Prabodhini — learning through play',
    links: [{ id: 'prabodhini', label: 'Prabodhini' }],
  },
  {
    n: '03', title: 'Youth & Community Development', clay: 'sprout', stamp: '#1E9E62', ink: '#FFFFFF',
    text: 'Young people learning, leading and acting on the issues around them — and skills and livelihoods for communities who are too often left out.',
    photo: photos.volunteersMural,
    caption: 'Youth for Action volunteers',
    links: [{ id: 'youth-for-action', label: 'Youth for Action' }, { id: 'ekatva', label: 'Ekatva' }],
  },
]

function FocusCard({ f, i }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const clayY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const clayR = useTransform(scrollYProgress, [0, 1], [-8, 8])

  return (
    <motion.article ref={ref} className={`relative ${i === 1 ? 'lg:mt-24' : ''}`}
      initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px 0px' }}
      transition={{ duration: 1, delay: i * 0.12, ease: EASE }}>
      {/* the stamp */}
      <div className="stamp relative drop-shadow-[0_24px_40px_rgba(0,0,0,.35)]" style={{ background: f.stamp }}>
        <div className="group relative aspect-[4/5] overflow-hidden">
          <Img photo={f.photo} sizes="(min-width:1024px) 30vw, 90vw" className="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
          <div aria-hidden="true" className="absolute inset-0 mix-blend-multiply" style={{ background: `linear-gradient(to top, ${f.stamp}cc, transparent 55%)` }} />
          <span className="display absolute left-4 top-3 text-[clamp(3.4rem,6vw,5rem)] leading-none text-white drop-shadow-[0_4px_14px_rgba(0,0,0,.4)]">{f.n}</span>
          <span className="absolute bottom-3 left-4 right-4 text-[12px] font-semibold text-white/90">{f.caption}</span>
        </div>
      </div>
      {/* the clay object, breaking out of the stamp like KLF's sculptures */}
      <motion.div style={{ y: clayY, rotate: clayR }} className="absolute -right-4 -top-14 w-[38%] max-w-[170px] sm:-right-8 sm:-top-16">
        <Clay kind={f.clay} float delay={i * 0.8} className="w-full" />
      </motion.div>

      <h3 className="display mt-8 text-[clamp(2rem,3vw,2.8rem)] leading-[0.95] text-heading">{f.title}</h3>
      <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-fg/75">{f.text}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {f.links.map((l) => (
          <li key={l.id}>
            <a href={`#work-${l.id}`} onClick={(e) => { e.preventDefault(); scrollToInitiative(l.id) }}
              className="group inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/25 px-4 text-[13.5px] font-semibold text-white transition-colors hover:border-transparent"
              onMouseEnter={(e) => { e.currentTarget.style.background = f.stamp; e.currentTarget.style.color = f.ink }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}>
              {l.label} <ArrowDownRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

export default function FocusSection() {
  return (
    <section id="focus" aria-label="Our three focus areas" className="relative overflow-hidden bg-page pb-28 pt-24 sm:pt-32 lg:pb-40 lg:pt-36">
      <ClayClouds items={[[4, 7, 90], [44, 3, 60], [90, 22, 70], [70, 62, 54]]} className="opacity-90" />
      {/* the river in the logo, flowing behind the heading */}
      <Clay kind="wave" float className="absolute -left-10 top-[30%] hidden w-[220px] opacity-90 lg:block" />

      <div className="frame relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow flex items-center gap-3 text-accent">
              <span aria-hidden="true" className="flex gap-1">{FOCUS.map((f) => <span key={f.n} className="h-2 w-2 rounded-full" style={{ background: f.stamp }} />)}</span>
              What we focus on
            </p>
            <Lines className="display mt-6 text-[clamp(3rem,7.4vw,7.6rem)] leading-[0.88] text-heading"
              lines={['Three focus areas.', <span key="a" className="accent text-accent">One flowing river.</span>]} />
          </div>
          <Reveal className="lg:col-span-4 lg:pb-3">
            <p lang="ml" className="display text-[clamp(2.6rem,4.6vw,4rem)] leading-none text-white/90">നദി</p>
            <p className="mt-3 text-[16px] leading-relaxed text-fg/75">
              <em className="not-italic font-semibold text-white">Nadi</em> means river. Like one, our work reaches people where they are — through three areas that every NADI initiative belongs to.
            </p>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-20 sm:mt-28 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:gap-14">
          {FOCUS.map((f, i) => <FocusCard key={f.n} f={f} i={i} />)}
        </div>
      </div>
    </section>
  )
}
