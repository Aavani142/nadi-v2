const items = ['Mental Health', 'Tribal Education', 'Youth & Community Development', 'Equity', 'Equality', 'Innovation', 'Collective Action', 'Sustainability']
export default function Marquee() {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden bg-nadi-yellow py-4 text-ink" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap font-display text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">
        {[...row, ...row].map((t, i) => <span key={i} className="flex items-center gap-10">{t}<span className="text-nadi-deep">/</span></span>)}
      </div>
    </div>
  )
}
