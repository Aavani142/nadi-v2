import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NadiHero from '../components/NadiHero.jsx'
import PaperSeam, { SeamDefs } from '../components/PaperSeam.jsx'

// the grounds of the section each seam rises into (see the g-* tokens in index.css and tailwind.config.js)
const IVORY = 'rgb(246 239 228)', NAVY_DEEP = 'rgb(66 84 124)', NAVY = 'rgb(78 98 140)', BLUE = '#4A5E88', DONATE = '#4C6A96', PAPER = '#FCF8F1'
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
      {/* each section rises over the last as a cut-paper ridgeline — the landing's hills, carried down the page */}
      <SeamDefs />
      <NadiHero />
      <PaperSeam to={IVORY} seed={2} />
      <EventsSection />
      {/* no seam into Vision: its frame is pinned, and a seam would scroll across the fixed photograph */}
      <VisionMissionScroll id="vision" />
      <PaperSeam to={IVORY} seed={8} />
      <FocusSection />
      <InitiativesSection />
      <PaperSeam to={IVORY} seed={3} />
      <DirectorSection />
      <PaperSeam to={PAPER} seed={11} />
      <SDGExperience />
      <PaperSeam to={BLUE} seed={6} />
      <ImpactSection />
      <PaperSeam to={IVORY} seed={9} />
      <NetworkSection />
      <PaperSeam to={NAVY} seed={4} />
      <ResearchSection />
      <PaperSeam to={IVORY} seed={12} />
      <StoriesSection />
      <PaperSeam to={NAVY_DEEP} seed={7} />
      <GallerySection />
      <PaperSeam to={IVORY} seed={10} />
      <TeamSection />
      <PaperSeam to={DONATE} seed={13} />
      <SupportSection />
    </main>
  )
}
