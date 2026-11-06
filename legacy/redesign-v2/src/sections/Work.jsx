import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { initiatives, org, photos } from '../data/nadi.js'
import { EXPO, useGsap, gsap, ScrollTrigger } from '../lib/motion.js'
import { Img, Kicker, SplitWords, TextLink } from '../components/ui.jsx'

const ITEMS = [
  { ...initiatives.kappiness, photo: photos.kappinessGarden, place: 'Thiruvananthapuram' },
  { ...initiatives.prabodhini, photo: photos.learningPlay },
  { ...initiatives.yfa, photo: photos.volunteersMural, place: 'Across Kerala' },
  { ...initiatives.ekatva, photo: photos.ekatvaConvocation, place: 'Ernakulam & Thiruvananthapuram' },
  { ...initiatives.navajeevana, photo: photos.navCaregivers },
]

const pad = (n) => String(n).padStart(2, '0')

/** Photo that trails the pointer while it's over the list (fine pointers only). */
function CursorPreview({ index }) {
  const [fine] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.5 })
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])
  if (!fine) return null
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="relative -ml-[150px] -mt-[190px] h-[380px] w-[300px] overflow-hidden rounded-[6px] bg-ink"
        initial={false}
        animate={{ scale: index === null ? 0 : 1, rotate: index === null ? -8 : 0 }}
        transition={{ duration: 0.6, ease: EXPO }}
      >
        <AnimatePresence initial={false}>
          {index !== null && (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: EXPO }}
            >
              <Img photo={ITEMS[index].photo} sizes="300px" alt="" className="h-full w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function Details({ item }) {
  return (
    <div className="grid gap-8 pb-12 pt-2 md:grid-cols-12 md:gap-8 sm:pb-16">
      <motion.figure
        className="overflow-hidden rounded-[6px] md:col-span-5 md:col-start-2"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: 1.1, ease: EXPO, delay: 0.1 }}
      >
        <motion.div initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EXPO }}>
          <Img photo={item.photo} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/3] w-full object-cover" />
        </motion.div>
      </motion.figure>

      <motion.div
        className="md:col-span-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EXPO, delay: 0.2 }}
      >
        <p className="text-2xl font-medium leading-snug tracking-[-0.02em] sm:text-[28px]">{item.lede}</p>
        {item.body && <p className="mt-5 leading-relaxed text-ink/70">{item.body}</p>}

        {item.stats && (
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink/15 pt-6">
            {item.stats.map((s) => (
              <div key={s.l}>
                <dt className="display text-5xl">{s.v}<span className="text-ember">{s.s}</span></dt>
                <dd className="mt-1.5 text-sm leading-snug text-ink/60">{s.l}</dd>
              </div>
            ))}
          </dl>
        )}

        {item.flow && (
          <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-ink/15 pt-6" aria-label="How the programme works">
            {item.flow.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-ink/20 px-3.5 py-1.5 text-sm font-medium">{step}</span>
                {i < item.flow.length - 1 && <ArrowRight aria-hidden className="h-3.5 w-3.5 text-ink/40" />}
              </li>
            ))}
          </ol>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          {item.place && <span className="text-ink/60"><span className="kicker mr-2 text-ink/40">Where</span>{item.place}</span>}
          <span className="text-ink/60"><span className="kicker mr-2 text-ink/40">UN SDGs</span>{item.sdgs.join(' · ')}</span>
          {item.milestone && <span className="text-ink/60">{item.milestone}</span>}
          {item.instagram && <TextLink href={item.instagram}>Follow {item.name}</TextLink>}
        </div>
      </motion.div>
    </div>
  )
}

export default function Work() {
  const root = useRef(null)
  const [open, setOpen] = useState(null)
  const [hover, setHover] = useState(null)

  useGsap(root, () => {
    gsap.from('.work-title .w-in', {
      yPercent: 115, stagger: 0.06, duration: 1.4,
      scrollTrigger: { trigger: '.work-title', start: 'top 85%' },
    })
    gsap.from('.work-row', {
      y: 40, opacity: 0, stagger: 0.07, duration: 1.2,
      scrollTrigger: { trigger: '.work-list', start: 'top 85%' },
    })
  })

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative py-28 sm:py-40">
      <div className="frame">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Kicker n="02" className="text-ink/60">Our Work</Kicker>
            <h2 id="work-title" className="work-title display mt-8 text-[14vw] uppercase sm:text-[9vw] lg:text-[7.6vw] min-[1520px]:text-[116px]">
              <SplitWords text="Five initiatives." className="block" />
              <span className="line-mask block">
                <span className="w-in italic-serif inline-block normal-case text-river">one current.</span>
              </span>
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-ink/70 md:col-span-4">
            {org.approach}
          </p>
        </div>

        <ul className="work-list mt-16 sm:mt-24" onPointerLeave={() => setHover(null)}>
          {ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={item.name} className="work-row border-t border-ink/15 last:border-b">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`work-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    onPointerEnter={() => setHover(isOpen ? null : i)}
                    onPointerLeave={() => setHover(null)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-6 text-left sm:grid-cols-12 sm:gap-6 sm:py-8"
                  >
                    <span className="kicker tabular text-ink/40 sm:col-span-1">{pad(i + 1)}</span>
                    <span className={`display block text-[10.5vw] uppercase transition-[transform,color] duration-700 ease-expo group-hover:translate-x-3 sm:col-span-6 sm:text-6xl lg:text-[88px] ${isOpen ? 'text-river' : 'group-hover:text-river'}`}>
                      {item.name}
                    </span>
                    <span className="hidden text-[15px] leading-snug text-ink/60 sm:col-span-4 sm:block">
                      <span className="kicker mb-1.5 block text-ink/40">{item.theme}</span>
                      {item.focus}
                    </span>
                    <span className="justify-self-end sm:col-span-1">
                      <span className={`grid h-11 w-11 place-items-center rounded-full border transition-colors duration-500 sm:h-14 sm:w-14 ${isOpen ? 'border-ink bg-ink text-paper' : 'border-ink/20 group-hover:border-ink'}`}>
                        <Plus aria-hidden className={`h-5 w-5 transition-transform duration-500 ease-expo ${isOpen ? 'rotate-45' : ''}`} />
                      </span>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false} onExitComplete={() => ScrollTrigger.refresh()}>
                  {isOpen && (
                    <motion.div
                      id={`work-${i}`}
                      role="region"
                      aria-label={item.name}
                      className="overflow-hidden"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.9, ease: EXPO }}
                      onAnimationComplete={() => ScrollTrigger.refresh()}
                    >
                      <Details item={item} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
      <CursorPreview index={hover} />
    </section>
  )
}
