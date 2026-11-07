import { AnimatePresence, motion } from 'framer-motion'

/** Official information for the active goal. */
export default function SDGDetails({ goal }) {
  return (
    <div aria-live="polite" className="relative min-h-[13rem] sm:min-h-[13rem]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={goal.n} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="eyebrow flex items-center gap-3 text-[#1C2634]/60">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: goal.color }} />
            <span className="sm:hidden">UN SDG</span><span className="hidden sm:inline">Sustainable Development Goal</span>
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-start sm:gap-5">
            <span className="display text-[clamp(3.2rem,9vw,8rem)] leading-[0.8]" style={{ color: goal.color }}>{String(goal.n).padStart(2, '0')}</span>
            <h3 className="display text-[clamp(1.15rem,3.2vw,3rem)] leading-[0.98] text-[#1C3557] sm:pt-1">{goal.name}</h3>
          </div>
          <p className="accent mt-3 line-clamp-4 max-w-xl text-[clamp(0.98rem,1.7vw,1.45rem)] leading-snug text-[#1C2634]/80 sm:mt-5 sm:line-clamp-none">{goal.statement}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
