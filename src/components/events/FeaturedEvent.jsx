import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, MapPin, CalendarDays } from 'lucide-react'
import { ImageReveal } from '../../lib/Motion.jsx'
import { Img, EASE } from '../ui.jsx'
import { CategoryTag, StatusBadge, dateParts } from './eventUtils.jsx'

/** Date "sticker" — the bold festival date label, or the source's own wording when no exact date exists. */
export function DateSticker({ event, size = 'lg', className = '' }) {
  const p = dateParts(event.date)
  const dims = size === 'lg' ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-20 w-20'
  return (
    <div className={`ev-date grid place-items-center rounded-full bg-navy-deep text-center text-ivory shadow-[0_18px_40px_-16px_rgba(6,29,53,.6)] ${dims} ${className}`}>
      {p ? (
        <div className="leading-none">
          <span className={`display block tabular-nums ${size === 'lg' ? 'text-[2.9rem]' : 'text-[1.9rem]'}`}>{p.day}</span>
          <span className="mt-1 block font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]">{p.month} {p.year}</span>
        </div>
      ) : (
        <span className="px-3 font-mono text-[10px] font-medium uppercase leading-tight tracking-[0.1em]">{event.dateLabel}</span>
      )}
    </div>
  )
}

export default function FeaturedEvent({ event, onOpen }) {
  const p = dateParts(event.date)
  const meta = [
    { icon: CalendarDays, v: p ? `${p.weekday}, ${p.full}` : event.dateLabel },
    { icon: Clock, v: event.time },
    { icon: MapPin, v: event.location },
  ].filter((m) => m.v)

  return (
    <article className="group relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
      {/* photograph with a quiet offset plate behind it */}
      <div className="relative lg:col-span-6">
        <motion.div aria-hidden="true" className="absolute -left-3 -top-3 h-full w-full rounded-[6px] bg-tint sm:-left-5 sm:-top-5"
          initial={{ opacity: 0, x: 18, y: 18 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }} />
        <button type="button" onClick={() => onOpen(event)} aria-label={`View details: ${event.title}`} className="relative block w-full overflow-hidden rounded-[6px]">
          <ImageReveal className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/4]">
            <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
              <Img photo={event.image} sizes="(min-width:1024px) 46vw, 100vw" />
            </div>
          </ImageReveal>
        </button>
        <DateSticker event={event} className="absolute -bottom-8 right-4 sm:-right-6" />
      </div>

      <div className="lg:col-span-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">Featured</span>
          <CategoryTag category={event.category} />
          <StatusBadge status={event.status} />
        </div>
        <motion.h3 className="display mt-6 text-[clamp(2.2rem,4vw,3.8rem)] leading-[0.95] text-heading"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}>
          {event.title}
        </motion.h3>
        <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-fg/75">{event.description}</p>
        <dl className="mt-7 grid gap-3 border-t border-fg/10 pt-6">
          {meta.map(({ icon: Icon, v }) => (
            <div key={v} className="flex items-start gap-2.5 text-[14.5px] text-fg/80">
              <Icon size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {event.registration && (
            <a href={event.registration} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-navy-deep px-6 text-[14px] font-semibold text-ivory hover:bg-blue">
              Register now <ArrowUpRight size={16} />
            </a>
          )}
          <button type="button" onClick={() => onOpen(event)}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-blue px-6 text-[14px] font-semibold text-white transition-colors hover:bg-blue-deep">
            View event details
          </button>
          {event.instagram && (
            <a href={event.instagram} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-fg/25 px-6 text-[14px] font-semibold text-heading transition-colors hover:border-accent hover:text-accent">
              View on Instagram <ArrowUpRight size={16} />
            </a>
          )}
        </div>
        <p className="mt-4 text-[12.5px] text-fg/50">{event.registration ? 'Registration open via the official link.' : 'No registration link has been published for this event.'}</p>
      </div>
    </article>
  )
}
