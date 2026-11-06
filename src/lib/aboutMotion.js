import { gsap, SplitText, distanceScale } from './gsap.js'

/**
 * The About page's own motion language — deliberately different from the homepage:
 *   headings   letters flip up in 3D, one by one (SplitText)       · homepage: lines rise from a mask
 *   photos     venetian-blind shutter opening slat by slat          · homepage: single clip wipe
 *   body text  slides in from the side, sharpening out of a blur    · homepage: rises
 *   eyebrows   type-scramble into place                             · homepage: fade
 * Call inside a gsap.context (useGsap) — everything here, including injected slats and split
 * text, is undone when the context reverts.
 */

/** 3D letter flip for an element's text. */
export function flipChars(targets, { delay = 0, trigger, stagger = 0.022, paused = false } = {}) {
  const split = SplitText.create(targets, { type: 'chars,words', charsClass: 'ab-char' })
  gsap.set(targets, { perspective: 600 })
  const tween = gsap.from(split.chars, {
    rotationX: -95, yPercent: 40, opacity: 0, transformOrigin: '50% 100% -12px',
    duration: 1, stagger, ease: 'expo.out', delay, paused,
    ...(trigger ? { scrollTrigger: { trigger, start: 'top 85%', once: true } } : {}),
  })
  return { split, tween }
}

/** Venetian-blind reveal: slats in the section's own colour retract one after another. */
export function blinds(el, { slats = 7, delay = 0, trigger = el, vertical = true, color } = {}) {
  const bg = color || getComputedStyle(el.closest('section') || document.body).backgroundColor
  const wrap = document.createElement('div')
  wrap.setAttribute('aria-hidden', 'true')
  Object.assign(wrap.style, { position: 'absolute', inset: '0', display: 'flex', flexDirection: vertical ? 'row' : 'column', pointerEvents: 'none', zIndex: '2' })
  for (let i = 0; i < slats; i++) {
    const s = document.createElement('div')
    // 1px overlap so no hairline shows between slats
    Object.assign(s.style, { flex: '1 1 0', background: bg, margin: vertical ? '0 -0.5px' : '-0.5px 0' })
    wrap.appendChild(s)
  }
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
  el.appendChild(wrap)
  const img = el.querySelector('img')
  const tl = gsap.timeline({ delay, ...(trigger ? { scrollTrigger: { trigger, start: 'top 85%', once: true } } : {}) })
  tl.to(wrap.children, {
    [vertical ? 'scaleX' : 'scaleY']: 0, transformOrigin: vertical ? '100% 50%' : '50% 0%',
    duration: 1.1, ease: 'expo.inOut', stagger: { each: 0.08, from: 'start' },
  })
  if (img) tl.fromTo(img, { scale: 1.18, xPercent: vertical ? -3 : 0 }, { scale: 1, xPercent: 0, duration: 1.8, ease: 'expo.out' }, 0)
  tl.add(() => wrap.remove())
  return () => wrap.remove() // for context cleanup if unmounted mid-way
}

/** Apply the About language to every marked element inside `scope`. Returns a cleanup. */
export function aboutReveals(scope) {
  const k = distanceScale()
  const cleanups = []
  gsap.utils.toArray('[data-reveal-lines]', scope).forEach((el) => {
    // the line masks would clip the 3D flip — open them; the flip itself provides the entrance
    el.querySelectorAll('.overflow-hidden').forEach((m) => m.classList.remove('overflow-hidden'))
    const { split } = flipChars(el.querySelectorAll('[data-line]'), { trigger: el })
    cleanups.push(() => split.revert())
  })
  gsap.utils.toArray('[data-reveal]', scope).forEach((el) => {
    gsap.from(el, {
      x: -32 * k, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out', delay: Number(el.dataset.delay || 0),
      clearProps: 'filter',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
  gsap.utils.toArray('[data-reveal-img]', scope).forEach((el) => cleanups.push(blinds(el, { delay: Number(el.dataset.delay || 0) })))
  gsap.utils.toArray('.ab-scramble', scope).forEach((el) => {
    const text = el.textContent
    gsap.from(el, { opacity: 0, duration: 0.3, scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
    gsap.to(el, {
      duration: 1.2, ease: 'none', scrambleText: { text, chars: 'NADI—·01', revealDelay: 0.25, speed: 0.6 },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    })
  })
  return () => cleanups.forEach((c) => c())
}
