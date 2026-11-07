import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { contact, logos, nav } from '../data/nadi.js'
import { gsap, reducedMotion } from '../lib/gsap.js'

/**
 * Full-screen navigation for phones and tablets (hidden at xl, where the inline nav shows).
 * GSAP timeline: a blue wave panel sweeps up, the navy sheet follows, the items rise one by one,
 * then the Donate CTA and contact details fade in. Closing plays it in reverse.
 * The component stays mounted until the closing animation has finished.
 */
export default function MobileMenu({ open, onClose, isActive, renderLink }) {
  const root = useRef(null)
  const tl = useRef(null)
  const [mounted, setMounted] = useState(open)
  if (open && !mounted) setMounted(true)

  useLayoutEffect(() => {
    if (!mounted || !root.current) return
    const reduce = reducedMotion()
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' }, onReverseComplete: () => setMounted(false) })
      if (reduce) {
        tl.current.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' })
      } else {
        tl.current
          .fromTo('.mm-wave', { yPercent: 100 }, { yPercent: 0, duration: 0.7 })
          .fromTo('.mm-sheet', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75 }, 0.12)
          .fromTo('.mm-item', { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.045, ease: 'expo.out' }, 0.45)
          .fromTo('.mm-num', { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.045, ease: 'none' }, 0.6)
          .fromTo('.mm-foot', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'expo.out' }, 0.75)
      }
    }, root)
    return () => ctx.revert()
  }, [mounted])

  useLayoutEffect(() => {
    if (!tl.current) return
    if (open) tl.current.timeScale(1).play()
    else tl.current.timeScale(1.8).reverse()
  }, [open, mounted])

  if (!mounted) return null
  const links = nav.filter((n) => !n.cta)
  const cta = nav.find((n) => n.cta)

  return (
    <div ref={root} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" className="fixed inset-0 z-[70] xl:hidden">
      {/* the wave layer that leads the sheet in */}
      <div aria-hidden="true" className="mm-wave absolute inset-0 bg-blue">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 -top-[39px] h-10 w-full text-blue">
          <path d="M0 48 C 180 10, 360 10, 540 40 S 900 78, 1080 44 S 1320 12, 1440 34 V80 H0 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="mm-sheet absolute inset-0 flex flex-col overflow-y-auto bg-navy-deep text-ivory" data-lenis-prevent>
        <div className="frame flex h-20 shrink-0 items-center justify-between">
          <img src={logos.onDark} alt="NADI Foundation" className="h-11 w-auto sm:h-12" />
          <button type="button" onClick={onClose} aria-label="Close menu"
            className="grid h-12 w-12 place-items-center rounded-full bg-ivory text-navy-deep transition-transform active:scale-95">
            <X size={20} />
          </button>
        </div>

        <nav aria-label="Mobile" className="frame mt-4 flex-1 sm:mt-10">
          <ul className="grid sm:grid-cols-2 sm:gap-x-10">
            {links.map((n, i) => {
              const on = isActive(n)
              return (
                <li key={n.id} className="overflow-hidden border-b border-white/10">
                  <div className="mm-item">
                    {renderLink(n, {
                      'aria-current': on ? 'page' : undefined,
                      className: 'group flex min-h-[56px] items-center justify-between gap-4 py-2',
                      children: (
                        <>
                          <span className="flex items-center gap-3">
                            <span aria-hidden="true" className={`h-2 w-2 rounded-full transition-colors ${on ? 'bg-[#F2B27E]' : 'bg-transparent'}`} />
                            <span className={`font-display text-[clamp(1.9rem,8.4vw,3rem)] font-bold leading-none tracking-[-0.04em] transition-colors ${on ? 'text-[#F2C9A0]' : 'text-ivory group-active:text-[#F2C9A0]'}`}>{n.label}</span>
                          </span>
                          <span className="mm-num eyebrow tabular-nums text-white/35">{String(i + 1).padStart(2, '0')}</span>
                        </>
                      ),
                    })}
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="frame shrink-0 pb-8 pt-8">
          <div className="mm-foot">
            {renderLink(cta, {
              className: 'flex min-h-[60px] w-full items-center justify-between rounded-full bg-ivory pl-7 pr-2 text-[17px] font-semibold text-navy-deep sm:w-auto sm:gap-10',
              children: (
                <>
                  Donate to NADI
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-deep text-ivory"><ArrowUpRight size={18} /></span>
                </>
              ),
            })}
          </div>
          <div className="mm-foot mt-6 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-white/65">
            <a href={`tel:+91${contact.phone}`} className="inline-flex min-h-[44px] items-center">{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`} className="inline-flex min-h-[44px] items-center break-all">{contact.email}</a>
          </div>
        </div>
      </div>
    </div>
  )
}
