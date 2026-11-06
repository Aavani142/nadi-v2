import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Photo from './Photo.jsx'
import Button from './Button.jsx'
import SectionHead from './SectionHead.jsx'
import { ImageReveal, Reveal, SplitWords } from '../lib/Motion.jsx'
import { assets } from '../data/assets.js'
import { director } from '../data/content.js'

export default function DirectorMessage() {
  const [open, setOpen] = useState(false)
  const has = director.paragraphs.length > 0
  return (
    <section className="bg-cream px-4 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHead label="Director's message" />
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ImageReveal className="aspect-[4/5]"><Photo src={assets.director} label="director-prabin.jpg · portrait" alt="Prabin P B, Director and Founder" className="h-full w-full" tone="#1B4468" /></ImageReveal>
            <div className="mt-4 flex items-baseline justify-between border-b border-ink/20 pb-3">
              <p className="font-display text-2xl font-extrabold tracking-tight">{director.name}</p>
              <p className="label text-ink/60">{director.role}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {director.pullQuote
              ? <SplitWords as="blockquote" text={director.pullQuote} className="mt-4 font-serif text-4xl leading-[1.08] sm:text-6xl" />
              : <Reveal><p className="mt-4 border border-dashed border-nadi-coral p-5 text-sm"><strong>PLACEHOLDER —</strong> add the pull-quote and full Director's Message from the Annual Report 2025–2026 in <code>src/data/content.js</code> → <code>director</code>. Nothing has been invented here.</p></Reveal>}

            <ul className="mt-12 grid border-t border-ink/20 sm:grid-cols-2">
              {director.themes.map((t, i) => (
                <li key={t} className="flex items-baseline gap-3 border-b border-ink/20 py-3"><span className="label text-ink/40">0{i + 1}</span><span className="font-medium">{t}</span></li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="#message" variant="ink" onClick={(e) => { e.preventDefault(); setOpen(!open) }} aria-expanded={open}>{open ? 'Close Message' : 'Read Full Message'}</Button>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div id="message" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} className="overflow-hidden">
              <div className="mt-14 border-t border-ink pt-8 font-serif text-xl leading-relaxed sm:text-2xl lg:columns-2 lg:gap-12">
                {has ? director.paragraphs.map((p, i) => <p key={i} className="mb-5">{p}</p>) : <p className="italic text-ink/50">Full message to be added from the Annual Report.</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}