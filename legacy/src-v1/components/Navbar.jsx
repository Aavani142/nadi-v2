import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { nav, navHref, logos, contact } from '../data/nadi.js'
import { useAnchorClick } from '../lib/anchors.js'
import { lockScroll } from '../lib/SmoothScroll.jsx'
import { useRevealed, useDarkMode } from '../lib/intro.js'
import { EASE } from './ui.jsx'

const SECTIONS = nav.map((n) => n.section)

function useActiveSection(enabled) {
  const [active, setActive] = useState('top')
  useEffect(() => {
    if (!enabled) return
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [enabled])
  return active
}

/** Renders a nav item as a page link (once that page exists) or as a homepage section anchor. */
function NavLink({ item, className, onAnchor, after, children, ...rest }) {
  if (item.page) return <Link to={item.path} className={className} onClick={after} {...rest}>{children}</Link>
  const href = navHref(item)
  return <a href={href} onClick={(e) => onAnchor(e, href, after)} className={className} {...rest}>{children}</a>
}

export default function Navbar() {
  const { pathname } = useLocation()
  const home = pathname === '/'
  const revealed = useRevealed()
  const onAnchor = useAnchorClick()
  const active = useActiveSection(home)
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const dark = useDarkMode()
  // full-colour logo only on the light solid bar; ivory-wordmark variant on the hero, the menu and in dark mode
  const lightBar = false // the bar is always on a dark ground now

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > window.innerHeight * 0.75 || !home)
    setHidden((h) => (y > 700 && y > prev + 2 ? true : y < prev - 2 ? false : h))
  })
  useEffect(() => { setSolid(!home || window.scrollY > window.innerHeight * 0.75) }, [home])
  useEffect(() => { lockScroll(open) }, [open])
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const links = nav.filter((n) => !n.cta)
  const cta = nav.find((n) => n.cta)
  const tone = 'text-ivory'

  return (
    <>
      <motion.header className={`fixed inset-x-0 top-0 ${open ? 'z-[60]' : 'z-50'}`}
        initial={{ y: -100 }} animate={{ y: !revealed ? -100 : hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: revealed && !solid ? 0.9 : 0 }}>
        <div className={`transition-[background-color,box-shadow,backdrop-filter] duration-500 ${solid && !open ? 'bg-navy-deep/90 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md' : 'bg-transparent'}`}>
          {!solid && !open && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-navy-deep/60 to-transparent" />}
          <nav aria-label="Primary" className={`frame flex items-center justify-between gap-6 transition-[height] duration-500 ${solid ? 'h-16' : 'h-20'}`}>
            {/* transparent logo: ivory wordmark over the dark hero / open menu, full colour on the light bar */}
            <a href="#top" onClick={(e) => onAnchor(e, '#top')} className="relative z-[60] grid shrink-0" aria-label="NADI Foundation — home">
              <img src={logos.onDark} alt="" aria-hidden="true"
                className={`col-start-1 row-start-1 w-auto transition-all duration-500 ${solid ? 'h-9' : 'h-11 sm:h-12'} ${lightBar ? 'opacity-0' : 'opacity-100'}`} />
              <img src={logos.full} alt="NADI Foundation"
                className={`col-start-1 row-start-1 w-auto transition-all duration-500 ${solid ? 'h-9' : 'h-11 sm:h-12'} ${lightBar ? 'opacity-100' : 'opacity-0'}`} />
            </a>

            <ul className={`hidden items-center gap-0.5 xl:flex ${tone}`}>
              {links.map((n) => {
                const isActive = home && active === n.section
                return (
                  <li key={n.id}>
                    <NavLink item={n} onAnchor={onAnchor} aria-current={isActive ? 'location' : undefined}
                      className={`group relative block px-2.5 py-2 text-[13.5px] font-semibold transition-opacity ${isActive ? 'opacity-100' : 'opacity-75 hover:opacity-100'}`}>
                      {n.label}
                      <span className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100 bg-ivory/50`} />
                      {isActive && <motion.span layoutId="nav-active" className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full ${solid ? 'bg-sun' : 'bg-white'}`} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    </NavLink>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-2">
              <NavLink item={cta} onAnchor={onAnchor}
                className="group hidden items-center gap-2 rounded-full bg-sun px-5 py-2.5 text-[13.5px] font-semibold text-navy-deep transition-colors duration-300 hover:bg-white sm:inline-flex">
                {cta.label}
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </NavLink>
              <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}
                className={`relative z-[60] grid h-11 w-11 place-items-center rounded-full transition-colors xl:hidden ${open ? 'bg-ivory text-navy' : 'bg-ivory/15 text-ivory backdrop-blur'}`}>
                <span className="relative block h-3 w-5">
                  <span className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                  <span className={`absolute left-0 h-[1.5px] bg-current transition-all duration-300 ${open ? 'top-1.5 w-5 -rotate-45' : 'top-3 w-3.5'}`} />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu"
            className="fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-navy px-5 pb-8 pt-24 text-ivory sm:px-8 xl:hidden"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
            <ul className="flex flex-col">
              {nav.map((n, i) => (
                <li key={n.id} className="overflow-hidden border-b border-white/10">
                  <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.2 + i * 0.04, ease: EASE }}>
                    <NavLink item={n} onAnchor={onAnchor} after={() => setOpen(false)}
                      className="flex items-baseline justify-between py-2.5 font-display text-[clamp(1.8rem,8vw,2.8rem)] font-bold tracking-[-0.04em]">
                      <span className={home && active === n.section ? 'text-mustard' : n.cta ? 'text-mustard' : ''}>{n.label}</span>
                      <span className="eyebrow tabular-nums text-white/40">{String(i + 1).padStart(2, '0')}</span>
                    </NavLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div className="mt-auto grid gap-1 pt-10 text-sm text-white/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <a href={`tel:+91${contact.phone}`} className="w-fit">{contact.phoneDisplay}</a>
              <a href={`mailto:${contact.email}`} className="w-fit break-all">{contact.email}</a>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                {contact.socials.map((s) => <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="eyebrow text-white">{s.label} {s.handle}</a>)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
