import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { heroVideo, photos, org, logos } from '../data/nadi.js'
import { useRevealed, prefersReducedMotion } from '../lib/intro.js'
import { useAnchorClick } from '../lib/anchors.js'
import { PillLink, EASE } from './ui.jsx'
import { Clay } from './Clay.jsx'

/**
 * Photo film — the fallback for the hero video. Real Annual Report photographs, each captioned
 * with what it documents. Shown until an authentic NADI video is supplied (see data/nadi.js → heroVideo).
 */
export const FILM = [
  { photo: photos.volunteersMural, caption: 'Youth for Action volunteers' },
  { photo: photos.learningPlay, caption: 'Prabodhini — learning through play' },
  { photo: photos.mindfulness, caption: 'A mindfulness session for students' },
  { photo: photos.sandSculpture, caption: 'National Girl Child Day campaign' },
  { photo: photos.ekatvaConvocation, caption: 'EKATVA Convocation Ceremony, Ernakulam' },
  { photo: photos.kappinessGarden, caption: 'Kappiness Mental Health Café, Vazhuthacaud' },
]
const SIZES = '100vw'
const SHOT = 5.5 // seconds per photograph
export const heroPreload = [
  ...(heroVideo.poster ? [{ src: heroVideo.poster }] : []),
  ...FILM.slice(0, 2).map(({ photo }) => ({ src: photo.src, srcSet: photo.srcSet, sizes: SIZES })),
]

function PhotoFilm({ still, onShot }) {
  const [i, setI] = useState(0)
  useEffect(() => { onShot?.(i) }, [i, onShot])
  useEffect(() => {
    if (still) return
    const t = setInterval(() => { if (document.visibilityState === 'visible') setI((v) => (v + 1) % FILM.length) }, SHOT * 1000)
    return () => clearInterval(t)
  }, [still])
  const pan = i % 2 ? ['-2%', '2%'] : ['2%', '-2%']
  return (
    <AnimatePresence initial={false}>
      <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4, ease: 'easeInOut' }}>
        <motion.img src={FILM[i].photo.src} srcSet={FILM[i].photo.srcSet} sizes={SIZES} alt="" fetchpriority={i === 0 ? 'high' : undefined}
          className="h-full w-full object-cover" draggable="false"
          initial={still ? false : { scale: 1.16, x: pan[0] }} animate={still ? undefined : { scale: 1.04, x: pan[1] }}
          transition={{ duration: SHOT + 1.6, ease: 'linear' }} />
      </motion.div>
    </AnimatePresence>
  )
}

function HeroMedia({ onShot }) {
  const reduce = useRef(prefersReducedMotion()).current
  const [failed, setFailed] = useState(false)
  const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData
  const canVideo = heroVideo.src && !failed && !reduce && !saveData
  if (canVideo) {
    return (
      <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={heroVideo.poster}
        aria-hidden="true" onError={() => setFailed(true)}>
        {heroVideo.webm && <source src={heroVideo.webm} type="video/webm" />}
        <source src={heroVideo.src} type="video/mp4" onError={() => setFailed(true)} />
      </video>
    )
  }
  return <PhotoFilm still={reduce} onShot={onShot} />
}

