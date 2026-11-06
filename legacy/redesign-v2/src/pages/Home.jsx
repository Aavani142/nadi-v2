import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../sections/Hero.jsx'
import Film from '../sections/Film.jsx'
import About from '../sections/About.jsx'
import Work from '../sections/Work.jsx'
import Impact from '../sections/Impact.jsx'
import Stories from '../sections/Stories.jsx'
import News from '../sections/News.jsx'
import Team from '../sections/Team.jsx'
import Network from '../sections/Network.jsx'
import DonateCTA from '../sections/DonateCTA.jsx'
import { scrollToSection } from '../lib/scroll.js'
import { ScrollTrigger } from '../lib/motion.js'

export default function Home() {
  const { state, hash } = useLocation()

  useEffect(() => {
    document.title = 'NADI Foundation — Youth-led change in Kerala'
    const target = state?.section || hash.replace('#', '')
    if (!target) return
    // Pinned sections add their spacing after mount, so jump once, then correct once layout settles
    const jump = () => { ScrollTrigger.refresh(); scrollToSection(target, { immediate: true }) }
    const timers = [setTimeout(jump, 120), setTimeout(jump, 700)]
    return () => timers.forEach(clearTimeout)
  }, [state, hash])

  return (
    <>
      <Hero />
      <Film />
      <About />
      <Work />
      <Impact />
      <Stories />
      <News />
      <Team />
      <Network />
      <DonateCTA />
    </>
  )
}
