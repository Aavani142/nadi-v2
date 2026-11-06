import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { sdgColors, sdgNames } from '../data/nadi.js'

const EASE = [0.22, 1, 0.36, 1]
export { EASE }

/** Image with sensible defaults: lazy below the fold, responsive srcSet when available. */
export function Img({ photo, className = '', sizes = '100vw', priority = false, style, ...rest }) {
  if (!photo?.src) {
    // Clearly identifiable slot for a photograph that still needs to be supplied
    return (
      <div className={`grid place-items-center bg-line/60 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-fg/50 ${className}`} style={style}>
        Photograph to be supplied
      </div>
    )
  }
  return (
    <img
      src={photo.src} srcSet={photo.srcSet} sizes={photo.srcSet ? sizes : undefined} alt={photo.alt ?? ''}
      loading={priority ? 'eager' : 'lazy'} decoding="async" fetchpriority={priority ? 'high' : undefined}
      className={`block h-full w-full object-cover ${className}`} style={style} draggable="false" {...rest}
    />
  )
}

/** Section label: "02 — Our work" with a small sun dot. */
export function Eyebrow({ n, children, className = '', tone = 'text-accent' }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${tone} ${className}`}>
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-current" />
      {n && <span className="tabular-nums opacity-70">{n}</span>}
      {n && <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />}
      <span>{children}</span>
    </p>
  )
}

export function SdgChips({ list, className = '', light = false }) {
  return (
    <ul className={`flex flex-wrap items-center gap-1.5 ${className}`} aria-label="Sustainable Development Goals">
      {list.map((n) => (
        <li key={n} title={`SDG ${n} · ${sdgNames[n]}`}
          className={`inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-[11px] font-semibold ${light ? 'border-white/20 text-white/80' : 'border-current/15 border-black/10'}`}>
          <span className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: sdgColors[n] }}>{n}</span>
          <span className="hidden sm:inline">{sdgNames[n]}</span>
          <span className="sm:hidden">SDG {n}</span>
        </li>
      ))}
    </ul>
  )
}

/** Pill button with a rolling arrow. Renders <a>. */
export function PillLink({ href, to, children, variant = 'blue', className = '', external = false, ...rest }) {
  const v = {
    blue: 'bg-blue text-ivory hover:bg-blue-deep',
    ivory: 'bg-ivory text-blue-night hover:bg-white',
    ghost: 'border border-white/30 text-white hover:bg-white hover:text-blue-night',
    ink: 'bg-fg text-ivory hover:bg-blue-deep',
    mustard: 'bg-mustard text-navy-deep hover:bg-mustard-light',
    forest: 'bg-forest text-ivory hover:bg-forest-deep',
    'ghost-ink': 'border border-fg/25 text-fg hover:bg-fg hover:text-ivory',
  }[variant]
  const cls = `group inline-flex min-h-[48px] items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[14px] font-semibold transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97] ${v} ${className}`
  const Tag = to ? Link : 'a'
  const target = to ? { to } : { href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
  return (
    <Tag {...target} {...rest} className={cls}>
      <span>{children}</span>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full" style={{ background: 'color-mix(in srgb, currentColor 14%, transparent)' }}>
        <ArrowUpRight size={16} className="transition-transform duration-500 ease-out group-hover:-translate-y-6 group-hover:translate-x-6" />
        <ArrowUpRight size={16} className="absolute -translate-x-6 translate-y-6 transition-transform duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </Tag>
  )
}

/** Lines that slide up from a mask. Controlled by `show` (for the hero) or by viewport. */
export function Lines({ lines, className = '', lineClass = '', show, delay = 0, stagger = 0.09, as: Tag = 'h2', ...rest }) {
  const controlled = show !== undefined
  const M = motion[Tag] ?? motion.div
  // once revealed, lift the line masks so doodles drawn on a word aren't clipped
  const [done, setDone] = useState(false)
  // Trigger lives on the unclipped heading itself; masked lines follow via variants.
  return (
    <M className={className} initial="hidden" onAnimationComplete={(v) => v === 'show' && setDone(true)} {...rest}
      {...(controlled ? { animate: show ? 'show' : 'hidden' } : { whileInView: 'show', viewport: { once: true, amount: 0.3 } })}>
      {lines.map((l, i) => (
        <span key={i} className={`block pb-[0.08em] -mb-[0.08em] ${done ? 'overflow-visible' : 'overflow-hidden'}`}>
          <motion.span className={`block ${lineClass}`}
            variants={{ hidden: { y: '108%' }, show: { y: '0%', transition: { duration: 1.1, delay: delay + i * stagger, ease: EASE } } }}>
            {l}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

// ───────────── Brand graphics ─────────────

/** Seamless sine path with integer cycles across `w` so it can loop by sliding −50%. */
export function sinePath(w, h, cycles, amp, phase = 0) {
  let d = ''
  for (let x = 0; x <= w; x += 12) {
    const y = h / 2 + amp * Math.sin((x / w) * Math.PI * 2 * cycles + phase)
    d += `${x ? 'L' : 'M'}${x} ${y.toFixed(1)} `
  }
  return d
}

/** Flowing contour lines drawn from the logo's two waves, as a slowly drifting band. */
export function RiverLines({ className = '', colors = ['#2A86C6', '#76B2E0', '#DCEAF4'], width = 1.4, draw = true, show = true, delay = 0, count = 2 }) {
  const W = 2880, H = 160
  const specs = [[4, 26, 0], [4, 18, 0.9], [2, 30, 2.1], [6, 12, 3.3]].slice(0, count)
  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      <div className="drift h-full w-[200%]">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-full w-full">
          {specs.map(([c, a, ph], i) => (
            <motion.path key={i} d={sinePath(W, H, c, a, ph)} fill="none" stroke={colors[i % colors.length]} strokeWidth={width} strokeLinecap="round" vectorEffect="non-scaling-stroke"
              initial={draw ? { pathLength: 0, opacity: 0 } : false}
              animate={show ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ duration: 2.2, delay: delay + i * 0.25, ease: [0.65, 0, 0.35, 1] }}
              style={{ translateY: (i - (count - 1) / 2) * 20 }} />
          ))}
        </svg>
      </div>
    </div>
  )
}

/** NADI's wave as a section edge (fill = currentColor, so pass a text-* class for the next section's ground). */
export function WaveEdge({ className = '', flip = false }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className={`block h-[40px] w-full sm:h-[64px] ${flip ? 'rotate-180' : ''} ${className}`}>
      <path d="M0 48 C 180 10, 360 10, 540 40 S 900 78, 1080 44 S 1320 12, 1440 34 V80 H0 Z" fill="currentColor" />
    </svg>
  )
}

/** Thin five-colour festival ribbon — the website's one recurring burst of colour. */
export function FestivalRibbon({ className = '' }) {
  const c = ['bg-sky', 'bg-sun', 'bg-coral', 'bg-leaf', 'bg-berry']
  return (
    <div aria-hidden="true" className={`flex h-1.5 w-full ${className}`}>
      {c.map((x) => <span key={x} className={`flex-1 ${x}`} />)}
    </div>
  )
}
