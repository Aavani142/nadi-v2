import { createContext, useContext, useEffect, useState } from 'react'

/** true once the intro has handed over to the page (or immediately when it is skipped). */
export const IntroContext = createContext(true)
export const useRevealed = () => useContext(IntroContext)

const KEY = 'nadi:intro-seen'
export function introSeen() {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}
export function markIntroSeen() {
  try { sessionStorage.setItem(KEY, '1') } catch { /* storage unavailable — intro may replay */ }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useMedia(query, initial = false) {
  const [m, setM] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches))
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setM(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return m
}

/** The site uses one fixed brand theme; device dark mode is intentionally ignored. */
export const useDarkMode = () => false
