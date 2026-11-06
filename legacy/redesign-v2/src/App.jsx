import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Donate from './pages/Donate.jsx'
import { useSmoothScroll, resetScroll } from './lib/scroll.js'
import { ScrollTrigger } from './lib/motion.js'

const CURTAIN = [0.76, 0, 0.24, 1]

/**
 * Route transition: an ink curtain rises over the outgoing page, the scroll resets,
 * then the curtain lifts off the new page.
 */
function Page({ children }) {
  return (
    <>
      <motion.main
        id="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.01, delay: 0 } }}
        exit={{ opacity: 1, transition: { duration: 0.75 } }}
      >
        {children}
      </motion.main>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100] bg-ink"
        initial={{ clipPath: 'inset(0% 0 0% 0)' }}
        animate={{ clipPath: 'inset(0% 0 100% 0)', transition: { duration: 0.9, ease: CURTAIN, delay: 0.1 } }}
        exit={{ clipPath: ['inset(100% 0 0% 0)', 'inset(0% 0 0% 0)'], transition: { duration: 0.75, ease: CURTAIN } }}
      />
    </>
  )
}

export default function App() {
  const location = useLocation()
  useSmoothScroll()

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <Navbar />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          resetScroll()
          requestAnimationFrame(() => ScrollTrigger.refresh())
        }}
      >
        <Page key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Page>
      </AnimatePresence>
      <Footer />
    </>
  )
}
