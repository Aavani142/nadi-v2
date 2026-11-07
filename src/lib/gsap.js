import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

// All bundled with GSAP 3.13+ under its standard (free) licence.
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText, ScrambleTextPlugin)
gsap.defaults({ ease: 'expo.out', duration: 1.2 })

export { gsap, ScrollTrigger, SplitText }

if (typeof document !== 'undefined' && document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh())

export const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Scoped GSAP for React. Everything created inside `fn` (tweens, timelines, ScrollTriggers) is
 * reverted on unmount or when `deps` change, so triggers never duplicate or leak.
 * With reduced motion the callback is skipped and content renders in its final state.
 */
export function useGsap(scope, fn, deps = []) {
  useLayoutEffect(() => {
    if (!scope.current || reducedMotion()) return
    const ctx = gsap.context((self) => fn(self), scope.current)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Standard scroll reveals, applied by data attribute inside a scope:
 *  [data-reveal]        rise with a slight tilt that settles (paper set down)
 *  [data-reveal-img]    a torn-edged sheet laid down, with an inner zoom (wrap the <img> directly)
 *  [data-reveal-lines]  children slide up from a mask (children must sit in overflow-hidden wrappers) */
/** Same animations on every device — only travel distances scale with the viewport (never below 60%). */
export const distanceScale = () => Math.min(1, Math.max(0.6, window.innerWidth / 1440))

export function revealIn(scope) {
  const k = distanceScale()
  // paper set down: rise with a slight tilt that settles flat — the landing's layers rising into place
  gsap.utils.toArray('[data-reveal]', scope).forEach((el) => {
    gsap.from(el, { y: 40 * k, rotate: -1.2, transformOrigin: '0% 100%', opacity: 0, duration: 1.3, ease: 'expo.out', delay: Number(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
  })
  // photographs: a torn sheet laid down, the picture easing in beneath
  gsap.utils.toArray('[data-reveal-img]', scope).forEach((el) => {
    const img = el.querySelector('img')
    el.classList.add('paper-edge')
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true }, delay: Number(el.dataset.delay || 0) })
    tl.from(el, { y: 70 * k, rotate: el.dataset.revealImg === 'left' ? -2.6 : -1.8, transformOrigin: '0% 100%', opacity: 0, duration: 1.5, ease: 'expo.out' })
    if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
  })
  gsap.utils.toArray('[data-reveal-lines]', scope).forEach((el) => {
    gsap.from(el.querySelectorAll('[data-line]'), { yPercent: 110, duration: 1.2, stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
  })
  gsap.utils.toArray('[data-parallax]', scope).forEach((el) => {
    const d = Number(el.dataset.parallax || 60) * k
    gsap.fromTo(el, { y: d }, { y: -d, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
  })
}

// Test builds only (VITE_EXPOSE_GSAP=1): lets browser tests count live ScrollTriggers. Stripped from normal builds.
if (import.meta.env.VITE_EXPOSE_GSAP && typeof window !== 'undefined') window.__ScrollTrigger = ScrollTrigger
