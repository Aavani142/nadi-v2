// Same filename as before so Home.jsx keeps working — this is the DONATE section.
import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import Button from './Button.jsx'
import { Magnetic, Reveal } from '../lib/Motion.jsx'
import { donateRoute } from '../data/content.js'

const amounts = [500, 1000, 2500, 5000]
const causes = ['Mental health', 'Tribal education', 'Youth action', 'Inclusion']

function Rolling({ value }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => '₹' + Math.round(v).toLocaleString('en-IN'))
  useEffect(() => { const c = animate(mv, value, { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }); return () => c.stop() }, [value, mv])
  return <motion.span>{text}</motion.span>
}

export default function DonateSection() {
  const [pick, setPick] = useState(1000)
  const [custom, setCustom] = useState('')
  const amount = pick === 'custom' ? Number(custom) || 0 : pick

  return (
    <section id="donate" className="relative overflow-hidden bg-nadi-yellow px-4 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label">Donate</p>
            <Reveal as="h2" className="mt-6 font-display text-[clamp(2.8rem,8vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">Support our work</Reveal>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">Every contribution helps keep NADI’s mental health, education and youth programmes running across Kerala.</p>

            <div className="mt-9 flex flex-wrap gap-2.5" role="radiogroup" aria-label="Donation amount">
              {[...amounts, 'custom'].map((a) => (
                <button key={a} role="radio" aria-checked={pick === a} onClick={() => setPick(a)}
                  className={`relative border border-ink px-5 py-3 font-display text-lg font-bold transition-colors ${pick === a ? 'text-cream' : 'hover:bg-white/60'}`}>
                  {pick === a && <motion.span layoutId="amt" className="absolute inset-0 bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative">{a === 'custom' ? 'Other' : '₹' + a.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
            {pick === 'custom' && (
              <motion.input initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} type="number" min="1" inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value)}
                placeholder="Enter amount in ₹" aria-label="Custom amount in rupees" className="mt-3 w-full max-w-xs border border-ink bg-white px-4 py-3 font-display text-lg font-bold outline-none placeholder:font-normal placeholder:text-ink/40" />
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Magnetic strength={0.15}><Button to={`${donateRoute.to}?amount=${amount}`} variant="ink">Donate <Rolling value={amount} /></Button></Magnetic>
              <span className="label text-ink/60">You’ll continue to the donation page</span>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="label text-ink/60">Your gift supports</p>
            <ul className="mt-4 border-t border-ink/30">
              {causes.map((c) => <li key={c} className="border-b border-ink/30 py-4 font-display text-2xl font-bold tracking-tight">{c}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}