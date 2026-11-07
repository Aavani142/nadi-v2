
/** @type {null | { stop(): void, start(): void, resize(): void, scrollTo(...a: any[]): void }} */
const instance = null

/**
 * Native scrolling. Lenis used to drive every frame through its own requestAnimationFrame loop,
 * which was the single biggest constant cost on the page — the browser's own scroll is smoother
 * on low-end phones and lets GPU compositing do its job. `instance` stays null, so every helper
 * below falls back to native window.scrollTo({ behavior: 'smooth' }).
 */
// eslint-disable-next-line no-unused-vars
export default function SmoothScroll({ paused }) {
  return null
}

export function lockScroll(lock) {
  if (instance) (lock ? instance.stop() : instance.start())
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

export function scrollToY(y) {
  if (instance) instance.resize()
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
    // after a route change the page height has just changed — let Lenis re-measure, or it clamps the jump to the old page's length
    instance.resize()
    instance.scrollTo(el ?? 0, { offset: 0, immediate, force: true, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    const top = el ? el.getBoundingClientRect().top + window.scrollY : 0
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
  }
  if (window.location.hash !== `#${id}` && id !== 'top') history.replaceState(null, '', `#${id}`)
  if (id === 'top') history.replaceState(null, '', window.location.pathname)
  return true
}
