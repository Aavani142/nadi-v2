import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Phone } from 'lucide-react'
import { ctas, frameworks, contact } from '../data/nadi.js'
import { ImageReveal, Reveal } from '../lib/Motion.jsx'
import { useMedia } from '../lib/intro.js'
import { Eyebrow, Img, Lines, PillLink } from './ui.jsx'
import { Doodled, Doodle } from './Doodle.jsx'
import PaperBackdrop from './PaperBackdrop.jsx'

export default function PartnershipSection() {
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const listRef = useRef(null)
  const [hover, setHover] = useState(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 180, damping: 22 }), y = useSpring(my, { stiffness: 180, damping: 22 })
  const move = (e) => {
    const r = listRef.current.getBoundingClientRect()
    mx.set(e.clientX - r.left); my.set(e.clientY - r.top)
  }

  return (
    <section id="support" aria-label="Donate and support NADI" className="relative overflow-hidden bg-blue pb-24 pt-24 text-ivory sm:pt-32 lg:pb-32 lg:pt-40">
      <PaperBackdrop tone="dark" seed={13} />
      <div className="frame relative">
        <Eyebrow tone="text-mustard-light">Donate &amp; support</Eyebrow>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Lines className="display text-[clamp(3.4rem,10vw,10.5rem)] leading-[0.88] lg:col-span-9"
            lines={['Support the', <span key="i" className="accent text-blue-haze">next wave of change.</span>]} />
          <div className="lg:col-span-3 lg:self-end">
            <p className="display text-[1.7rem] leading-tight text-white">Progress begins when people come together.</p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ivory/80">
              Students, volunteers, organisations, institutions and partners — there is a place for you in meaningful community development. Reach out to our main office to explore partnership avenues, support our local programmes, or connect with a regional branch near you.
            </p>
          </div>
        </div>

        <Reveal className="mt-12 flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="relative inline-block">
            <PillLink to="/donate" variant="ivory">Donate to NADI</PillLink>
            <Doodle kind="arrow" delay={0.6} className="absolute -top-14 left-[18%] h-12 w-24 -scale-x-100 rotate-[200deg] text-[#F7DFC4] sm:-top-16 sm:h-14 sm:w-28" />
          </span>
          <PillLink href={ctas.volunteer.href} variant="ghost">{ctas.volunteer.label}</PillLink>
          <PillLink href={ctas.partner.href} variant="ghost">{ctas.partner.label}</PillLink>
          <a href={`tel:+91${contact.phone}`} className="ml-1 inline-flex min-h-[48px] items-center gap-2 text-[14px] font-semibold text-ivory/80 hover:text-white">
            <Phone size={15} /> {contact.phoneDisplay}
          </a>
        </Reveal>

        {/* Engagement frameworks [pamphlet] */}
        <div ref={listRef} onMouseMove={fine ? move : undefined} onMouseLeave={() => setHover(null)} className="relative mt-20 lg:mt-28">
          <p className="eyebrow mb-4 text-ivory/80">Engagement frameworks</p>
          <ul className="border-t border-white/20">
            {frameworks.map((f, k) => (
              <li key={f.k} onMouseEnter={() => setHover(k)} className="border-b border-white/20">
                <a href={ctas[f.cta].href} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-7 sm:grid-cols-[3.5rem_1fr_1fr_auto] lg:py-9">
                  <span className="text-[12px] font-semibold tabular-nums text-mustard-light/90">0{k + 1}</span>
                  <span>
                    <span className="block font-display text-[clamp(1.7rem,3.4vw,3.2rem)] font-bold leading-none tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-3">{f.k}</span>
                    <span className="eyebrow mt-3 block text-mustard-light/90">{f.for}</span>
                  </span>
                  <span className="col-span-2 col-start-2 max-w-md text-[15px] leading-relaxed text-ivory/75 sm:col-span-1 sm:col-start-3">{f.text}</span>
                  {/* touch screens: the photo the cursor would reveal on desktop, revealed in place */}
                  {!fine && (
                    <ImageReveal className="col-span-2 col-start-2 mt-3 aspect-[16/9] max-w-md rounded-[14px] sm:col-start-3 sm:col-span-1">
                      <Img photo={f.photo} sizes="(min-width:640px) 40vw, 80vw" className="transition-transform duration-700 group-active:scale-[1.04]" />
                    </ImageReveal>
                  )}
                  <span className="row-start-1 col-start-3 grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-accent sm:col-start-4">
                    <ArrowUpRight size={18} />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {fine && (
            <motion.div aria-hidden="true" style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block">
              <AnimatePresence>
                {hover !== null && (
                  <motion.div key={hover} className="absolute -left-36 -top-28 h-56 w-72 overflow-hidden rounded-[20px] shadow-2xl"
                    initial={{ opacity: 0, scale: 0.7, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                    <Img photo={frameworks[hover].photo} sizes="288px" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-ivory/80">
          <span>12A &amp; 80G certified NGO</span>
          <span>ISO 9001:2015 certified</span>
          <span>Reg. No. TVM/TC/668/2022</span>
          <span>NGO Darpan KL/2023/0345250</span>
        </p>
      </div>
    </section>
  )
}
