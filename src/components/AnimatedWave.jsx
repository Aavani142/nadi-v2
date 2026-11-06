import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { sinePath } from './ui.jsx'

const W = 2880
export const CREST = 120

/**
 * A full-screen body of water. Its crest sits at `level` (MotionValue 0 → hidden below the screen,
 * 1 → crest at the very top). The crest itself drifts horizontally forever, seamlessly.
 */
export default function AnimatedWave({ color, level, amp = 18, cycles = 4, phase = 0, dur = 14, dir = 1, still = false, line = 'rgba(246,240,227,.28)', children, className = '' }) {
  const d = useRef((() => {
    const l = sinePath(W, CREST, cycles, amp, phase)
    return { line: l, fill: `${l} L${W} ${CREST} L0 ${CREST} Z` }
  })()).current
  // level 0 also hides the crest; level 1 puts the crest flush with the top edge
  const y = useTransform(level, (v) => `calc(${(1 - v) * 100}% + ${(1 - v) * CREST}px)`)
  return (
    <motion.div aria-hidden={children ? undefined : 'true'} className={`absolute inset-0 will-change-transform ${className}`} style={{ y }}>
      {/* body runs well below the screen so a raised layer never exposes the bottom edge */}
      <div className="absolute inset-x-0 top-0 -bottom-[60%]" style={{ background: color }} />
      <div className="absolute inset-x-0 overflow-hidden" style={{ bottom: 'calc(100% - 1px)', height: CREST }}>
        <motion.div className="h-full w-[200%]"
          animate={still ? undefined : { x: dir > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
          transition={{ duration: dur, ease: 'linear', repeat: Infinity }}>
          <svg viewBox={`0 0 ${W} ${CREST}`} preserveAspectRatio="none" className="block h-full w-full">
            <path d={d.fill} fill={color} />
            {line && <path d={d.line} fill="none" stroke={line} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />}
          </svg>
        </motion.div>
      </div>
      {children && <div className="absolute inset-x-0 top-0">{children}</div>}
    </motion.div>
  )
}
