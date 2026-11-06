import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { CATEGORIES, EVENTS_PAGE, STATUS_LABEL, getEvents } from '../data/events.js'
import { EXPO, gsap, useGsap, ScrollTrigger } from '../lib/motion.js'
import { Img, Kicker, SplitWords, TextLink } from '../components/ui.jsx'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function DateBlock({ e }) {
  const iso = e.date || e.postedOn
  if (e.date) {
    const [y, m, d] = e.date.split('-')
    return (
      <time dateTime={e.date} className="block leading-none">
        <span className="display block text-4xl tabular sm:text-5xl">{d}</span>
        <span className="kicker mt-1.5 block text-ink/50">{MONTHS[+m - 1]} {y}</span>
      </time>
    )
  }
  return <span className="kicker block max-w-[13ch] leading-snug text-ink/50">{e.dateLabel || iso}</span>
}

function Status({ status }) {
  const live = status === 'ongoing' || status === 'upcoming'
  return (
    <span className={`kicker inline-flex items-center gap-2 rounded-full px-2.5 py-1 ${live ? 'bg-river text-paper' : 'bg-ink/[0.06] text-ink/60'}`}>
      {live && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper opacity-75 motion-reduce:animate-none" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-paper" /></span>}
      {STATUS_LABEL[status]}
    </span>
  )
}

export default function News() {
  const root = useRef(null)
  const [events, setEvents] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let alive = true
    getEvents().then(({ upcoming, recent }) => {
      if (!alive) return
      setEvents([...upcoming, ...recent].slice(0, 6))
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    return () => { alive = false }
  }, [])

  useGsap(root, () => {
    gsap.from('.news-title .w-in', {
      yPercent: 115, stagger: 0.06, duration: 1.4,
      scrollTrigger: { trigger: '.news-title', start: 'top 85%' },
    })
  })
  useGsap(root, () => {
    if (!events.length) return
    gsap.from('.news-row', {
      y: 30, opacity: 0, stagger: 0.07, duration: 1.1,
      scrollTrigger: { trigger: '.news-list', start: 'top 85%' },
    })
  }, [events.length])

  const current = events[active]
  const allHref = EVENTS_PAGE.ready ? EVENTS_PAGE.path : EVENTS_PAGE.fallback

  return (
    <section id="news" ref={root} aria-labelledby="news-title" className="py-28 sm:py-40">
      <div className="frame">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Kicker n="05" className="text-ink/60">News</Kicker>
            <h2 id="news-title" className="news-title display mt-8 text-[14vw] uppercase sm:text-[9vw] lg:text-[7.6vw] min-[1520px]:text-[116px]">
              <SplitWords text="What's" className="block" />
              <span className="line-mask block"><span className="w-in italic-serif inline-block normal-case text-river">happening.</span></span>
            </h2>
          </div>
          <TextLink href={allHref}>See everything on Instagram</TextLink>
        </div>

        <div className="mt-16 grid gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Sticky preview of the row under the pointer (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-paper-dim">
                <AnimatePresence initial={false}>
                  {current?.image && (
                    <motion.div
                      key={current.id}
                      className="absolute inset-0"
                      initial={{ clipPath: 'inset(0 0 100% 0)' }}
                      animate={{ clipPath: 'inset(0 0 0% 0)' }}
                      exit={{ opacity: 1 }}
                      transition={{ duration: 0.9, ease: EXPO }}
                    >
                      <motion.div className="h-full w-full" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EXPO }}>
                        <Img photo={current.image} sizes="40vw" className="h-full w-full object-cover" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </figure>
              {current && (
                <p className="mt-4 flex items-center gap-2 text-sm text-ink/60">
                  <span className="h-2 w-2 rounded-full bg-river" />
                  {CATEGORIES[current.category]?.label}
                </p>
              )}
            </div>
          </div>

          <ol className="news-list lg:col-span-7">
            {events.map((e, i) => {
              const Tag = e.instagram ? 'a' : 'div'
              const linkProps = e.instagram ? { href: e.instagram, target: '_blank', rel: 'noreferrer', 'aria-label': `${e.title} — view the post on Instagram` } : {}
              return (
                <li key={e.id} className="news-row border-t border-ink/15 last:border-b" onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                  <Tag {...linkProps} className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-4 py-7 sm:grid-cols-[7.5rem_1fr_auto] sm:gap-x-8 sm:py-9">
                    <div className="flex items-start gap-4">
                      {e.image && <Img photo={e.image} sizes="80px" className="h-20 w-20 shrink-0 rounded-[4px] object-cover sm:hidden" alt="" />}
                      <div className="hidden sm:block"><DateBlock e={e} /></div>
                    </div>
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <Status status={e.status} />
                        <span className="sm:hidden"><DateBlock e={e} /></span>
                      </div>
                      <h3 className={`text-xl font-semibold leading-tight tracking-[-0.02em] transition-colors duration-300 sm:text-[28px] ${active === i ? 'lg:text-river' : ''} group-hover:text-river`}>
                        {e.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 max-w-[60ch] text-[15px] leading-relaxed text-ink/60">{e.description}</p>
                      {e.location && (
                        <p className="mt-3 flex items-start gap-1.5 text-sm text-ink/50"><MapPin aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />{e.location}</p>
                      )}
                    </div>
                    {e.instagram && (
                      <span aria-hidden className="hidden h-11 w-11 place-items-center self-start rounded-full border border-ink/15 transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper sm:col-start-3 sm:grid">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    )}
                  </Tag>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
