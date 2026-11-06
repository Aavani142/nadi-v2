import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Img, EASE } from '../ui.jsx'
import { CategoryTag, StatusBadge, dateParts } from './eventUtils.jsx'

// The rail mixes proportions and tilts so neighbouring events never look identical.
const SHAPES = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/4]']

/** One event in the horizontal rail: photograph, date label, category. */
export default function EventCard({ event, index = 0, onOpen }) {
  const p = dateParts(event.date)
  return (
    <motion.li initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px 0px' }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.07, 0.35), ease: EASE }}
      className={`w-[76vw] shrink-0 snap-start sm:w-[320px] ${index % 2 ? 'sm:mt-16' : ''}`}>
      <button type="button" onClick={() => onOpen(event)} aria-label={`View details: ${event.title}`} className="group block w-full text-left">
        <div className="relative">
          <div>
            <div className={`overflow-hidden rounded-[6px] bg-surface ${SHAPES[index % 4]}`}>
              <Img photo={event.image} sizes="320px" className="transition-transform duration-700 ease-out group-hover:scale-[1.07]" />
            </div>
          </div>
          <div className="absolute -bottom-4 left-4 rounded-md bg-paper px-3 py-1.5 shadow-[0_10px_24px_-14px_rgba(0,0,0,.5)]">
            {p ? (
              <p className="flex items-baseline gap-1.5 text-heading">
                <span className="display text-[1.7rem] leading-none tabular-nums">{p.day}</span>
                <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-fg/70">{p.month} {p.year}</span>
              </p>
            ) : (
              <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-fg/75">{event.dateLabel}</p>
            )}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <CategoryTag category={event.category} />
          <StatusBadge status={event.status} />
        </div>
        <h4 className="mt-3 font-display text-[1.45rem] font-bold leading-[1.1] tracking-[-0.025em] text-heading transition-colors group-hover:text-accent">{event.title}</h4>
        {event.location && (
          <p className="mt-2 flex items-start gap-1.5 text-[13.5px] text-fg/60"><MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{event.location}</p>
        )}
      </button>
    </motion.li>
  )
}
