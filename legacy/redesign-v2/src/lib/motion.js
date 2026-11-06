import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'expo.out', duration: 1.2 })

export { gsap, ScrollTrigger }

/** Shared easing for Framer Motion, matching GSAP's expo.out. */
export const EXPO = [0.16, 1, 0.3, 1]

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Runs GSAP code scoped to `scope` and reverts everything on unmount (safe under StrictMode).
 * The callback is skipped entirely when the visitor prefers reduced motion, so content
 * simply renders in its final state.
 */
export function useGsap(scope, fn, deps = []) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context((self) => fn(self), scope.current)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Format a figure the way the Annual Report prints it (Indian grouping). */
export const fmt = (n) => Math.round(n).toLocaleString('en-IN')
