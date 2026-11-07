import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { network } from '../data/network.js'
import { Reveal } from '../lib/Motion.jsx'
import { Eyebrow, Lines } from './ui.jsx'
import { Doodled, Doodle } from './Doodle.jsx'
import PaperBackdrop from './PaperBackdrop.jsx'

/** Our Network — the collaborators listed in the Annual Report, as a typographic wall rather than a logo grid. */
export default function NetworkSection() {
  const [tab, setTab] = useState(0)
  const group = network[tab]
  return (
    <section id="network" aria-label="Our Network" className="g-ivory relative overflow-hidden pb-24 pt-24 sm:pt-32 lg:pb-36 lg:pt-40">
      <PaperBackdrop tone="light" seed={9} />
      <div className="frame">
        <Eyebrow>Our Network</Eyebrow>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <Lines className="display text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.9] lg:col-span-7"
            lines={['Change is', <span key="a" className="accent text-accent"><Doodled kind="squiggle" delay={0.9}>never solo.</Doodled></span>]} />
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-5">
            <p className="text-[16px] leading-relaxed text-fg/75">
              NADI works alongside government bodies, universities, colleges, community organisations and the media. The names below are those listed on the collaborator pages of the Annual Report 2025–2026.
            </p>
          </div>
        </div>

        {/* featured relationships documented in the report text */}
        <Reveal className="mt-14 grid gap-2 overflow-hidden sm:grid-cols-3 [&>div]:rounded-[22px]">
          {[
            { k: 'Affiliation', v: 'Ministry of Youth Affairs and Sports', d: 'NADI Foundation is affiliated with the Ministry.', bg: 'bg-navy-deep' },
            { k: 'Collaboration', v: 'HLL Lifecare Limited', d: 'EKATVA is implemented in collaboration with HLL Lifecare Limited.', bg: 'bg-blue' },
            { k: 'Youth platforms', v: 'NYKS · MY Bharat', d: 'Youth for Action connected young people with Nehru Yuva Kendra, NYKS and MY Bharat.', bg: 'bg-[#42547C]' },
          ].map((f) => (
            <div key={f.k} className={`${f.bg} p-6 text-ivory sm:p-7`}>
              <p className="eyebrow text-mustard-light">{f.k}</p>
              <p className="mt-3 font-display text-[1.6rem] font-bold leading-tight tracking-[-0.03em]">{f.v}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ivory/80">{f.d}</p>
            </div>
          ))}
        </Reveal>

        <div role="tablist" aria-label="Collaborator groups" className="mt-16 flex flex-wrap gap-2">
          {network.map((g, i) => (
            <button key={g.id} role="tab" type="button" aria-selected={tab === i} aria-controls={`net-${g.id}`} onClick={() => setTab(i)}
              className={`relative rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors ${tab === i ? 'text-ivory' : 'text-fg/70 hover:text-fg'}`}>
              {tab === i && <motion.span layoutId="net-tab" className="absolute inset-0 rounded-full bg-forest" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="relative">{g.title}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 min-h-[22rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={group.id} id={`net-${group.id}`} role="tabpanel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <p className="eyebrow text-fg/50">{group.note}</p>
              <ul className="mt-5 font-display text-[clamp(1.35rem,2.5vw,2.3rem)] font-bold leading-[1.25] tracking-[-0.035em]">
                {group.names.map((n, k) => (
                  <motion.li key={n} className="inline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(k * 0.015, 0.5) }}>
                    <span className="cursor-default text-fg/80 transition-colors duration-300 hover:text-accent">{n}</span>
                    {k < group.names.length - 1 && <span aria-hidden="true" className="mx-[0.35em] inline-block h-[0.22em] w-[0.22em] -translate-y-[0.18em] rounded-full bg-mustard" />}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-10 text-[12.5px] text-fg/50">Transcribed from the Annual Report 2025–2026 (pp. 39–43). Logos whose names could not be read with certainty are not listed.</p>
      </div>
    </section>
  )
}
