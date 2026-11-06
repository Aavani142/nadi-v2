import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { logos } from '../data/nadi.js'
import { gsap, reducedMotion } from '../lib/gsap.js'

/**
 * The official NADI logo, assembled from its own layers (the files are untouched — they are only
 * positioned exactly where they sit in nadi-logo.png and animated):
 *   1  the lower wave flows in from the left       — the river (nadi) arrives
 *   2  the upper wave answers from the right
 *   3  the sun rises above the water
 *   4  the wordmark writes itself in, left to right
 * Then, optionally, a slow idle: the two waves drift against each other and the sun breathes —
 * small enough (±2%) that the logo always reads as the logo.
 *
 * Geometry: the full logo is 723×225; the mark occupies x 0–321, the wordmark x 321–723.
 */
const MARK_W = (321 / 723) * 100

const LogoMotion = forwardRef(function LogoMotion(
  { variant = 'dark', play = true, idle = true, ripple = false, delay = 0, speed = 1, className = '', alt = 'NADI Foundation', onAssembled },
  ref,
) {
  const root = useRef(null)
  const tl = useRef(null)

  /** gentle wave ripple — on hover (mouse) or tap (touch) */
  const doRipple = () => {
    if (reducedMotion() || !root.current) return
    const [w2, w1] = root.current.querySelectorAll('.lm-wave')
    gsap.timeline().to(w1, { xPercent: 4, duration: 0.35, ease: 'sine.inOut' }).to(w1, { xPercent: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
    gsap.timeline().to(w2, { xPercent: -5, duration: 0.4, ease: 'sine.inOut' }).to(w2, { xPercent: 0, duration: 1, ease: 'elastic.out(1, 0.4)' })
  }
  useImperativeHandle(ref, () => ({ ripple: doRipple }))

  useLayoutEffect(() => {
    if (!root.current) return
    const reduce = reducedMotion()
    const ctx = gsap.context(() => {
      if (reduce) return
      const t = gsap.timeline({ paused: true, delay, defaults: { ease: 'expo.out' }, onComplete: () => onAssembled?.() })
      t.fromTo('.lm-wave2', { xPercent: -24, clipPath: 'inset(0% 100% 0% 0%)' }, { xPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 })
        .fromTo('.lm-wave1', { xPercent: 24, clipPath: 'inset(0% 0% 0% 100%)' }, { xPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 }, 0.14)
        .fromTo('.lm-sun', { yPercent: 46, scale: 0.55, opacity: 0, transformOrigin: '80% 30%' }, { yPercent: 0, scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.6)' }, 0.42)
        .fromTo('.lm-word', { clipPath: 'inset(0% 100% 0% 0%)', x: -10 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 1.1, ease: 'power3.inOut' }, 0.62)
      t.timeScale(speed)
      tl.current = t
      if (idle) {
        // slow, opposed drift — starts once assembled
        t.add(() => {
          gsap.to('.lm-wave1', { xPercent: 2, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
          gsap.to('.lm-wave2', { xPercent: -2, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
          gsap.to('.lm-sun', { yPercent: -3, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        })
      }
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (!tl.current) return
    if (play) tl.current.play()
  }, [play])

  const word = variant === 'dark' ? logos.wordmarkOnDark : logos.wordmarkOnLight
  const layer = 'absolute inset-0 h-full w-full select-none'
  return (
    <span
      ref={root}
      role="img"
      aria-label={alt}
      onMouseEnter={ripple ? doRipple : undefined}
      onTouchStart={ripple ? doRipple : undefined}
      className={`relative inline-block aspect-[723/225] ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0" style={{ width: `${MARK_W}%` }}>
        <img src={logos.wave2} alt="" draggable="false" className={`lm-wave lm-wave2 ${layer}`} />
        <img src={logos.wave1} alt="" draggable="false" className={`lm-wave lm-wave1 ${layer}`} />
        <img src={logos.sun} alt="" draggable="false" className={`lm-sun ${layer}`} />
      </span>
      <img src={word} alt="" aria-hidden="true" draggable="false" className="lm-word absolute inset-y-0 right-0 h-full select-none" style={{ width: `${100 - MARK_W}%` }} />
    </span>
  )
})

export default LogoMotion
