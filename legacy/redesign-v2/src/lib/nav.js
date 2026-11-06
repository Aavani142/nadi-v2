import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToSection } from './scroll.js'

/** Go to a homepage section from anywhere: scroll if we're home, otherwise route home first. */
export function useGoToSection() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (id) => {
    if (pathname === '/' && scrollToSection(id)) return
    navigate('/', { state: { section: id } })
  }
}

/** Id of the section currently in the middle of the viewport. */
export function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    if (!enabled) { setActive(null); return }
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids, enabled])
  return active
}
