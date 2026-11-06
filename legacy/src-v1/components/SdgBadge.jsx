import { motion } from 'framer-motion'
import * as Lucide from 'lucide-react'

// Official UN colours + names for the goals NADI reports under.
const G = {
  1: ['NO POVERTY', '#E5243B', ['Users']],
  3: ['GOOD HEALTH AND WELL-BEING', '#4C9F38', ['HeartPulse', 'Activity']],
  4: ['QUALITY EDUCATION', '#C5192D', ['BookOpen', 'Book']],
  5: ['GENDER EQUALITY', '#FF3A21', null],
  8: ['DECENT WORK AND ECONOMIC GROWTH', '#A21942', ['TrendingUp']],
  10: ['REDUCED INEQUALITIES', '#DD1367', ['Equal']],
  16: ['PEACE, JUSTICE AND STRONG INSTITUTIONS', '#00689D', ['Gavel', 'Scale']],
  17: ['PARTNERSHIPS FOR THE GOALS', '#19486A', ['Handshake', 'Link', 'Network']],
}

function GenderIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="14" r="4.2" /><path d="M10 18.2V23M7.5 20.8h5" /><path d="M13.2 10.8 20 4M15 4h5v5" /><path d="M7.6 13h4.8M7.6 15h4.8" strokeWidth="1.4" />
    </svg>
  )
}

export default function SdgBadge({ n }) {
  const g = G[n]
  if (!g) return null
  const [name, color, icons] = g
  const Icon = n === 5 ? GenderIcon : (icons || []).map((k) => Lucide[k]).find(Boolean) || Lucide.Circle
  return (
    <motion.div title={`SDG ${n}: ${name}`} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="relative flex h-[104px] w-[104px] shrink-0 xl:h-[120px] xl:w-[120px] flex-col justify-between overflow-hidden p-2.5 text-white" style={{ background: color }}>
      <div className="flex items-start gap-1.5">
        <span className="font-display text-[1.7rem] font-extrabold leading-[0.9] tracking-[-0.04em]">{n}</span>
        <span className="font-display text-[7.5px] font-bold uppercase leading-[1.15] tracking-wide">{name}</span>
      </div>
      <Icon className="mx-auto mb-0.5 h-9 w-9" strokeWidth={1.7} aria-hidden="true" />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15" />
    </motion.div>
  )
}