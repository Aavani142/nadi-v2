import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import RiverCanvas from './RiverCanvas.jsx'
import Logo from './Logo.jsx'
import { CountUp, Magnetic } from '../lib/Motion.jsx'
import { assets } from '../data/assets.js'
import { donateRoute } from '../data/content.js'
import { INTRO } from '../lib/timing.js'
import { useState } from 'react'

const ease = [0.16, 1, 0.3, 1]
const stats = [
  { v: 5000, s: '+', l: 'Beneficiaries' },
  { v: 1000, s: '+', l: 'Volunteers' },
  { v: 30000, s: '+', l: 'Volunteer hours' },
]

function Line({ children, delay = 0 }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
      <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ delay, duration: 1.1, ease }}>{children}</motion.span>
    </span>
  )
}

export default function Hero() {
  const [imgOk, setImgOk] = useState(false)
  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 800], [0, 120])
  const textY = useTransform(scrollY, [0, 700], [0, -60])

  return (
    <section className="bg-ink p-2.5 sm:p-4">
      <motion.div
        initial={{ clipPath: 'inset(8% 8% 8% 8% round 24px)', opacity: 0 }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 20px)', opacity: 1 }} transition={{ delay: INTRO - 0.4, duration: 1.4, ease }}
        className="relative h-[calc(100svh-1.25rem)] min-h-[640px] overflow-hidden bg-nadi-navy text-white sm:h-[calc(100svh-2rem)]">

        {/* river canvas is the base; a real photo fades over it once it loads */}
        <motion.div style={{ y: imgY }} className="absolute inset-x-0 -top-10 bottom-[-8rem]">
          <RiverCanvas className="absolute inset-0 h-full w-full" />
          <img src={assets.hero[0]} alt="" onLoad={() => setImgOk(true)} onError={() => setImgOk(false)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${imgOk ? 'opacity-100' : 'opacity-0'}`} />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/70" />

        <div className="relative flex h-full flex-col justify-end px-6 pb-8 sm:px-12 sm:pb-12">
          <motion.div style={{ y: textY }}>
            <h1 aria-label="NADI Foundation" className="font-display text-[clamp(3.4rem,14vw,15rem)] font-black uppercase leading-[0.84] tracking-[-0.045em]">
              <Line delay={INTRO + 0.1}>
                <span className="flex items-center gap-[0.16em]">
                  <span className="grid h-[0.78em] w-[0.78em] shrink-0 place-items-center rounded-full bg-cream p-[0.07em]"><Logo className="h-full w-full" /></span>
                  NADI
                </span>
              </Line>
              <Line delay={INTRO + 0.22}>Foundation</Line>
            </h1>

            <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: INTRO + 0.8, duration: 0.9, ease }}
                  className="max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">
                  Building a future where everyone has the opportunity to thrive — through mental health, tribal education, and youth-led community action across Kerala.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: INTRO + 1, duration: 0.9, ease }} className="mt-6 flex flex-wrap gap-3">
                  <Magnetic strength={0.15}>
                    <Link to={donateRoute.to} className="inline-flex min-h-[52px] items-center bg-nadi-yellow px-7 text-[13px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-white">Donate</Link>
                  </Magnetic>
                  <Magnetic strength={0.15}>
                    <a href="#projects" className="group inline-flex min-h-[52px] items-center gap-2.5 border border-white/70 px-7 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors hover:bg-white hover:text-ink">
                      Our work <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </Magnetic>
                </motion.div>
              </div>

              <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: INTRO + 1.2, duration: 1 }}
                className="hidden w-full max-w-lg grid-cols-3 gap-6 border-t border-white/40 pt-4 lg:grid">
                {stats.map((s) => (
                  <div key={s.l}>
                    <dd className="font-display text-3xl font-extrabold tracking-tight"><CountUp to={s.v} suffix={s.s} /></dd>
                    <dt className="label mt-1 text-[10px] text-white/70">{s.l}</dt>
                  </div>
                ))}
              </motion.dl>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}