import SectionHead from './SectionHead.jsx'
import { CountUp, SplitWords } from '../lib/Motion.jsx'
import { impact } from '../data/content.js'

function Row({ title, tag, items, color }) {
  return (
    <div className="grid gap-8 border-t border-white/20 py-10 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <p className="label" style={{ color }}>{tag}</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{title}</h3>
      </div>
      <div className="grid gap-8 sm:grid-cols-3 lg:col-span-9">
        {items.map((it) => (
          <div key={it.l}>
            <p className="font-display text-5xl font-extrabold leading-none tracking-tight sm:text-6xl"><CountUp to={it.v} suffix={it.s} /></p>
            <p className="mt-3 max-w-[16rem] text-sm leading-snug text-cream/70">{it.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Impact() {
  return (
    <section className="bg-ink px-4 py-24 text-cream sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHead label="Impact" />
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <SplitWords text="Our impact, 2025–2026" className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:col-span-8" />
          <p className="text-lg text-cream/70 lg:col-span-3 lg:col-start-10">Each group is reported separately and should not be added together.</p>
        </div>
        <div className="mt-14">
          <Row title="Across the organisation" tag="Organisation-wide" items={impact.org} color="#F3CE68" />
          <Row title="Community & volunteer engagement" tag="Engagement" items={impact.community} color="#EF8875" />
          <Row title="Youth for Action" tag="Project" items={impact.yfa} color="#7FC0EA" />
        </div>
        <p className="label border-t border-white/20 pt-5 text-cream/40">{impact.source}</p>
      </div>
    </section>
  )
}