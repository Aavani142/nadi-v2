import { CATEGORIES, STATUS_LABEL } from '../../data/events.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Splits an ISO date into display parts. Returns null when the event has no exact date. */
export function dateParts(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return { day: String(d).padStart(2, '0'), month: MONTHS[m - 1], year: String(y), weekday: WEEKDAYS[dt.getDay()], full: `${d} ${MONTHS[m - 1]} ${y}` }
}

export const categoryLabel = (c) => CATEGORIES[c]?.label ?? c
export const categoryColor = (c) => CATEGORIES[c]?.color ?? '#0468B1'

/** Category label — outlined, in the section's accent colour (no per-category colours). */
export function CategoryTag({ category, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-accent/35 px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-accent ${className}`}>
      {categoryLabel(category)}
    </span>
  )
}

export function StatusBadge({ status, onDark = false, className = '' }) {
  const styles = {
    upcoming: onDark ? 'bg-white text-blue' : 'bg-blue text-white',
    ongoing: onDark ? 'border border-white/50 text-white' : 'border border-blue/40 text-accent',
    completed: onDark ? 'bg-white/10 text-white/80' : 'bg-surface text-fg/70',
    announced: onDark ? 'border border-white/30 text-white/80' : 'border border-fg/20 text-fg/70',
  }[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${styles} ${className}`}>
      {status === 'ongoing' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {STATUS_LABEL[status]}
    </span>
  )
}

/** Big date typography, or the source's own wording when no exact date exists. */
export function DateBlock({ event, size = 'md', onDark = false }) {
  const p = dateParts(event.date)
  const muted = onDark ? 'text-white/60' : 'text-fg/55'
  if (!p) {
    return <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${muted}`}>{event.dateLabel}</p>
  }
  const big = size === 'lg' ? 'text-[clamp(3.6rem,6vw,5.6rem)]' : 'text-[2.6rem]'
  return (
    <div className="flex items-end gap-3">
      <span className={`display leading-[0.8] tabular-nums ${big}`}>{p.day}</span>
      <span className={`pb-0.5 text-[12px] font-semibold uppercase leading-tight tracking-[0.14em] ${muted}`}>{p.month}<br />{p.year}</span>
    </div>
  )
}
