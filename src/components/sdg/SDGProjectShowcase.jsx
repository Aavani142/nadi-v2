import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { initiatives, photos } from '../../data/nadi.js'
import { SDGS, SDG_CONTRIBUTION } from '../../data/sdg.js'
import { scrollToInitiative } from '../InitiativesSection.jsx'
import { Img } from '../ui.jsx'

export const INITIATIVE_META = {
  kappiness: { id: 'kappiness', photo: photos.kappinessGarden, tint: '#B9783F' },
  prabodhini: { id: 'prabodhini', photo: photos.learningPlay, tint: '#2F5D46' },
  yfa: { id: 'youth-for-action', photo: photos.campus, tint: '#3B4FD1' },
  ekatva: { id: 'ekatva', photo: photos.ekatvaConvocation, tint: '#8C1D40' },
  navajeevana: { id: 'navajeevana', photo: photos.navTaskForce, tint: '#43B05C' },
}

/** NADI initiatives that are documented as contributing to the active goal. */
export default function SDGProjectShowcase({ goal, onPick }) {
  const list = goal.initiatives
  const linked = SDGS.map((g, i) => ({ ...g, i })).filter((g) => g.initiatives.length)
  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={goal.n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {list.length ? (
            <>
              <p className="eyebrow text-mustard">NADI initiatives contributing to this goal</p>
              <ul className="mt-4 grid gap-3">
                {list.map((key, k) => {
                  const p = initiatives[key], m = INITIATIVE_META[key]
                  return (
                    <motion.li key={key} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: k * 0.07, ease: [0.22, 1, 0.36, 1] }}>
                      <a href={`#work-${m.id}`} onClick={(e) => { e.preventDefault(); scrollToInitiative(m.id) }}
                        className="group grid grid-cols-[4.5rem_1fr] items-center gap-4 border-t border-white/10 pt-3 sm:grid-cols-[7rem_1fr_auto]">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          <Img photo={m.photo} sizes="112px" className="transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-8 items-center rounded-md bg-white px-2"><img src={p.logo} alt="" className="h-6 w-auto max-w-[5rem] object-contain" loading="lazy" /></span>
                            <p className="display text-[1.35rem] leading-none text-ivory">{p.name}</p>
                          </div>
                          <p className="mt-2 text-[13.5px] leading-snug text-ivory/70">{SDG_CONTRIBUTION[key]?.[goal.n] ?? p.lede}</p>
                        </div>
                        <span className="col-span-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-mustard transition-transform group-hover:translate-x-1 sm:col-span-1">
                          Explore {p.name} <ArrowDownRight size={15} />
                        </span>
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
            </>
          ) : (
            <div className="border-t border-white/10 pt-4">
              <p className="text-[15px] leading-relaxed text-ivory/70">
                NADI's reports do not currently document an initiative working towards this goal, so none is shown here.
              </p>
              <p className="eyebrow mt-6 text-mustard">Goals NADI's initiatives work towards</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {linked.map((g) => (
                  <button key={g.n} type="button" onClick={() => onPick(g.i)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 py-1 pl-1 pr-3 text-[12px] font-semibold text-ivory/85 transition-colors hover:bg-white hover:text-navy">
                    <span className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: g.color }}>{g.n}</span>
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
