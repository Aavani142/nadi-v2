import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRevealed, prefersReducedMotion, useMedia } from '../lib/intro.js'
import { gsap, useGsap } from '../lib/gsap.js'
import { SceneDefs, Sky, FarHills, Banks, River, NearBank, driveKites, GRAIN, Portrait } from './hero/RiverScene.jsx'
import { PhoneSky, PhoneHills, PhoneLand, PhoneRiver, PhoneNear } from './hero/PhoneScene.jsx'

/**
 * Landing: a cut-paper Kerala backwater at golden hour — hills, palms, the river (nadi), and NADI's
 * people on the near bank flying kites, talking, pointing at the sky — and the name: one huge, clean,
 * white "Nadi" across the sky, set inside the scene's depth so palms and kites pass in front of it.
 *
 * Motion: the layers rise into place far-to-near and the name surfaces from behind the hills;
 * kites drift on their strings, ripples slide downstream, the boat rocks.
 * Pointer and scroll move each layer at its own depth. Loops pause off-screen.
 * Reduced motion: the finished scene, still.
 */

const WORDS = ['Nadi', 'Foundation']
const DEPTH = [6, 10, 16, 20, 30] // pointer travel (px) per layer, far → near

/** A line about NADI written lightly on the land — no call to action, just who they are. */
function LandWords({ className = '' }) {
  return (
    <p className={`pointer-events-none absolute whitespace-nowrap ${className}`}>
      <span className="block font-serif text-[clamp(9.5px,1.45vw,23px)] font-light italic leading-tight text-[#F6EADA]/70">a river of change, shaped by young people</span>
      <span className="mt-1.5 block font-mono text-[clamp(6.5px,0.72vw,11px)] max-sm:hidden uppercase tracking-[0.2em] text-[#F6EADA]/45">Thiruvananthapuram · Kerala<span className="max-xl:hidden"> · since 2022</span></span>
    </p>
  )
}

