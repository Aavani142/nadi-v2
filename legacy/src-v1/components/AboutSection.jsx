import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { org, photos } from '../data/nadi.js'
import { ImageReveal, WordsOnScroll, Reveal } from '../lib/Motion.jsx'
import { Eyebrow, Img, Lines } from './ui.jsx'
import { Clay } from './Clay.jsx'

const LEDGER_COLOURS = ['#F5B301', '#E23E2A', '#1E9E62', '#FFFFFF']

export default function AboutSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yBig = useTransform(scrollYProgress, [0, 1], [40, -40])
  const ySmall = useTransform(scrollYProgress, [0, 1], [120, -80])

  return (
    <section id="about" ref={ref} className="g-sky relative overflow-hidden pb-24 pt-24 sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-44">
      <div className="frame">
        <Eyebrow>Who we are</Eyebrow>

        <div className="mt-10 grid gap-16 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* Photographic composition */}
          <div className="relative pb-24 lg:col-span-6 lg:pb-0">
            {/* colour block anchoring the photograph */}
            <motion.div style={{ y: yBig }} className="relative">
              <div aria-hidden="true" className="absolute -left-3 top-6 bottom-12 w-[85%] rounded-[32px] bg-tint sm:-left-5 sm:top-8" />
              <ImageReveal className="aspect-[5/4] rounded-[28px]">
                <Img photo={photos.teamNight} sizes="(min-width: 1024px) 45vw, 92vw" />
              </ImageReveal>
              <p className="mt-4 max-w-[50%] text-[13px] font-medium text-fg/65 sm:max-w-none">The NADI Foundation team and volunteers.</p>
            </motion.div>
            <motion.div style={{ y: ySmall }} className="absolute -bottom-2 right-[-4%] w-[44%] sm:w-[38%] lg:-bottom-24 lg:right-[-10%]">
              <div className="rounded-t-full bg-paper p-2.5">
                <ImageReveal className="aspect-[3/4] rounded-t-full" delay={0.2}>
                  <Img photo={photos.kappinessGarden} sizes="(min-width: 1024px) 18vw, 40vw" />
                </ImageReveal>
              </div>
              <p className="mt-2 text-right text-[12px] text-fg/55">Kappiness, Vazhuthacaud</p>
            </motion.div>
          </div>

          {/* Text */}
          <div className="relative lg:col-span-5 lg:col-start-8 lg:pt-6">
            <Clay kind="hands" float className="absolute -right-4 -top-20 hidden w-40 lg:block" />
            <Lines className="display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1] text-fg"
              lines={['Youth-driven.', 'Rooted in Kerala.', <span key="i" className="accent text-accent">Built with communities.</span>]} />
            <Reveal delay={0.15}>
              <p className="mt-8 text-[17px] leading-relaxed text-fg/75">{org.whoWeAre}</p>
            </Reveal>

          </div>
        </div>

        {/* Approach — lights up as you scroll */}
        <div className="mt-28 grid gap-6 rounded-[32px] bg-navy-deep px-6 py-12 sm:px-10 sm:py-16 lg:mt-48 lg:grid-cols-12 lg:px-14 lg:py-20">
          <p className="eyebrow flex items-center gap-2 pt-3 text-blue-mist lg:col-span-2"><span className="h-2 w-2 rounded-full bg-blue-mist" />Our approach</p>
          <WordsOnScroll text={org.approach}
            className="font-display text-[clamp(1.7rem,3.6vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.035em] text-white lg:col-span-10" />
        </div>

        {/* Organisation ledger */}
        <Reveal className="mt-20 lg:mt-28">
          <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {org.facts.map((f, i) => (
              <div key={f.k} className="border-t-[3px] py-6" style={{ borderColor: LEDGER_COLOURS[i % 4] }}>
                <dt className="eyebrow text-fg/55">{f.k}</dt>
                <dd className="mt-2 text-[15.5px] font-medium leading-snug text-fg">{f.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[12px] text-fg/45">Affiliated with the Ministry of Youth Affairs and Sports. Source: NADI Foundation pamphlet and Annual Report 2025–2026.</p>
        </Reveal>
      </div>
    </section>
  )
}
