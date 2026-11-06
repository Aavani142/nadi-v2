import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToHash } from './SmoothScroll.jsx'

/** onClick handler for "#section" links: smooth-scrolls on the homepage, routes home from other pages. */
export function useAnchorClick() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return useCallback((e, hash, after) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
    e.preventDefault()
    after?.()
    if (pathname !== '/') { navigate(`/${hash === '#top' ? '' : hash}`); return }
    // wait a frame so a closing mobile menu can release the scroll lock first
    requestAnimationFrame(() => scrollToHash(hash))
  }, [pathname, navigate])
}
