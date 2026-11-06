import { motion } from 'framer-motion'

const draw = (delay = 0, duration = 1.2) => ({
  initial: { pathLength: 0 }, whileInView: { pathLength: 1 }, viewport: { once: true, margin: '-40px' },
  transition: { duration, delay, ease: [0.65, 0, 0.35, 1] },
})

/** Hand-drawn rule with a loop in the middle. Draws itself when scrolled into view. */
export function LoopDivider({ className = '', color = 'currentColor' }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round', vectorEffect: 'non-scaling-stroke' }
  return (
    <div className={`flex items-center ${className}`} aria-hidden="true">
      <svg className="h-4 flex-1" viewBox="0 0 100 10" preserveAspectRatio="none"><motion.path d="M0 5 C15 3 30 7 50 4.5 S85 6 100 5" {...p} {...draw(0.1, 1.2)} /></svg>
      <svg className="h-14 w-24 shrink-0 overflow-visible" viewBox="0 0 100 60"><motion.path d="M0 40 C18 40 30 38 40 35 C54 30 66 6 52 5 C38 4 34 36 56 41 C72 45 86 40 100 40" {...p} {...draw(0.9, 0.9)} /></svg>
      <svg className="h-4 flex-1" viewBox="0 0 100 10" preserveAspectRatio="none"><motion.path d="M0 5 C20 7 45 3 65 5.5 S90 4 100 5" {...p} {...draw(1.6, 1.2)} /></svg>
    </div>
  )
}

/** Underline scribble — plays on mount after `delay` seconds. */
export function Scribble({ className = '', color = '#FF7A3D', delay = 0 }) {
  return (
    <svg className={className} viewBox="0 0 200 16" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <motion.path d="M3 11 C40 4 78 13 118 7 S178 10 197 4" stroke={color} strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: 0.9, ease: [0.65, 0, 0.35, 1] }} />
    </svg>
  )
}

/** Slowly turning asterisk burst. */
export function Burst({ className = '', color = '#FF7A3D' }) {
  return (
    <svg className={`spin-slow ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="50" y1="22" x2="50" y2="5" stroke={color} strokeWidth="7" strokeLinecap="round" transform={`rotate(${i * 30} 50 50)`} />
      ))}
    </svg>
  )
}

/** Hand-drawn curved arrow. */
export function ArrowDoodle({ className = '', color = '#0B1B2B', delay = 0 }) {
  const p = { stroke: color, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none', initial: { pathLength: 0 }, animate: { pathLength: 1 } }
  return (
    <svg className={className} viewBox="0 0 120 70" aria-hidden="true">
      <motion.path d="M5 60 C30 8 80 4 110 40" {...p} transition={{ delay, duration: 0.9, ease: 'easeInOut' }} />
      <motion.path d="M92 38 L112 42 L106 20" {...p} transition={{ delay: delay + 0.8, duration: 0.4 }} />
    </svg>
  )
}