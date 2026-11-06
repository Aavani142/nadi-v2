import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { impact, photos } from '../data/nadi.js'
import { CountUp, ImageReveal, Reveal } from '../lib/Motion.jsx'
import { Eyebrow, Img, Lines } from './ui.jsx'
import { Clay } from './Clay.jsx'

function Source({ children, className = '' }) {
  return <p className={`eyebrow inline-flex items-center gap-2 ${className}`}><span className="h-px w-6 bg-current opacity-60" />{children}</p>
}

export default function ImpactSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yPhoto = useTransform(scrollYProgress, [0, 1], [60, -60])
  const [beneficiaries, volunteers, staff] = impact.profile.items

  return (
    <section id="impact" ref={ref} aria-label="Impact" className="g-coral relative overflow-hidden pt-24 sm:pt-32 lg:pt-40">
      <div className="frame">
        <Eyebrow tone="text-accent">Impact</Eyebrow>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <Lines className="display text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.9] lg:col-span-8"
            lines={['Real people.', <span key="i" className="accent text-accent">Real numbers.</span>]} />
          <p className="text-[15.5px] leading-relaxed text-fg/75 lg:col-span-4 lg:pt-5">
            Figures as reported in the NADI Foundation Annual Report 2025–2026. Each set is shown in the context it was reported in, and the sets are not added together.
          </p>
        </div>

        {/* Organisation profile */}
        <div className="mt-16 grid items-end gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-7">
            <Clay kind="heart" float className="absolute -top-10 right-0 w-[clamp(6rem,12vw,10rem)] sm:right-[8%]" />
            <Source className="text-accent">{impact.profile.context}</Source>
            <p className="display mt-4 text-[clamp(6rem,19vw,17rem)] leading-[0.8] tracking-[-0.06em] text-accent">
              <CountUp to={beneficiaries.v} suffix={beneficiaries.s} duration={2.4} />
            </p>
            <p className="accent mt-3 text-[clamp(1.6rem,2.6vw,2.4rem)] text-fg">{beneficiaries.l.toLowerCase()}</p>
            <dl className="mt-12 grid grid-cols-2 border-t-2 border-heading">
              {[volunteers, staff].map((s) => (
                <div key={s.l} className="flex flex-col-reverse border-b border-heading/20 py-6 pr-6 [&:nth-child(2)]:border-l [&:nth-child(2)]:border-heading/20 [&:nth-child(2)]:pl-6">
                  <dt className="mt-2 text-[14px] font-semibold text-fg/75">{s.l}</dt>
                  <dd className="display text-[clamp(3rem,6vw,5.4rem)] leading-none text-heading"><CountUp to={s.v} suffix={s.s} /></dd>
                </div>
              ))}
            </dl>
          </div>
          <motion.div style={{ y: yPhoto }} className="lg:col-span-4 lg:col-start-9">
            <ImageReveal className="aspect-[4/5] rounded-t-full">
              <Img photo={photos.ekatvaBanner} sizes="(min-width:1024px) 30vw, 90vw" />
            </ImageReveal>
          </motion.div>
        </div>
      </div>

      {/* Youth for Action */}
      <div className="relative mt-24 overflow-hidden rounded-t-[36px] bg-navy-deep py-20 text-ivory sm:rounded-t-[56px] lg:mt-36 lg:py-28">
        <div className="frame relative">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Source className="text-blue-mist">{impact.yfa.context}</Source>
              <p className="display mt-5 text-[clamp(2rem,3.6vw,3.4rem)] leading-[0.98]">{impact.yfa.note}.</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <ImageReveal className="aspect-[16/9] rounded-[24px]">
                <Img photo={photos.volunteersMural} sizes="(min-width:1024px) 45vw, 92vw" />
              </ImageReveal>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-1 border-t border-white/15 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {impact.yfa.items.map((s, k) => (
              <Reveal key={s.l} delay={(k % 3) * 0.08}
                className="group relative flex flex-col-reverse justify-end border-b border-white/10 py-8 sm:pr-8 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-8 lg:[&:nth-child(even)]:border-l-0 lg:[&:nth-child(even)]:pl-0 lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(3n+1))]:pl-8">
                <dt className="mt-4 max-w-[16rem] text-[14.5px] font-medium leading-snug text-ivory/70">{s.l}</dt>
                <dd className="display text-[clamp(3.4rem,5.6vw,5.6rem)] leading-none transition-colors duration-500 group-hover:text-blue-mist">
                  <CountUp to={s.v} suffix={s.s} />
                </dd>
              </Reveal>
            ))}
          </dl>
          <p className="mt-8 text-[12.5px] text-ivory/45">
            Kappiness and EKATVA programme figures appear with each initiative above. Source: Annual Report 2025–2026.
          </p>
        </div>
      </div>
    </section>
  )
}
