import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { SDGS } from '../../data/sdg.js'

const N = SDGS.length
const STEP = 360 / N
const C = 300, R_OUT = 292, R_IN = 172, GAP = 1.4
const rad = (d) => (d * Math.PI) / 180
const polar = (r, deg) => [C + r * Math.sin(rad(deg)), C - r * Math.cos(rad(deg))]

function sector(i) {
  const a0 = i * STEP - STEP / 2 + GAP / 2, a1 = i * STEP + STEP / 2 - GAP / 2
  const [x0, y0] = polar(R_OUT, a0), [x1, y1] = polar(R_OUT, a1)
  const [x2, y2] = polar(R_IN, a1), [x3, y3] = polar(R_IN, a0)
  return `M${x0} ${y0} A${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R_IN} ${R_IN} 0 0 0 ${x3} ${y3} Z`
}

/**
 * The 17-goal wheel. Purely presentational + input: `active` index, `onSelect(i)`,
 * `progress` (0–1 MotionValue of the auto-advance timer) and `onInteract(state)`.
 */
export default function SDGWheel({ active, onSelect, progress, onInteract, className = '' }) {
  const rot = useMotionValue(0)
  const upright = useTransform(rot, (r) => -r) // keeps every number readable as the wheel turns
  const acc = useRef(0)
  const [iconFailed, setIconFailed] = useState({})

  // rotate the shortest way so the active goal settles at the top
  useEffect(() => {
    const target = -active * STEP
    let delta = ((target - acc.current) % 360 + 540) % 360 - 180
    acc.current += delta
    const c = animate(rot, acc.current, { type: 'spring', stiffness: 60, damping: 18 })
    return () => c.stop()
  }, [active, rot])

  const g = SDGS[active]
  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); onSelect((active + 1) % N) }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); onSelect((active - 1 + N) % N) }
  }

  return (
    <div className={`relative aspect-square ${className}`}
      onMouseEnter={() => onInteract?.('hover')} onMouseLeave={() => onInteract?.('leave')}
      onTouchStart={() => onInteract?.('touch')} onFocus={() => onInteract?.('focus')} onBlur={() => onInteract?.('leave')}>
      <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" role="group" aria-label="Sustainable Development Goals wheel. Use arrow keys to change goal." onKeyDown={onKey}>
        {/* auto-advance timer ring */}
        <circle cx={C} cy={C} r={R_IN - 12} fill="none" stroke="rgba(9,50,90,.08)" strokeWidth="2" />
        <motion.circle cx={C} cy={C} r={R_IN - 12} fill="none" stroke="#24476B" strokeWidth="2.5" strokeLinecap="round"
          style={{ pathLength: progress, rotate: -90, transformOrigin: '300px 300px' }} />

        <motion.g style={{ rotate: rot, transformOrigin: '300px 300px' }}>
          {SDGS.map((s, i) => {
            const on = i === active
            const [lx, ly] = polar((R_IN + R_OUT) / 2, i * STEP)
            const [dx, dy] = [Math.sin(rad(i * STEP)) * 14, -Math.cos(rad(i * STEP)) * 14]
            return (
              <motion.g key={s.n} role="button" tabIndex={0} aria-label={`Goal ${s.n}: ${s.name}`} aria-pressed={on}
                className="cursor-pointer outline-none [&:focus-visible>path]:stroke-[#1C3557] [&:focus-visible>path]:[stroke-width:3]"
                onClick={() => onSelect(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(i) } }}
                animate={{ x: on ? dx : 0, y: on ? dy : 0, opacity: on ? 1 : 0.55 }}
                whileHover={{ opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
                <path d={sector(i)} fill={s.color} />
                {s.initiatives.length > 0 && (() => {
                  const [sx, sy] = polar(R_OUT - 16, i * STEP + STEP / 2 - 5)
                  return <circle cx={sx} cy={sy} r="5" fill="#FFFFFF" stroke="#1C3557" strokeOpacity=".35" className="pointer-events-none" />
                })()}
                <motion.text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
                  className="pointer-events-none select-none fill-white font-display font-extrabold"
                  style={{ fontSize: on ? 34 : 26, rotate: upright, transformOrigin: `${lx}px ${ly}px` }}>
                  {s.n}
                </motion.text>
              </motion.g>
            )
          })}
        </motion.g>

        {/* centre: the official icon of the active goal */}
        <circle cx={C} cy={C} r={R_IN - 22} fill="#F3F6FA" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.g key={g.n} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: '300px 300px' }}>
            {iconFailed[g.n] ? (
              <g>
                <rect x={C - 98} y={C - 98} width="196" height="196" rx="14" fill={g.color} />
                <text x={C - 80} y={C - 50} className="fill-white font-display font-extrabold" style={{ fontSize: 64 }}>{g.n}</text>
                <foreignObject x={C - 80} y={C} width="160" height="90">
                  <p className="text-[15px] font-extrabold uppercase leading-tight text-white">{g.name}</p>
                </foreignObject>
              </g>
            ) : (
              <>
                <clipPath id={`sdg-clip-${g.n}`}><rect x={C - 98} y={C - 98} width="196" height="196" rx="14" /></clipPath>
                <image href={g.icon} x={C - 98} y={C - 98} width="196" height="196" clipPath={`url(#sdg-clip-${g.n})`}
                  onError={() => setIconFailed((f) => ({ ...f, [g.n]: true }))} />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </div>
  )
}
