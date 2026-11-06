import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'
import { heroVideo, photos, org } from '../data/nadi.js'
import LogoMotion from './LogoMotion.jsx'
import { Doodle } from './Doodle.jsx'
import { useRevealed, prefersReducedMotion } from '../lib/intro.js'
import { useAnchorClick } from '../lib/anchors.js'
import { PillLink } from './ui.jsx'
import { gsap, useGsap, distanceScale } from '../lib/gsap.js'

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

  // Entrance (once the loader hands over) + scroll parallax — one GSAP context, reverted on unmount
  useGsap(ref, () => {
    if (!show) return
    gsap.timeline()
      .fromTo('.h-media', { clipPath: 'inset(7% 7% 7% 7% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.9, ease: 'expo.inOut' })
      .fromTo('.h-media-inner', { scale: 1.22 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
      .from('.h-letter', { yPercent: 105, duration: 1.4, stagger: 0.08 }, 0.55)
      .from('.h-found', { yPercent: 105, duration: 1.2 }, 0.85)
      .from('.h-fade', { opacity: 0, y: 18, duration: 1.1, stagger: 0.09 }, 1.0)

    const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true }
    gsap.to('.h-shade', { opacity: 0.45, ease: 'none', scrollTrigger: st })
    // parallax scales with the device: full on desktop, half on tablet, none on phones
    // same layered parallax on every device; distances scale with the viewport
    const k = distanceScale()
    gsap.to('.h-media-inner', { yPercent: 10, ease: 'none', scrollTrigger: st })
    gsap.to('.h-name', { y: 150 * k, ease: 'none', scrollTrigger: st })
    gsap.to('.h-info', { y: 70 * k, ease: 'none', scrollTrigger: st })
  }, [show])

  return (
    <section id="top" ref={ref} aria-label="NADI Foundation" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-navy-deep text-ivory">
      {/* media */}
      <div className="h-media absolute inset-0 overflow-hidden">
        <div className="h-media-inner absolute inset-0 will-change-transform">
          <HeroMedia onShot={setShot} />
        </div>
      </div>
      {/* legibility washes */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,48,88,.92) 0%, rgba(7,48,88,.62) 36%, rgba(7,48,88,0) 64%, rgba(7,48,88,0) 82%, rgba(7,48,88,.45) 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0 hidden xl:block" style={{ background: 'linear-gradient(to right, rgba(7,48,88,.3), transparent 45%, transparent 55%, rgba(7,48,88,.55) 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0 xl:hidden" style={{ background: 'linear-gradient(to top, rgba(7,48,88,.95) 0%, rgba(7,48,88,.82) 48%, rgba(7,48,88,.32) 74%, rgba(7,48,88,.45) 100%)' }} />
      <div aria-hidden="true" className="h-shade absolute inset-0 bg-navy-deep opacity-0" />

      {/* identity */}
      <div className="frame relative flex h-full flex-col justify-end pb-20 sm:pb-20 xl:pb-20">
        <div className="grid items-end gap-x-8 gap-y-6 sm:gap-y-8 xl:grid-cols-12">
          <div className="h-name xl:col-span-8">
            <span className="mb-6 hidden xl:block"><LogoMotion variant="dark" play={show} delay={0.35} ripple className="h-14 w-auto" /></span>
            <p className="h-fade eyebrow mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-ivory/80 sm:mb-6">
              Youth-driven nonprofit <span aria-hidden="true" className="h-px w-6 bg-ivory/40" /> Thiruvananthapuram, Kerala
            </p>
            <h1 className="display relative leading-[0.78]">
              <span className="sr-only">NADI Foundation</span>
              <span aria-hidden="true" className="relative flex text-[clamp(6.4rem,min(55vw,36svh),27rem)] tracking-[-0.06em] xl:text-[min(36vw,56svh,34rem)]">
                {'NADI'.split('').map((ch, k) => (
                  <span key={k} className="inline-block overflow-hidden pb-[0.02em]"><span className="h-letter inline-block">{ch}</span></span>
                ))}
                <Doodle kind="waves" trigger="manual" play={show} delay={1.55} duration={1.3}
                  className="absolute -bottom-[0.07em] left-[1%] h-[0.1em] w-[97%] text-[#78BAEC]" />
              </span>
              <span aria-hidden="true" className="mt-4 block overflow-hidden xl:hidden">
                <span className="h-found block text-[min(13.2vw,11svh)] tracking-[-0.04em] text-[#BFD6EC]">FOUNDATION</span>
              </span>
            </h1>
          </div>

          <div className="h-info max-w-xl xl:col-span-4 xl:max-w-none xl:pb-[1.2vw]">
            <span aria-hidden="true" className="hidden overflow-hidden xl:block">
              <span className="h-found display block text-[clamp(2.4rem,min(5.1vw,7.5svh),5.4rem)] leading-[0.85] tracking-[-0.04em] text-[#BFD6EC]">FOUNDATION</span>
            </span>
            <div>
              <p className="h-fade accent text-[clamp(1.35rem,2vw,1.8rem)] text-ivory xl:mt-5">Equity, Equality &amp; Innovation.</p>
              <p className="h-fade eyebrow mt-2 text-[#BFD6EC]">Collective Action &amp; Sustainability</p>
              <p className="h-fade mt-4 max-w-md text-[15.5px] leading-relaxed text-ivory/80">{org.intro}</p>
              <div className="h-fade mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <PillLink href="#work" onClick={(e) => onAnchor(e, '#work')} variant="ivory">Discover Our Work</PillLink>
                <Link to="/donate" className="inline-flex min-h-[48px] items-center rounded-full border border-ivory/40 px-6 text-[14px] font-semibold text-ivory transition-colors hover:bg-ivory hover:text-navy-deep">Donate</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer strip: what's on screen + scroll cue */}
      <div className="h-fade frame absolute inset-x-0 bottom-0 flex items-center justify-between pb-5 text-[12px] text-ivory/65">
        <p className="flex items-center gap-3">
          {!heroVideo.src && (
            <span className="flex gap-1" aria-hidden="true">
              {FILM.map((_, k) => <span key={k} className={`h-[3px] rounded-full transition-all duration-500 ${k === shot ? 'w-6 bg-ivory' : 'w-2 bg-ivory/30'}`} />)}
            </span>
          )}
          <AnimatePresence mode="wait">
            <motion.span key={heroVideo.src ? 'v' : shot} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
              {heroVideo.src ? 'NADI Foundation in the community' : FILM[shot].caption}
            </motion.span>
          </AnimatePresence>
        </p>
        <a href="#focus" onClick={(e) => onAnchor(e, '#focus')} className="hidden min-h-[44px] items-center gap-2 font-semibold uppercase tracking-[0.18em] text-ivory/80 hover:text-ivory sm:flex">
          Scroll <ArrowDown size={14} />
        </a>
      </div>
    </section>
  )
}
