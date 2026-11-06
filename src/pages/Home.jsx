import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import VideoHero from '../components/VideoHero.jsx'
import VisionMissionScroll from '../components/VisionMissionScroll.jsx'
import FocusSection from '../components/FocusSection.jsx'
import InitiativesSection, { scrollToInitiative } from '../components/InitiativesSection.jsx'
import DirectorSection from '../components/DirectorSection.jsx'
import SDGExperience from '../components/sdg/SDGExperience.jsx'
import EventsSection from '../components/events/EventsSection.jsx'
import ImpactSection from '../components/ImpactSection.jsx'
import NetworkSection from '../components/NetworkSection.jsx'
import ResearchSection from '../components/ResearchSection.jsx'
import StoriesSection from '../components/StoriesSection.jsx'
import GallerySection from '../components/GallerySection.jsx'
import TeamSection from '../components/TeamSection.jsx'
import SupportSection from '../components/PartnershipSection.jsx'
import { useRevealed } from '../lib/intro.js'
import { scrollToHash } from '../lib/SmoothScroll.jsx'
import { ScrollTrigger } from '../lib/gsap.js'

/**
 * Homepage: who NADI is (hero, three core areas), what it does (five initiatives), who leads it
 * (Director's message), why it matters (SDGs, events, impact), who it works with (network, research),
 * what it looks like (stories, gallery), the people (team), and how to support it (Donate).
 */
export default function Home() {
  const { hash } = useLocation()
  const revealed = useRevealed()

  useEffect(() => { document.title = 'NADI Foundation — Equity, Equality & Innovation' }, [])
  useEffect(() => {
    if (!revealed) return
    ScrollTrigger.refresh()
    if (!hash) return
    // Content above the target keeps settling after mount (pin spacers, events loading in), so re-aim a few
    // times — but stop the moment the visitor scrolls themselves, so we never fight them.
    let userMoved = false
    const stop = () => { userMoved = true }
    const opts = { passive: true }
    window.addEventListener('wheel', stop, opts)
    window.addEventListener('touchstart', stop, opts)
    window.addEventListener('keydown', stop)
    const jump = () => {
      if (userMoved) return
      ScrollTrigger.refresh()
      // initiative panels are sticky on desktop, so their anchors need the stack-aware scroll
      if (hash.startsWith('#work-')) scrollToInitiative(hash.slice(6))
      else scrollToHash(hash, { immediate: true })
    }
    const timers = [120, 600, 1400].map((ms) => setTimeout(jump, ms))
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('wheel', stop, opts)
      window.removeEventListener('touchstart', stop, opts)
      window.removeEventListener('keydown', stop)
    }
  }, [revealed, hash])

  return (
    <main id="main">
      <VideoHero />
      <VisionMissionScroll id="vision" />
      <FocusSection />
      <InitiativesSection />
      <DirectorSection />
      <SDGExperience />
      <EventsSection />
      <ImpactSection />
      <NetworkSection />
      <ResearchSection />
      <StoriesSection />
      <GallerySection />
      <TeamSection />
      <SupportSection />
    </main>
  )
}
