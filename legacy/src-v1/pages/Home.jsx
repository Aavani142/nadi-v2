import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import VideoHero from '../components/VideoHero.jsx'
import FocusSection from '../components/FocusSection.jsx'
import EventsSection from '../components/events/EventsSection.jsx'
import AboutSection from '../components/AboutSection.jsx'
import VisionMission from '../components/VisionMission.jsx'
import InitiativesSection from '../components/InitiativesSection.jsx'
import SDGExperience from '../components/sdg/SDGExperience.jsx'
import ImpactSection from '../components/ImpactSection.jsx'
import NetworkSection from '../components/NetworkSection.jsx'
import ResearchSection from '../components/ResearchSection.jsx'
import StoriesSection from '../components/StoriesSection.jsx'
import GallerySection from '../components/GallerySection.jsx'
import TeamSection from '../components/LeadershipSection.jsx'
import GetInvolvedSection from '../components/PartnershipSection.jsx'
import { useRevealed } from '../lib/intro.js'
import { scrollToHash } from '../lib/SmoothScroll.jsx'

/** Homepage — Events sit right after the hero so activity is visible immediately; the rest follows the navigation order. */
export default function Home() {
  const { hash } = useLocation()
  const revealed = useRevealed()
  useEffect(() => {
    if (!revealed || !hash) return
    const t = setTimeout(() => scrollToHash(hash, { immediate: true }), 60)
    return () => clearTimeout(t)
  }, [revealed, hash])

  return (
    <main>
      <VideoHero />
      <FocusSection />
      <EventsSection />
      <AboutSection />
      <VisionMission />
      <InitiativesSection />
      <SDGExperience />
      <ImpactSection />
      <NetworkSection />
      <ResearchSection />
      <StoriesSection />
      <GallerySection />
      <TeamSection />
      <GetInvolvedSection />
    </main>
  )
}
