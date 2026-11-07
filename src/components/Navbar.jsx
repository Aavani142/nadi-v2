import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { nav, navHref } from '../data/nadi.js'
import { useAnchorClick } from '../lib/anchors.js'
import { lockScroll } from '../lib/SmoothScroll.jsx'
import { useRevealed, useDarkMode } from '../lib/intro.js'
import { EASE } from './ui.jsx'
import MobileMenu from './MobileMenu.jsx'
import LogoMotion from './LogoMotion.jsx'

const SECTIONS = nav.map((n) => n.section).filter(Boolean)

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
  const firstIn = useRef(true) // only the very first entrance (after the loader) waits for the hero
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const dark = useDarkMode()

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
        transition={{ duration: 0.7, ease: EASE, delay: firstIn.current ? 0.9 : 0 }}
        onAnimationComplete={() => { if (revealed) firstIn.current = false }}>
        <div className={`transition-[background-color,box-shadow] duration-500 ${solid && !open ? 'bg-navy-deep/[.97] shadow-[0_1px_0_rgba(255,255,255,0.06)]' : 'bg-transparent'}`}>
          {!solid && !open && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-navy-deep/60 to-transparent" />}
          <nav aria-label="Primary" className={`frame flex items-center justify-between gap-3 sm:gap-6 transition-[height] duration-500 ${solid ? 'h-16' : 'h-20'}`}>
            {/* transparent logo: ivory wordmark over the dark hero / open menu, full colour on the light bar */}
            <a href="#top" onClick={(e) => onAnchor(e, '#top')} className="relative z-[60] grid shrink-0" aria-label="NADI Foundation — home">
              {/* the official logo, assembling itself as the header arrives; ripples on hover / tap */}
              <LogoMotion variant="dark" play={revealed} delay={0.9} ripple
                className={`w-auto transition-[height] duration-500 ${solid ? 'h-8 sm:h-9' : 'h-10 sm:h-12'}`} />
            </a>

            <ul className={`hidden items-center gap-0.5 xl:flex ${tone}`}>
              {links.map((n) => {
                const isActive = n.page ? pathname === n.path : home && active === n.section
                return (
                  <li key={n.id}>
                    <NavLink item={n} onAnchor={onAnchor} aria-current={isActive ? 'location' : undefined}
                      className={`group relative block px-2.5 py-2 text-[13.5px] font-semibold transition-opacity ${isActive ? 'opacity-100' : 'opacity-75 hover:opacity-100'}`}>
                      {n.label}
                      <span className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100 bg-ivory/50`} />
                      {isActive && <motion.span layoutId="nav-active" className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full ${solid ? 'bg-[#F2B27E]' : 'bg-white'}`} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    </NavLink>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-2">
              <NavLink item={cta} onAnchor={onAnchor}
                aria-current={pathname === cta.path ? 'page' : undefined}
                className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-ivory px-3.5 py-2 text-[13px] max-[359px]:px-3 font-semibold text-navy-deep shadow-[0_8px_24px_-12px_rgba(0,0,0,.5)] transition-colors duration-300 hover:bg-[#F2B27E] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[13.5px]">
                {cta.label}
                <ArrowUpRight size={15} className="max-[359px]:hidden transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </NavLink>
              <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}
                className={`relative z-[60] grid h-12 w-12 place-items-center rounded-full transition-colors xl:hidden ${open ? 'bg-ivory text-navy' : 'bg-ivory/15 text-ivory backdrop-blur'}`}>
                <span className="relative block h-3 w-5">
                  <span className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                  <span className={`absolute left-0 h-[1.5px] bg-current transition-all duration-300 ${open ? 'top-1.5 w-5 -rotate-45' : 'top-3 w-3.5'}`} />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        isActive={(n) => (n.page ? pathname === n.path : home && active === n.section)}
        renderLink={(n, { children, ...props }) => <NavLink item={n} onAnchor={onAnchor} after={() => setOpen(false)} {...props}>{children}</NavLink>}
      />
    </>
  )
}
