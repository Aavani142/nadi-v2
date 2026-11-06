import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion.js'

let lenis = null

/** Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays perfectly in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis?.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])
}

export function lockScroll(lock) {
  if (lenis) (lock ? lenis.stop() : lenis.start())
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

/** Scroll to a section id ('top' for the top of the page). Returns false if it isn't on this page. */
export function scrollToSection(id, { immediate = false } = {}) {
  const el = id === 'top' ? 0 : document.getElementById(id)
  if (el === null) return false
  if (lenis) lenis.scrollTo(el, { immediate, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else if (el === 0) window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  return true
}

export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}
