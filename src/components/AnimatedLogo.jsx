import { useEffect, useId, useLayoutEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { logos } from '../data/nadi.js'
import { useDarkMode } from '../lib/intro.js'

// Trimmed official logo is 723 × 225 px; the SVG uses the same coordinate space so nothing is distorted.
const LW = 723, LH = 225
const AMP = 13
function wave(fill) {
  let d = ''
  for (let x = 0; x <= LW * 2; x += 8) d += `${x ? 'L' : 'M'}${x} ${(AMP * Math.sin((x / LW) * Math.PI * 4)).toFixed(1)} `
  return fill ? `${d} L${LW * 2} 520 L0 520 Z` : d
}
const FILL = wave(true), LINE = wave(false)

/**
 * The official NADI logo, surfacing through a moving wave.
 * The logo image itself is untouched — only an SVG mask with a flowing crest sweeps upward over it.
 */
export default function AnimatedLogo({ show = true, delay = 0, duration = 1.7, reduce = false, className = '', onDone }) {
  const dark = useDarkMode()
  const id = `nadi-logo-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const y = useMotionValue(reduce ? -60 : LH + 30)
  const x = useMotionValue(0)
  const edge = useTransform(y, [LH + 30, LH * 0.6, 10, -60], [0, 1, 1, 0])
  // SVG `transform` must be a string attribute — write it straight to the DOM on every frame
  const maskRef = useRef(null), lineRef = useRef(null)
  const paint = () => {
    const t = `translate(${x.get()} ${y.get()})`
    maskRef.current?.setAttribute('transform', t)
    lineRef.current?.setAttribute('transform', t)
  }
  useMotionValueEvent(x, 'change', paint)
  useMotionValueEvent(y, 'change', paint)
  useLayoutEffect(paint)

  useEffect(() => {
    if (reduce || !show) { if (show) onDone?.(); return }
    const drift = animate(x, [0, -LW], { duration: 2.6, ease: 'linear', repeat: Infinity })
    const rise = animate(y, -60, { duration, delay, ease: [0.45, 0, 0.2, 1], onComplete: () => { drift.stop(); onDone?.() } })
    return () => { drift.stop(); rise.stop() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, reduce])

  return (
    <motion.svg viewBox={`0 0 ${LW} ${LH}`} className={`overflow-visible ${className}`} role="img" aria-label="NADI Foundation logo"
      initial={reduce ? { opacity: 0 } : false} animate={reduce && show ? { opacity: 1 } : undefined} transition={{ duration: 0.5 }}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-20" y="-80" width={LW + 40} height={LH + 160}>
          <path ref={maskRef} d={FILL} fill="#fff" />
        </mask>
        <clipPath id={`${id}-c`}><rect x="0" y="-20" width={LW} height={LH + 40} /></clipPath>
      </defs>
      <image href={dark ? logos.onDark : logos.full} width={LW} height={LH} mask={`url(#${id})`} />
      {!reduce && (
        <g clipPath={`url(#${id}-c)`}>
          <motion.path ref={lineRef} d={LINE} fill="none" stroke="#2A86C6" strokeWidth="2.2" strokeLinecap="round" style={{ opacity: edge }} />
        </g>
      )}
    </motion.svg>
  )
}
