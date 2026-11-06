import { motion } from 'framer-motion'

// Generative "river" contour lines — slow, quiet motion for dark backgrounds.
const N = 15
const mk = (i, ph) => {
  const y = 110 + i * 34, a = 36 + i * 3
  return `M-100 ${y} C 300 ${(y - a * (1 + Math.sin(ph + i))).toFixed(1)} 700 ${(y + a * (1 + Math.cos(ph + i * 0.7))).toFixed(1)} 1100 ${(y - a * 0.5 * Math.sin(ph)).toFixed(1)} S 1500 ${(y + a).toFixed(1)} 1700 ${y - 10}`
}
export default function FlowLines({ className = '' }) {
  return (
    <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" fill="none">
      {Array.from({ length: N }).map((_, i) => (
        <motion.path key={i} d={mk(i, 0)} stroke={i % 5 === 0 ? '#F3CE68' : '#4A9AD0'} strokeWidth="1" strokeOpacity={i % 5 === 0 ? 0.4 : 0.28}
          animate={{ d: [mk(i, 0), mk(i, 2.4), mk(i, 0)] }} transition={{ duration: 16 + (i % 5) * 3, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </svg>
  )
}