export default function NadiHero() {
  const show = useRevealed()
  const ref = useRef(null)
  const title = useRef(null)
  const kiteMin = useRef(0)
  const kiteTop = useRef(-1e4) // portrait: scene y of the bottom of the name — kites fly below it
  const [off, setOff] = useState(false)
  // phones and upright tablets get their own framing of the scene
  const portrait = useMedia('(max-aspect-ratio: 9/10)', false)
  const portraitRef = useRef(portrait)
  portraitRef.current = portrait

  // NADI and FOUNDATION set to one width — a justified lockup, sized to the title box and capped by height
  useLayoutEffect(() => {
    const box = title.current
    const fit = () => {
      if (!box.offsetWidth) return
      // the one big word fills the width of the frame, capped by the height of the sky
      const ln = box.querySelector('.nh-big')
      ln.style.fontSize = '100px'
      const wn = ln.offsetWidth, H = ref.current.offsetHeight
      const sn = Math.min((100 * box.clientWidth) / wn, H * 0.6)
      ln.style.fontSize = `${sn}px`
      // where the title ends, in scene units (layers are 1600×900, slice-anchored bottom-right, oversized
      // by 48px a side): kites stay to the right of it
      const layer = ref.current.querySelector('.nh-l4')
      if (layer) {
        const Lw = layer.offsetWidth, Lh = layer.offsetHeight, k = Math.max(Lw / 1600, Lh / 900)
        kiteMin.current = 0 // kites fly in front of the name
        // portrait framing (viewBox 1100 -60 500 960, slice, anchored bottom): where the name ends, in scene y
        const kp = Math.max(Lw / 500, Lh / 960), t = box.closest('.nh-title')
        kiteTop.current = (t.offsetTop + t.offsetHeight - layer.offsetTop - (Lh - 960 * kp)) / kp - 60
        driveKites(ref.current, 0, true, false, kiteMin.current)

        // the words on the land, placed in scene units within their own layer (so they move with it):
        // landscape — the left bank, just under the palms; portrait — the near bank, below the people
        const land = ref.current.querySelector('.nh-land')
        const kl = portraitRef.current ? Lw / 1600 : k
        if (land) land.style.top = `${Lh - 900 * kl + 676 * kl}px`
      }
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  // kites in their resting pose straight away (also the reduced-motion picture)
  useLayoutEffect(() => { driveKites(ref.current, 0, true, false, kiteMin.current) }, [portrait])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOff(!e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // kites fly while the hero is on screen
  useEffect(() => {
    if (!show || off || prefersReducedMotion()) return
    const t0 = performance.now()
    const tick = () => driveKites(ref.current, (performance.now() - t0) / 1000, false, false, kiteMin.current)
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [show, off, portrait])

  // starting state, before the intro hands over
  useGsap(ref, () => {
    gsap.set('.nh-l0', { opacity: 0, scale: 1.08 })
    gsap.set(['.nh-l1', '.nh-l2', '.nh-l3', '.nh-l4'], { yPercent: (i) => 10 + i * 5 })
    gsap.set('.nh-l2b', { yPercent: 15 }) // moves with the bank
    // the lines mask their words only while they rise — afterwards the letters and their shadow show whole
    gsap.set('.nh-line', { overflow: 'hidden' })
    gsap.set('.nh-word', { yPercent: 105 })
    gsap.set(['.rs-kite', '.rs-strings'], { opacity: 0 })
  })

  useGsap(ref, () => {
    if (!show) return
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('.nh-l0', { opacity: 1, scale: 1, duration: 1.8 }, 0)
      .to(['.nh-l1', '.nh-l2', '.nh-l3', '.nh-l4'], { yPercent: 0, duration: 1.9, stagger: 0.14 }, 0.15)
      .to('.nh-l2b', { yPercent: 0, duration: 1.9 }, 0.29)
      .to('.nh-word', { yPercent: 0, duration: 1.4, stagger: 0.14 }, 0.6)
      .set('.nh-line', { overflow: 'visible' }, 1.95)
      .to(['.rs-strings', '.rs-kite'], { opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power2.out' }, 1.3)

    // scroll away: the far world sinks slower than the near — and the name lifts out
    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      .fromTo('.nh-s0', { yPercent: 0 }, { yPercent: 22, ease: 'none' }, 0)
      .fromTo('.nh-s1', { yPercent: 0 }, { yPercent: 16, ease: 'none' }, 0)
      .fromTo('.nh-s2', { yPercent: 0 }, { yPercent: 11, ease: 'none' }, 0)
      .fromTo('.nh-s3', { yPercent: 0 }, { yPercent: 6, ease: 'none' }, 0)
      .to('.nh-title', { yPercent: -40, opacity: 0.15, ease: 'none' }, 0)

    if (window.matchMedia('(pointer: fine)').matches) {
      const qs = ['.nh-l0', '.nh-l1', '.nh-l2', '.nh-l3', '.nh-l4'].map((c) => gsap.quickTo(c, 'x', { duration: 1.4, ease: 'power3.out' }))
      const qb = gsap.quickTo('.nh-l2b', 'x', { duration: 1.4, ease: 'power3.out' })
      const tx = gsap.quickTo('.nh-title-in', 'x', { duration: 1.2, ease: 'power3.out' })
      const ty = gsap.quickTo('.nh-title-in', 'y', { duration: 1.2, ease: 'power3.out' })
      const move = (e) => {
        const dx = e.clientX / window.innerWidth - 0.5, dy = e.clientY / window.innerHeight - 0.5
        qs.forEach((q, i) => q(-dx * DEPTH[i] * 2)); qb(-dx * DEPTH[2] * 2)
        tx(dx * 14); ty(dy * 10)
      }
      window.addEventListener('pointermove', move, { passive: true })
      return () => window.removeEventListener('pointermove', move)
    }
  }, [show])

  // layers are oversized so parallax never shows an edge; ground stays on the bottom
  // phones have no pointer parallax, so their layers span the screen exactly and everyone stays in frame
  const L = `absolute ${portrait ? 'inset-x-0' : '-left-12 -right-12'} -top-32 bottom-0 will-change-transform`
  // phones: a scene of their own (hero/PhoneScene.jsx), in the same animated layers

  return (
    <section id="top" ref={ref} aria-label="NADI Foundation"
      className={`nh relative h-[100svh] ${portrait ? 'min-h-[560px]' : 'min-h-[420px]'} overflow-hidden bg-[#1C3557] ${off ? 'is-off' : ''}`}>
      <SceneDefs />
      <Portrait.Provider value={portrait}>
      <div className="nh-s0 absolute inset-0"><div className={`nh-l0 ${L}`}>{portrait ? <PhoneSky /> : <Sky />}</div></div>
      <div className="nh-s1 absolute inset-0"><div className={`nh-l1 ${L}`}>{portrait ? <PhoneHills /> : <FarHills />}</div></div>
      <div className="nh-s2 absolute inset-0"><div className={`nh-l2 ${L}`}>
        {portrait ? <PhoneLand /> : <Banks />}
        {/* a few quiet words on the land — what NADI is, in a light hand (phones: drawn in PhoneLand) */}
        {!portrait && <LandWords className="nh-land left-[calc(5vw+48px)]" />}
      </div></div>

      {/* the name, in the sky behind one palm and the kites: one huge clean word, Foundation set small beneath */}
      <div className={`nh-title absolute inset-x-0 top-[11svh] px-[4vw] sm:top-[9svh] ${portrait ? 'z-[3]' : ''}`}>
        <div ref={title} className="nh-title-in w-full">
          {/* the heading shrinks to the word, so Foundation ends exactly where Nadi does */}
          <h1 className="inline-block">
            <span className="sr-only">NADI Foundation</span>
            <span aria-hidden="true" className="nh-line block">
              <span className="nh-word nh-big inline-block whitespace-nowrap">{WORDS[0]}</span>
            </span>
            <span aria-hidden="true" className="nh-line nh-subline flex items-center justify-end gap-4 pr-[0.5vw]">
              <span className="nh-word nh-sub flex items-center gap-4"><span className="h-px w-10 bg-current opacity-60 sm:w-16" />{WORDS[1]}</span>
            </span>
          </h1>
        </div>
      </div>

      {/* the one palm that stands in front of the name */}
      {!portrait && <div className="nh-s2 absolute inset-0"><div className={`nh-l2b ${L}`}><Banks front /></div></div>}

      <div className="nh-s3 absolute inset-0"><div className={`nh-l3 ${L}`}>{portrait ? <PhoneRiver /> : <River />}</div></div>


      <div className={`nh-l4 z-[2] ${L}`}>
        {portrait ? <PhoneNear /> : <NearBank />}
      </div>
      </Portrait.Provider>

      {/* paper grain over everything */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] opacity-[.22] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
    </section>
  )
}
