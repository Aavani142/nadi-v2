import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { photos, logos, org } from '../data/nadi.js'
import { useRevealed } from '../lib/intro.js'
import { useAnchorClick } from '../lib/anchors.js'
import { Img, PillLink, RiverLines, EASE } from './ui.jsx'

// Photos and `sizes` are shared with the intro so it preloads exactly what the hero will request.
export const HERO = {
  arch: { photo: photos.volunteersMural, sizes: '(min-width: 1024px) 30vw, 72vw' },
  sun: { photo: photos.learningPlay, sizes: '(min-width: 1024px) 16vw, 42vw' },
  stone: { photo: photos.mindfulness, sizes: '(min-width: 1024px) 22vw, 60vw' },
}
export const heroPreload = Object.values(HERO).map(({ photo, sizes }) => ({ src: photo.src, srcSet: photo.srcSet, sizes }))

const SWEEP = [0.65, 0, 0.35, 1]

/** The official mark, assembled from its own layers, then gently alive. */
function LivingMark({ show, className }) {
  const enter = (delay, from) => ({
    initial: { clipPath: from === 'clip' ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 0%)', opacity: from === 'clip' ? 1 : 0, y: from === 'rise' ? '28%' : '0%' },
    animate: show ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: '0%' } : undefined,
    transition: { duration: 1.1, delay, ease: from === 'rise' ? [0.34, 1.25, 0.5, 1] : SWEEP },
  })
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '321 / 225' }} role="img" aria-label="NADI Foundation logo mark">
      <motion.div className="absolute inset-0" {...enter(0.15, 'clip')}>
        <motion.img src={logos.wave1} alt="" className="h-full w-full" animate={{ x: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
      </motion.div>
      <motion.div className="absolute inset-0" {...enter(0.3, 'clip')}>
        <motion.img src={logos.wave2} alt="" className="h-full w-full" animate={{ x: [0, -7, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
      </motion.div>
      <motion.div className="absolute inset-0" {...enter(0.55, 'rise')}>
        <motion.img src={logos.sun} alt="" className="h-full w-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }} />
      </motion.div>
    </div>
  )
}

function MaskPhoto({ item, show, delay, className }) {
  return (
    <motion.div className={`overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }} animate={show ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
      transition={{ duration: 1.3, delay, ease: [0.76, 0, 0.24, 1] }}>
      <motion.div className="h-full w-full" initial={{ scale: 1.3 }} animate={show ? { scale: 1 } : undefined} transition={{ duration: 2, delay, ease: EASE }}>
        <Img photo={item.photo} sizes={item.sizes} priority />
      </motion.div>
    </motion.div>
  )
}

function Tag({ children, className, show, delay }) {
  return (
    <motion.span className={`absolute z-20 inline-flex items-center gap-2 rounded-full bg-ivory/95 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-[0_6px_24px_-12px_rgba(15,30,46,.35)] ${className}`}
      initial={{ opacity: 0, y: 10 }} animate={show ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay, ease: EASE }}>
      <span className="h-1.5 w-1.5 rounded-full bg-blue" />{children}
    </motion.span>
  )
}

export default function HeroSection() {
  const show = useRevealed()
  const onAnchor = useAnchorClick()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yArch = useTransform(scrollYProgress, [0, 1], [0, -70])
  const ySun = useTransform(scrollYProgress, [0, 1], [0, -170])
  const yStone = useTransform(scrollYProgress, [0, 1], [0, 40])
  const yText = useTransform(scrollYProgress, [0, 1], [0, 80])

  const meta = [
    ['Established', '10 September 2022'],
    ['Certified', 'ISO 9001:2015'],
    ['Initiatives', 'Five, across Kerala'],
    ['Headquarters', 'Thiruvananthapuram'],
  ]

  return (
    <section id="top" ref={ref} className="grain relative overflow-hidden bg-ivory pb-20 pt-24 sm:pb-24 sm:pt-28">
      {/* flowing contour lines, from the logo's waves */}
      <RiverLines show={show} delay={0.4} count={3} className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-60 sm:h-28" />

      <div className="frame relative grid grid-cols-1 gap-y-14 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-12 lg:items-center lg:gap-x-8">
        {/* ── Brand + purpose ── */}
        <motion.div style={{ y: yText }} className="relative z-10 lg:col-span-7">
          <motion.p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-ink/65"
            initial={{ opacity: 0, y: 12 }} animate={show ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay: 0.1, ease: EASE }}>
            Youth-driven nonprofit <span className="text-blue">/</span> Thiruvananthapuram, Kerala
          </motion.p>

          {/* Hero-scale lockup: the official mark beside the foundation's name */}
          <h1 className="mt-7 sm:mt-9" aria-label="NADI Foundation">
            <span aria-hidden="true" className="flex items-end gap-[0.12em] text-[clamp(4.6rem,12.2vw,11.6rem)]">
              <LivingMark show={show} className="mb-[0.1em] w-[1.02em] shrink-0" />
              <span className="flex font-serif font-light leading-[0.8] tracking-[-0.035em] text-ink">
                {['N', 'A', 'D', 'I'].map((l, i) => (
                  <span key={l} className="inline-block overflow-hidden pb-[0.04em] pt-[0.06em]">
                    <motion.span className="inline-block" initial={{ y: '106%' }} animate={show ? { y: '0%' } : undefined}
                      transition={{ duration: 1.1, delay: 0.25 + i * 0.07, ease: EASE }}>{l}</motion.span>
                  </span>
                ))}
              </span>
            </span>
            <motion.span aria-hidden="true" className="mt-2 block pl-[calc(clamp(4.6rem,12.2vw,11.6rem)*1.14)] font-sans text-[clamp(0.92rem,2.42vw,2.3rem)] font-semibold uppercase leading-none text-blue"
              initial={{ opacity: 0, letterSpacing: '0.1em' }} animate={show ? { opacity: 1, letterSpacing: '0.41em' } : undefined}
              transition={{ duration: 1.5, delay: 0.6, ease: EASE }}>
              Foundation
            </motion.span>
          </h1>

          <motion.div className="mt-9 grid gap-x-10 gap-y-2 sm:mt-11 sm:grid-cols-[auto_1fr] sm:items-baseline"
            initial={{ opacity: 0, y: 14 }} animate={show ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1, delay: 0.85, ease: EASE }}>
            <p className="font-serif text-[clamp(1.5rem,2.3vw,2.1rem)] font-light italic leading-tight text-blue-deep">Equity, Equality &amp; Innovation.</p>
            <p className="eyebrow text-ink/55">Collective Action &amp; Sustainability.</p>
          </motion.div>

          <motion.div className="mt-7 grid max-w-xl gap-8"
            initial={{ opacity: 0, y: 14 }} animate={show ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1, delay: 1.0, ease: EASE }}>
            <p className="text-[17px] leading-relaxed text-ink/75">{org.intro}</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <PillLink href="#work" onClick={(e) => onAnchor(e, '#work')}>Discover Our Work</PillLink>
              <a href="#get-involved" onClick={(e) => onAnchor(e, '#get-involved')} className="link-u pb-1 text-[15px] font-semibold text-ink">Be Part of the Change</a>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Real photographs ── */}
        <div className="relative mx-auto h-[min(116vw,600px)] w-full max-w-[540px] lg:col-span-5 lg:mx-0 lg:h-[min(74vh,700px)] lg:max-w-none">
          <motion.div style={{ y: yArch }} className="absolute right-0 top-0 h-[86%] w-[72%]">
            <MaskPhoto item={HERO.arch} show={show} delay={0.2} className="h-full w-full rounded-t-full" />
            <Tag show={show} delay={1.4} className="-bottom-3 right-4">Youth for Action volunteers</Tag>
          </motion.div>
          <motion.div style={{ y: ySun }} className="absolute left-[2%] top-[6%] z-10 w-[42%] lg:left-[-4%]">
            <motion.div className="aspect-square rounded-full bg-ivory p-[6px]"
              initial={{ scale: 0.4, opacity: 0 }} animate={show ? { scale: 1, opacity: 1 } : undefined} transition={{ duration: 1.4, delay: 0.5, ease: [0.34, 1.2, 0.5, 1] }}>
              <div className="h-full w-full overflow-hidden rounded-full"><Img photo={HERO.sun.photo} sizes={HERO.sun.sizes} priority /></div>
            </motion.div>
            <Tag show={show} delay={1.55} className="-bottom-1 left-6">Prabodhini</Tag>
          </motion.div>
          <motion.div style={{ y: yStone }} className="absolute bottom-[1%] left-0 z-10 w-[62%] lg:left-[-12%] lg:w-[58%]">
            <div className="rounded-full bg-ivory p-[6px]">
              <MaskPhoto item={HERO.stone} show={show} delay={0.45} className="aspect-[16/10] w-full rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div className="frame relative mt-14 lg:mt-2" initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : undefined} transition={{ duration: 1, delay: 1.2 }}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/10 py-6 sm:grid-cols-4 lg:pr-40">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow text-ink/45">{k}</dt>
              <dd className="mt-1.5 font-serif text-lg font-light text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <a href="#about" onClick={(e) => onAnchor(e, '#about')} className="absolute bottom-7 right-12 hidden items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/60 lg:flex">
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
            <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-blue" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
          </span>
        </a>
      </motion.div>
    </section>
  )
}
