import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import IntroLoader from './components/IntroLoader.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import SDGs from './pages/SDGs.jsx'
import About from './pages/About.jsx'
import Donate from './pages/Donate.jsx'
import { ScrollTrigger } from './lib/gsap.js'
import SmoothScroll from './lib/SmoothScroll.jsx'
import { IntroContext, introSeen, markIntroSeen } from './lib/intro.js'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  // new page = new layout: re-measure every scroll animation once it has rendered
  useEffect(() => { const id = requestAnimationFrame(() => ScrollTrigger.refresh()); return () => cancelAnimationFrame(id) }, [pathname])
  return null
}

// Internal pages are not built in this phase. When one is ready, add its <Route> below and set
// `page: true` on its entry in data/nadi.js → nav; navigation then links to it automatically.

export default function App() {
  const { pathname } = useLocation()
  // The intro plays once per browser session, and only when the visit starts on the homepage.
  const [intro, setIntro] = useState(() => pathname === '/' && !introSeen())
  const [revealed, setRevealed] = useState(() => !intro)

  const reveal = useCallback(() => { setRevealed(true); markIntroSeen() }, [])
  const done = useCallback(() => setIntro(false), [])

  useEffect(() => {
    document.documentElement.style.overflow = intro && !revealed ? 'hidden' : ''
    if (intro && !revealed) window.scrollTo(0, 0)
  }, [intro, revealed])

  return (
    <IntroContext.Provider value={revealed}>
      <SmoothScroll paused={intro && !revealed} />
      {intro && <IntroLoader onReveal={reveal} onDone={done} />}
      <ScrollToTop />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ivory">Skip to content</a>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/sdgs" element={<SDGs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </IntroContext.Provider>
  )
}
