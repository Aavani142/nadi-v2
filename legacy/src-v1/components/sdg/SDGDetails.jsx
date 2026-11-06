import { AnimatePresence, motion } from 'framer-motion'

/** Official information for the active goal. */
export default function SDGDetails({ goal }) {
  return (
    <div aria-live="polite" className="relative min-h-[15rem] sm:min-h-[13rem]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={goal.n} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="eyebrow flex items-center gap-3 text-ivory/60">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: goal.color }} />
            Sustainable Development Goal
          </p>
          <div className="mt-4 flex items-start gap-5">
            <span className="display text-[clamp(4.5rem,9vw,8rem)] leading-[0.8]" style={{ color: goal.color }}>{String(goal.n).padStart(2, '0')}</span>
            <h3 className="display pt-1 text-[clamp(1.7rem,3.2vw,3rem)] leading-[0.95] text-ivory">{goal.name}</h3>
          </div>
          <p className="accent mt-5 max-w-xl text-[clamp(1.15rem,1.7vw,1.45rem)] leading-snug text-ivory/85">{goal.statement}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
