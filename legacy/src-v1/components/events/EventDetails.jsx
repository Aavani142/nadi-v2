import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, Clock, MapPin, X } from 'lucide-react'
import { lockScroll } from '../../lib/SmoothScroll.jsx'
import { initiatives } from '../../data/nadi.js'
import { Img } from '../ui.jsx'
import { StatusBadge, categoryLabel, dateParts } from './eventUtils.jsx'

/** Side panel with the complete event record. */
export default function EventDetails({ event, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    lockScroll(true); closeRef.current?.focus()
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); lockScroll(false) }
  }, [onClose])

  const p = dateParts(event.date)
  const rows = [
    { icon: CalendarDays, k: 'Date', v: p ? `${p.weekday}, ${p.full}` : event.dateLabel },
    { icon: Clock, k: 'Time', v: event.time },
    { icon: MapPin, k: 'Location', v: event.location },
  ].filter((r) => r.v)
  const initiative = event.initiative ? initiatives[event.initiative] : null

  return (
    <motion.div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="event-details-title"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close event details" onClick={onClose} className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm" />
      <motion.aside className="relative flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-paper text-fg shadow-2xl" data-lenis-prevent
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-fg/10 bg-paper/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <StatusBadge status={event.status} />
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">{categoryLabel(event.category)}</span>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-surface hover:bg-line"><X size={18} /></button>
        </div>

        {event.image && (
          <div className="bg-surface"><Img photo={event.image} sizes="560px" className="!h-auto max-h-[70vh] !object-contain" /></div>
        )}

        <div className="flex-1 px-6 py-8 sm:px-8">
          <h3 id="event-details-title" className="display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1] text-heading">{event.title}</h3>
          <dl className="mt-6 grid gap-3 border-y border-fg/10 py-5">
            {rows.map(({ icon: Icon, k, v }) => (
              <div key={k} className="grid grid-cols-[1.25rem_5.5rem_1fr] items-start gap-2 text-[14.5px]">
                <Icon size={16} className="mt-0.5 text-accent" aria-hidden="true" />
                <dt className="font-semibold text-fg/60">{k}</dt>
                <dd className="text-fg">{v}</dd>
              </div>
            ))}
            {initiative && (
              <div className="grid grid-cols-[1.25rem_5.5rem_1fr] items-start gap-2 text-[14.5px]">
                <span />
                <dt className="font-semibold text-fg/60">Initiative</dt>
                <dd>{initiative.name}</dd>
              </div>
            )}
          </dl>
          <p className="mt-6 text-[16px] leading-relaxed text-fg/80">{event.description}</p>
          <p className="mt-6 text-[12.5px] text-fg/50">Source: {event.source}</p>
        </div>

        <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-fg/10 bg-paper px-6 py-5 sm:px-8">
          {event.registration && (
            <a href={event.registration} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-blue px-6 text-[14px] font-semibold text-white hover:bg-blue-deep">
              Register now <ArrowUpRight size={16} />
            </a>
          )}
          {event.instagram && (
            <a href={event.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-navy px-6 text-[14px] font-semibold text-white hover:bg-blue">
              View original Instagram post <ArrowUpRight size={16} />
            </a>
          )}
          {event.related?.map((u, i) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-fg/20 px-5 text-[14px] font-semibold text-heading hover:border-blue hover:text-accent">
              {i === 0 ? 'Announcement post' : `Related post ${i + 1}`} <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </motion.aside>
    </motion.div>
  )
}
