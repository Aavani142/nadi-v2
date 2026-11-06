import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { getEvents, EVENTS_PAGE } from '../../data/events.js'
import { Lines, FestivalRibbon } from '../ui.jsx'
import { Clay } from '../Clay.jsx'
import FeaturedEvent from './FeaturedEvent.jsx'
import EventCard from './EventCard.jsx'
import EventDetails from './EventDetails.jsx'

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
  const cls = `group inline-flex items-center gap-2 text-[14px] font-semibold text-accent ${className}`
  const inner = <>View all events <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>
  return EVENTS_PAGE.ready
    ? <Link to={EVENTS_PAGE.path} className={cls}>{inner}</Link>
    : <a href={EVENTS_PAGE.fallback} target="_blank" rel="noopener noreferrer" className={cls} title="Opens NADI's Instagram while the events page is being prepared">{inner}</a>
}

/** Horizontal festival rail — swipe on touch, arrow buttons on desktop. */
function Rail({ events, onOpen }) {
  const ref = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const update = () => { const el = ref.current; if (el) setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 }) }
  useEffect(() => { update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update) }, [])
  const go = (d) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.8), behavior: 'smooth' })
  const btn = 'grid h-12 w-12 place-items-center rounded-full border border-fg/20 text-heading transition-colors hover:border-accent hover:bg-accent hover:text-page disabled:pointer-events-none disabled:opacity-30'
  return (
    <div className="mt-24 lg:mt-28">
      <div className="flex items-end justify-between gap-4">
        <p className="display text-[clamp(1.6rem,2.6vw,2.2rem)] text-heading">More from NADI</p>
        <div className="hidden gap-2 sm:flex">
          <button type="button" className={btn} onClick={() => go(-1)} disabled={edge.start} aria-label="Previous events"><ArrowLeft size={18} /></button>
          <button type="button" className={btn} onClick={() => go(1)} disabled={edge.end} aria-label="Next events"><ArrowRight size={18} /></button>
        </div>
      </div>
      <ul ref={ref} onScroll={update} data-lenis-prevent
        className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-6 pt-4 sm:-mx-8 sm:gap-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12">
        {events.map((e, i) => <EventCard key={e.id} event={e} index={i} onOpen={onOpen} />)}
      </ul>
    </div>
  )
}

export default function EventsSection() {
  const { upcoming, recent, loading } = useEvents()
  const [tab, setTab] = useState(null)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])

  // Default to Upcoming only when there is something upcoming; otherwise lead with recent activity.
  const active = tab ?? (upcoming.length ? 'upcoming' : 'recent')
  const list = active === 'upcoming' ? upcoming : recent
  const [featured, ...rest] = list

  const tabs = [
    { id: 'upcoming', label: 'Upcoming events', count: upcoming.length },
    { id: 'recent', label: 'Recent activities', count: recent.length },
  ]

  return (
    <section id="events" aria-label="What's happening at NADI" className="g-sun relative overflow-hidden pb-24 pt-20 sm:pt-28 lg:pb-32">
      <FestivalRibbon className="absolute inset-x-0 top-0" />
      {/* festival colour fields — soft, behind the content */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-10 h-[460px] w-[460px] rounded-full bg-coral/20 blur-3xl" />
      <div className="frame relative">
        <div className="grid gap-8 border-b border-fg/10 pb-10 lg:grid-cols-12 lg:items-end">
          <div className="relative lg:col-span-8">
            <Clay kind="cloud" float className="absolute left-[min(66vw,36rem)] top-2 w-20 sm:w-28" />
            <Clay kind="cloud" float delay={1.6} className="absolute left-[min(80vw,46rem)] top-20 hidden w-16 sm:block" />
            <p className="eyebrow flex items-center gap-2 text-accent"><span className="flex gap-1" aria-hidden="true">{['bg-sky', 'bg-sun', 'bg-coral', 'bg-leaf'].map((c) => <span key={c} className={`h-2 w-2 rounded-full ${c}`} />)}</span>Events, ideas &amp; impact</p>
            <Lines className="display mt-5 text-[clamp(2.8rem,6.2vw,6rem)] leading-[0.92] text-heading"
              lines={["What's happening", <span key="a" className="accent text-accent">at NADI.</span>]} />
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
