import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { contact, donateLink, logos, nav } from '../data/nadi.js'
import { useActiveSection, useGoToSection } from '../lib/nav.js'
import { lockScroll } from '../lib/scroll.js'
import { EXPO } from '../lib/motion.js'
import { Button, RollText } from './ui.jsx'

const ids = nav.map((n) => n.section)

export default function Navbar() {
  const { pathname } = useLocation()
  const goTo = useGoToSection()
  const active = useActiveSection(ids, pathname === '/')
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden(y > 160 && y > prev)
  })

  useEffect(() => { lockScroll(open) }, [open])
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const click = (id) => (e) => { e.preventDefault(); setOpen(false); goTo(id) }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.7, ease: EXPO }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
          solid && !open ? 'border-b border-ink/10 bg-paper/90 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav aria-label="Main" className="frame flex h-[68px] items-center justify-between gap-6 sm:h-20">
          <Link to="/" onClick={(e) => { if (pathname === '/') click('top')(e) }} className="relative z-[60] shrink-0" aria-label="NADI Foundation — home">
            <img src={open ? logos.onDark : logos.full} alt="" width="723" height="227" className="h-9 w-auto sm:h-10" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.section}`}
                  onClick={click(item.section)}
                  aria-current={active === item.section ? 'true' : undefined}
                  className="group relative flex items-center px-3.5 py-2 text-[15px] font-medium"
                >
                  <RollText>{item.label}</RollText>
                  <motion.span
                    className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-river"
                    initial={false}
                    animate={{ scale: active === item.section ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EXPO }}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button to={donateLink.path} variant="ember">{donateLink.label}</Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`relative z-[60] grid h-12 w-12 place-items-center rounded-full transition-colors lg:hidden ${open ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}
            >
              <span className="relative block h-3 w-5">
                <motion.span className="absolute left-0 top-0 h-[2px] w-5 rounded bg-current" animate={open ? { top: 5, rotate: 45 } : { top: 0, rotate: 0 }} transition={{ duration: 0.4, ease: EXPO }} />
                <motion.span className="absolute bottom-0 left-0 h-[2px] w-5 rounded bg-current" animate={open ? { bottom: 5, rotate: -45 } : { bottom: 0, rotate: 0 }} transition={{ duration: 0.4, ease: EXPO }} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[45] flex flex-col bg-ink text-paper lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="frame mt-28 flex flex-col">
              {nav.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-paper/10">
                  <motion.a
                    href={`/#${item.section}`}
                    onClick={click(item.section)}
                    className="display flex items-baseline justify-between py-3 text-[13vw] uppercase sm:text-7xl"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.8, ease: EXPO, delay: 0.25 + i * 0.05 }}
                  >
                    {item.label}
                    <span className="kicker text-paper/40">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="frame mt-auto flex flex-col gap-6 pb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <Button to={donateLink.path} variant="ember" size="lg" magnetic={false} className="self-start">Donate to NADI</Button>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-paper/60">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <a href={`tel:+91${contact.phone}`}>{contact.phoneDisplay}</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
