import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRevealed, prefersReducedMotion } from '../lib/intro.js'
import { gsap, useGsap } from '../lib/gsap.js'
import { SceneDefs, Sky, FarHills, Banks, River, NearBank, driveKites, WATER, GRAIN } from './hero/RiverScene.jsx'

/**
 * Landing: a cut-paper Kerala backwater at golden hour — hills, palms, the river (nadi), and NADI's
 * people on the near bank flying kites, talking, pointing at the sky — and the name, filled with
 * flowing water. Nothing else.
 *
 * Motion: the layers rise into place far-to-near and the name surfaces line by line; the water inside
 * the letters keeps flowing; kites drift on their strings, ripples slide downstream, the boat rocks.
 * Pointer and scroll move each layer at its own depth. Loops pause off-screen.
 * Reduced motion: the finished scene, still.
 */

const WORDS = ['NADI', 'FOUNDATION']
const DEPTH = [6, 10, 16, 20, 30] // pointer travel (px) per layer, far → near

export default function NadiHero() {
  const show = useRevealed()
  const ref = useRef(null)
  const title = useRef(null)
  const [off, setOff] = useState(false)

  // NADI and FOUNDATION set to one width — a justified lockup, sized to the title box and capped by height
  useLayoutEffect(() => {
    const box = title.current
    const fit = () => {
      if (!box.offsetWidth) return
      const [ln, lf] = box.querySelectorAll('.nh-word')
      ln.style.fontSize = lf.style.fontSize = '100px'
      const wn = ln.offsetWidth, wf = lf.offsetWidth
      const H = ref.current.offsetHeight
      const sn = Math.min((100 * box.clientWidth) / wn, (H * 0.4) / (0.86 + (0.98 * wn) / wf))
      ln.style.fontSize = `${sn}px`
      lf.style.fontSize = `${(wn * sn) / wf}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  // kites in their resting pose straight away (also the reduced-motion picture)
  useLayoutEffect(() => { driveKites(ref.current, 0, true) }, [])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOff(!e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // kites fly while the hero is on screen
  useEffect(() => {
    if (!show || off || prefersReducedMotion()) return
    const t0 = performance.now()
    const tick = () => driveKites(ref.current, (performance.now() - t0) / 1000)
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [show, off])

  // starting state, before the intro hands over
  useGsap(ref, () => {
    gsap.set('.nh-l0', { opacity: 0, scale: 1.08 })
    gsap.set(['.nh-l1', '.nh-l2', '.nh-l3', '.nh-l4'], { yPercent: (i) => 10 + i * 5 })
    gsap.set('.nh-word', { yPercent: 105 })
    gsap.set(['.rs-kite', '.rs-strings'], { opacity: 0 })
  })

  useGsap(ref, () => {
    if (!show) return
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('.nh-l0', { opacity: 1, scale: 1, duration: 1.8 }, 0)
      .to(['.nh-l1', '.nh-l2', '.nh-l3', '.nh-l4'], { yPercent: 0, duration: 1.9, stagger: 0.14 }, 0.15)
      .to('.nh-word', { yPercent: 0, duration: 1.4, stagger: 0.14 }, 0.6)
      .to(['.rs-strings', '.rs-kite'], { opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power2.out' }, 1.3)

    // scroll away: the far world sinks slower than the near — and the name lifts out
    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      .to('.nh-l0', { yPercent: 22, ease: 'none' }, 0)
      .to('.nh-l1', { yPercent: 16, ease: 'none' }, 0)
      .to('.nh-l2', { yPercent: 11, ease: 'none' }, 0)
      .to('.nh-l3', { yPercent: 6, ease: 'none' }, 0)
      .to('.nh-title', { yPercent: -40, opacity: 0.15, ease: 'none' }, 0)

    if (window.matchMedia('(pointer: fine)').matches) {
      const qs = ['.nh-l0', '.nh-l1', '.nh-l2', '.nh-l3', '.nh-l4'].map((c) => gsap.quickTo(c, 'x', { duration: 1.4, ease: 'power3.out' }))
      const tx = gsap.quickTo('.nh-title-in', 'x', { duration: 1.2, ease: 'power3.out' })
      const ty = gsap.quickTo('.nh-title-in', 'y', { duration: 1.2, ease: 'power3.out' })
      const move = (e) => {
        const dx = e.clientX / window.innerWidth - 0.5, dy = e.clientY / window.innerHeight - 0.5
        qs.forEach((q, i) => q(-dx * DEPTH[i] * 2))
        tx(dx * 14); ty(dy * 10)
      }
      window.addEventListener('pointermove', move, { passive: true })
      return () => window.removeEventListener('pointermove', move)
    }
  }, [show])

  // layers are oversized so parallax never shows an edge; ground stays on the bottom
  const L = 'absolute -left-12 -right-12 -top-32 bottom-0 will-change-transform'

  return (
    <section id="top" ref={ref} aria-label="NADI Foundation"
      className={`nh relative h-[100svh] min-h-[600px] overflow-hidden bg-[#1C3557] ${off ? 'is-off' : ''}`}>
      <SceneDefs />
      <div className={`nh-l0 ${L}`}><Sky /></div>
      <div className={`nh-l1 ${L}`}><FarHills /></div>
      <div className={`nh-l2 ${L}`}><Banks /></div>
      <div className={`nh-l3 ${L}`}><River /></div>

      {/* the name, filled with flowing water */}
      <div className="nh-title absolute inset-x-0 top-[15svh] z-[3] px-[5vw] sm:top-[17svh]">
        <div ref={title} className="nh-title-in w-full sm:w-[64vw] lg:w-[56vw]">
          <h1 className="font-display font-extrabold uppercase leading-[0.84] tracking-[-0.04em]">
            <span className="sr-only">NADI Foundation</span>
            {WORDS.map((w, i) => (
              <span key={w} aria-hidden="true" className={`nh-line block overflow-hidden pb-[0.05em] ${i ? 'mt-[0.1em]' : ''}`}>
                <span className="nh-word inline-block whitespace-nowrap" style={{ backgroundImage: WATER, animationDuration: `${34 + i * 9}s`, animationDirection: i ? 'reverse' : 'normal' }}>{w}</span>
              </span>
            ))}
          </h1>
        </div>
      </div>

      <div className={`nh-l4 z-[2] ${L}`}><NearBank /></div>

      {/* paper grain over everything */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] opacity-[.22] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
    </section>
  )
}