export default function VideoHero() {
  const show = useRevealed()
  const onAnchor = useAnchorClick()
  const ref = useRef(null)
  const [shot, setShot] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.35])
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const infoY = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <section id="top" ref={ref} aria-label="NADI Foundation" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-navy-deep text-ivory">
      {/* media */}
      <motion.div className="absolute inset-0" style={{ scale: mediaScale }}
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
        <HeroMedia onShot={setShot} />
      </motion.div>
      {/* legibility: a deep wash from below, a soft one from the left */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,29,49,.88) 0%, rgba(10,29,49,.45) 32%, rgba(10,29,49,0) 58%, rgba(10,29,49,0) 82%, rgba(10,29,49,.45) 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(to right, rgba(10,29,49,.25), transparent 45%)' }} />
      {/* phones: the text block covers most of the frame, so the wash rises higher and deeper */}
      <div aria-hidden="true" className="absolute inset-0 sm:hidden" style={{ background: 'linear-gradient(to top, rgba(6,29,53,.94) 0%, rgba(6,29,53,.82) 45%, rgba(6,29,53,.35) 72%, rgba(6,29,53,.5) 100%)' }} />
      <motion.div aria-hidden="true" className="absolute inset-0 bg-navy-deep" style={{ opacity: shade }} />


      {/* identity */}
      <div className="frame relative flex h-full flex-col justify-end pb-24 sm:pb-20 lg:pb-14">
        <div className="grid items-end gap-x-8 gap-y-8 lg:grid-cols-12">
          <motion.div style={{ y: nameY }} className="lg:col-span-8">
            <motion.img src={logos.onDark} alt="" aria-hidden="true" className="mb-6 hidden h-14 w-auto sm:block"
              initial={{ opacity: 0, y: 10 }} animate={show ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay: 0.35, ease: EASE }} />
            <motion.p className="eyebrow mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-ivory/80 sm:mb-6"
              initial={{ opacity: 0, y: 10 }} animate={show ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay: 0.5, ease: EASE }}>
              <span className="h-2 w-2 rounded-full bg-mustard" /> Youth-driven nonprofit <span className="text-mustard">/</span> Thiruvananthapuram, Kerala
            </motion.p>
            <h1 aria-label="NADI Foundation" className="display relative leading-[0.78]">
              {/* the sun from the NADI logo, in clay, rising beside the name */}
              <motion.span aria-hidden="true" className="absolute -top-[14%] left-[min(70vw,27rem)] h-[clamp(4.5rem,11vw,10rem)] w-[clamp(4.5rem,11vw,10rem)] sm:left-[min(76vw,46rem)] lg:left-[min(54vw,46rem)]"
                initial={{ opacity: 0, scale: 0.3, y: 60 }} animate={show ? { opacity: 1, scale: 1, y: 0 } : undefined}
                transition={{ duration: 1.4, delay: 0.55, ease: EASE }}>
                <Clay kind="sun" float className="h-full w-full" />
              </motion.span>
              <span aria-hidden="true" className="flex text-[clamp(7.2rem,30vw,27rem)] tracking-[-0.06em]">
                {'NADI'.split('').map((ch, k) => (
                  <span key={k} className="inline-block overflow-hidden pb-[0.02em]">
                    <motion.span className="inline-block" initial={{ y: '102%' }} animate={show ? { y: '0%' } : undefined}
                      transition={{ duration: 1.2, delay: 0.1 + k * 0.07, ease: EASE }}>{ch}</motion.span>
                  </span>
                ))}
              </span>
              <span aria-hidden="true" className="mt-1 block overflow-hidden lg:hidden">
                <motion.span className="block text-[13.2vw] tracking-[-0.04em] text-mustard" initial={{ y: '102%' }} animate={show ? { y: '0%' } : undefined}
                  transition={{ duration: 1.1, delay: 0.4, ease: EASE }}>FOUNDATION</motion.span>
              </span>
            </h1>
          </motion.div>

          <motion.div style={{ y: infoY }} className="lg:col-span-4 lg:pb-[1.2vw]">
            <span aria-hidden="true" className="hidden overflow-hidden lg:block">
              <motion.span className="display block text-[clamp(2.6rem,5.1vw,5.4rem)] leading-[0.85] tracking-[-0.04em] text-mustard"
                initial={{ y: '102%' }} animate={show ? { y: '0%' } : undefined} transition={{ duration: 1.1, delay: 0.4, ease: EASE }}>
                FOUNDATION
              </motion.span>
            </span>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={show ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1, delay: 0.75, ease: EASE }}>
              <p className="accent text-[clamp(1.35rem,2vw,1.8rem)] text-ivory lg:mt-5">Equity, Equality &amp; Innovation.</p>
              <p className="eyebrow mt-2 flex items-center gap-2 text-blue-mist"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-sun" />Collective Action &amp; Sustainability</p>
              <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-ivory/80">{org.intro}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <PillLink href="#work" onClick={(e) => onAnchor(e, '#work')} variant="mustard">Discover Our Work</PillLink>
                <a href="#get-involved" onClick={(e) => onAnchor(e, '#get-involved')} className="link-u pb-1 text-[15px] font-semibold text-ivory">Get Involved</a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* footer strip: what's on screen + scroll cue */}
      <motion.div className="frame absolute inset-x-0 bottom-0 flex items-center justify-between pb-5 text-[12px] text-ivory/65"
        initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : undefined} transition={{ delay: 1.2, duration: 0.8 }}>
        <p className="flex items-center gap-3">
          {!heroVideo.src && (
            <span className="flex gap-1" aria-hidden="true">
              {FILM.map((_, k) => <span key={k} className={`h-[3px] rounded-full transition-all duration-500 ${k === shot ? 'w-6 bg-mustard' : 'w-2 bg-ivory/30'}`} />)}
            </span>
          )}
          <AnimatePresence mode="wait">
            <motion.span key={heroVideo.src ? 'v' : shot} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
              {heroVideo.src ? 'NADI Foundation in the community' : FILM[shot].caption}
            </motion.span>
          </AnimatePresence>
        </p>
        <a href="#about" onClick={(e) => onAnchor(e, '#about')} className="hidden items-center gap-2 font-semibold uppercase tracking-[0.18em] text-ivory/80 hover:text-ivory sm:flex">
          Scroll <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}><ArrowDown size={14} /></motion.span>
        </a>
      </motion.div>
    </section>
  )
}
