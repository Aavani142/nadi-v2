import { useEffect } from 'react'
import Lenis from 'lenis'

let instance = null

export default function SmoothScroll({ paused }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    instance = l
    let id
    const raf = (t) => { l.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); l.destroy(); instance = null }
  }, [])
  useEffect(() => {
    if (instance) (paused ? instance.stop() : instance.start())
  }, [paused])
  return null
}

export function lockScroll(lock) {
  if (instance) (lock ? instance.stop() : instance.start())
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

export function scrollToY(y) {
  if (instance) instance.scrollTo(y, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

/** Scroll to "#id" (or "#top") — smooth via Lenis when available. */
export function scrollToHash(hash, { immediate = false } = {}) {
  const id = hash.replace('#', '')
  const el = id === 'top' ? null : document.getElementById(id)
  if (id !== 'top' && !el) return false
  if (instance) {
    // Sections carry their own top padding and the navbar hides while scrolling down, so no offset.
    instance.scrollTo(el ?? 0, { offset: 0, immediate, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    const top = el ? el.getBoundingClientRect().top + window.scrollY : 0
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
  }
  if (window.location.hash !== `#${id}` && id !== 'top') history.replaceState(null, '', `#${id}`)
  if (id === 'top') history.replaceState(null, '', window.location.pathname)
  return true
}
