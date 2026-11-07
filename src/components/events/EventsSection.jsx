import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { getEvents, EVENTS_PAGE } from '../../data/events.js'
import { Lines } from '../ui.jsx'
import { gsap, useGsap } from '../../lib/gsap.js'
import FeaturedEvent from './FeaturedEvent.jsx'
import EventCard from './EventCard.jsx'
import EventDetails from './EventDetails.jsx'
import { Doodled } from '../Doodle.jsx'

/** Loads events through the data layer. Replace `getEvents` with a Supabase query later — same shape. */
function useEvents() {
  const [data, setData] = useState({ upcoming: [], recent: [], loading: true })
  useEffect(() => {
    let alive = true
    getEvents().then((d) => alive && setData({ ...d, loading: false }))
    return () => { alive = false }
  }, [])
  return data
}

function ViewAll({ className = '' }) {
  const cls = `group inline-flex min-h-[44px] items-center gap-2 text-[14px] font-semibold text-accent ${className}`
  const inner = <>View all events <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>
  return EVENTS_PAGE.ready
    ? <Link to={EVENTS_PAGE.path} className={cls}>{inner}</Link>
    : <a href={EVENTS_PAGE.fallback} target="_blank" rel="noopener noreferrer" className={cls} title="Opens NADI's Instagram while the events page is being prepared">{inner}</a>
}

/**
 * "More from NADI" — a slow, continuous marquee of uniform cards. Hovering or focusing a card pauses it;
 * the list is rendered twice so the loop is seamless (the copy is hidden from screen readers).
 * Reduced motion: no movement, the row simply scrolls sideways.
 */
function Rail({ events, onOpen }) {
  // ~7s per card keeps it slow enough to read, whatever the number of events
  const duration = `${Math.max(events.length, 4) * 7}s`
  return (
    <div className="mt-20 lg:mt-24">
      <div className="flex items-end justify-between gap-4">
        <p className="display text-[clamp(1.6rem,2.6vw,2.2rem)] text-heading">More from NADI</p>
        <p className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-fg/50 sm:block">Hover to pause · tap a card for details</p>
      </div>
      <div className="ev-marquee no-scrollbar relative -mx-5 mt-8 overflow-hidden sm:-mx-8 lg:-mx-12"
        style={{ maskImage: 'linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)' }}>
        <ul className="ev-track drift flex w-max items-stretch gap-6 py-4 pl-6" style={{ animationDuration: duration }}>
          {events.map((e) => <EventCard key={e.id} event={e} onOpen={onOpen} />)}
          {events.map((e) => <EventCard key={`dup-${e.id}`} event={e} onOpen={onOpen} hidden />)}
        </ul>
      </div>
    </div>
  )
}

export default function EventsSection() {
  const { upcoming, recent, loading } = useEvents()
  const [tab, setTab] = useState(null)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const ref = useRef(null)
  // the featured date drops in and the rail cards rise once events have loaded
  useGsap(ref, () => {
    if (loading) return
    gsap.from('.ev-date', { y: -40, rotate: -12, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.ev-date', start: 'top 90%', once: true } })
  }, [loading, tab])

  // Default to Upcoming only when there is something upcoming; otherwise lead with recent activity.
  const active = tab ?? (upcoming.length ? 'upcoming' : 'recent')
  const list = active === 'upcoming' ? upcoming : recent
  const [featured, ...rest] = list

  const tabs = [
    { id: 'upcoming', label: 'Upcoming events', count: upcoming.length },
    { id: 'recent', label: 'Recent activities', count: recent.length },
  ]

  return (
    <section id="events" ref={ref} aria-label="What's happening at NADI" className="g-ivory relative overflow-hidden pb-24 pt-24 sm:pt-32 lg:pb-36 lg:pt-40">
      <div className="frame relative">
        <div className="grid gap-8 border-b border-fg/10 pb-10 lg:grid-cols-12 lg:items-end">
          <div className="relative lg:col-span-8">
            <p className="eyebrow flex items-center gap-3 text-accent"><span aria-hidden="true" className="h-px w-8 bg-current" />Events, ideas &amp; impact</p>
            <Lines className="display mt-5 text-[clamp(2.8rem,6.2vw,6rem)] leading-[0.92] text-heading"
              lines={["What's happening", <span key="a" className="accent text-accent">at <Doodled kind="circle" delay={0.9}>NADI.</Doodled></span>]} />
          </div>
          <div className="lg:col-span-4">
            <p className="text-[16px] leading-relaxed text-fg/70">
              Discover the conversations, initiatives and experiences bringing communities together.
            </p>
            <ViewAll className="mt-4" />
          </div>
        </div>

        <div role="tablist" aria-label="Event timeline" className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={active === t.id} onClick={() => setTab(t.id)}
              className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors ${active === t.id ? 'text-white' : 'text-fg/70 hover:text-heading'}`}>
              {active === t.id && <motion.span layoutId="events-tab" className="absolute inset-0 rounded-full bg-navy" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="relative">{t.label}</span>
              <span className={`relative rounded-full px-2 py-0.5 text-[11px] tabular-nums ${active === t.id ? 'bg-white/15' : 'bg-surface'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 min-h-[24rem]">
          {loading ? null : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                {list.length === 0 ? (
                  <div className="border border-dashed border-fg/20 px-6 py-14 text-center">
                    <p className="display text-[1.8rem] text-heading">No upcoming events announced yet.</p>
                    <p className="mx-auto mt-3 max-w-md text-[15px] text-fg/65">New events are announced on NADI's Instagram first. Meanwhile, see what we've been doing recently.</p>
                    <button type="button" onClick={() => setTab('recent')} className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-blue px-6 text-[14px] font-semibold text-white hover:bg-blue-deep">See recent activities</button>
                  </div>
                ) : (
                  <>
                    <FeaturedEvent event={featured} onOpen={setOpen} />
                    {rest.length > 0 && <Rail events={rest} onOpen={setOpen} />}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-[13px] text-fg/55">
          <p>Sourced from NADI's public Instagram posts and the Annual Report 2025–2026. Registration links appear only when NADI publishes one.</p>
          <ViewAll />
        </div>
      </div>

      <AnimatePresence>{open && <EventDetails event={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}
