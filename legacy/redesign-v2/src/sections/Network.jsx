import { network } from '../data/network.js'
import { press } from '../data/nadi.js'
import { Kicker } from '../components/ui.jsx'

/** One endless row of names. Duplicated once so the loop is seamless; the copy is hidden from screen readers. */
function Row({ names, reverse, speed }) {
  const list = (hidden) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {names.map((n) => (
        <li key={n} className="flex items-center">
          <span className="display whitespace-nowrap px-5 text-[9vw] uppercase leading-none sm:text-6xl lg:text-7xl">{n}</span>
          <span className="h-3 w-3 shrink-0 rounded-full bg-river sm:h-4 sm:w-4" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="group flex overflow-hidden py-3 sm:py-4">
      <div className={`marquee flex w-max group-hover:[animation-play-state:paused] ${reverse ? 'marquee-rev' : ''}`} style={{ '--speed': `${speed}s` }}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  )
}

export default function Network() {
  const [publicBodies, institutions] = network
  return (
    <section id="network" aria-labelledby="network-title" className="overflow-hidden py-28 sm:py-36">
      <div className="frame grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <Kicker n="07" className="text-ink/60">Network</Kicker>
          <h2 id="network-title" className="display mt-8 text-[13vw] uppercase sm:text-[8vw] lg:text-[6.4vw] min-[1520px]:text-[98px]">
            In good <span className="italic-serif normal-case text-river">company.</span>
          </h2>
        </div>
        <p className="max-w-md leading-relaxed text-ink/70 md:col-span-5">
          Ministries, local government, universities, colleges, health partners and newsrooms we have worked alongside — as named in our Annual Report 2025–2026.
        </p>
      </div>

      <div className="mt-16 border-y border-ink/15 sm:mt-20" aria-label="Collaborators">
        <Row names={publicBodies.names} speed={140} />
        <div className="border-t border-ink/15"><Row names={institutions.names} speed={120} reverse /></div>
      </div>

      <div className="frame mt-14 grid gap-6 md:grid-cols-12">
        <p className="kicker text-ink/50 md:col-span-3">In the press</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-2 md:col-span-9">
          {press.outlets.map((o) => (
            <li key={o} className="italic-serif text-3xl text-ink/80 sm:text-4xl">{o}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
