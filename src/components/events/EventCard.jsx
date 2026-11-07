import { MapPin } from 'lucide-react'
import { Img } from '../ui.jsx'
import { CategoryTag, StatusBadge, dateParts } from './eventUtils.jsx'

/** One event in the marquee: a uniform card — poster, date, category, title, place. */
export default function EventCard({ event, onOpen, hidden = false }) {
  const p = dateParts(event.date)
  return (
    <li aria-hidden={hidden || undefined} className={`w-[78vw] max-w-[320px] shrink-0 sm:w-[320px] ${hidden ? 'ev-dup' : ''}`}>
      <button type="button" onClick={() => onOpen(event)} tabIndex={hidden ? -1 : 0} aria-label={`View details: ${event.title}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-fg/10 bg-paper text-left shadow-[0_18px_40px_-28px_rgba(9,50,90,.45)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-26px_rgba(9,50,90,.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <div className="relative aspect-square overflow-hidden bg-surface">
          <Img photo={event.image} sizes="320px" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
          <div className="absolute left-3 top-3 rounded-xl bg-paper/95 px-3 py-1.5 shadow-[0_8px_20px_-12px_rgba(0,0,0,.5)] backdrop-blur">
            {p ? (
              <p className="flex items-baseline gap-1.5 text-heading">
                <span className="display text-[1.5rem] leading-none tabular-nums">{p.day}</span>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg/70">{p.month} {p.year}</span>
              </p>
            ) : (
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-fg/75">{event.dateLabel}</p>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryTag category={event.category} />
            <StatusBadge status={event.status} />
          </div>
          <h4 className="mt-3 line-clamp-2 min-h-[2.4em] font-display text-[1.25rem] font-bold leading-[1.15] tracking-[-0.02em] text-heading transition-colors group-hover:text-accent">{event.title}</h4>
          {event.location && (
            <p className="mt-auto flex items-start gap-1.5 pt-3 text-[13px] text-fg/60"><MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" /><span className="line-clamp-1">{event.location}</span></p>
          )}
        </div>
      </button>
    </li>
  )
}
