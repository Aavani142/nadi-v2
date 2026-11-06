import { research } from '../data/network.js'
import { photos } from '../data/nadi.js'
import { CountUp, ImageReveal, Reveal } from '../lib/Motion.jsx'
import { Eyebrow, Img, Lines } from './ui.jsx'
import { Doodled, Doodle } from './Doodle.jsx'

/** Research & field learning — how NADI's youth study community realities first-hand. */
export default function ResearchSection() {
  return (
    <section id="research" aria-label="Research" className="relative overflow-hidden bg-navy pb-24 pt-24 text-ivory sm:pt-32 lg:pb-36 lg:pt-40">
      <div className="frame relative">
        <Eyebrow tone="text-mustard">Research</Eyebrow>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Lines className="display text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.9]"
              lines={['Learning from', <span key="a" className="accent text-mustard"><Doodled kind="squiggle" delay={0.9}>the field.</Doodled></span>]} />
            <Reveal>
              <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ivory/80">{research.lede}</p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="eyebrow text-mustard">{research.stat.context}</p>
            <p className="display mt-3 text-[clamp(4rem,8vw,7rem)] leading-[0.85]"><CountUp to={research.stat.v} suffix={research.stat.s} /></p>
            <p className="mt-2 text-[15px] text-ivory/75">{research.stat.l}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="grid grid-cols-5 gap-3 lg:col-span-5">
            <ImageReveal className="col-span-3 aspect-[3/4] rounded-[20px]"><Img photo={photos.communityVisit} sizes="(min-width:1024px) 22vw, 56vw" /></ImageReveal>
            <div className="col-span-2 flex flex-col gap-3 pt-12">
              <ImageReveal className="aspect-square rounded-[18px]" delay={0.1}><Img photo={photos.capacity} sizes="(min-width:1024px) 14vw, 36vw" /></ImageReveal>
              <ImageReveal className="aspect-[4/5] rounded-[18px]" delay={0.2}><Img photo={photos.digitalLiteracy} sizes="(min-width:1024px) 14vw, 36vw" /></ImageReveal>
            </div>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {research.points.map((p, k) => (
              <Reveal as="li" key={p.k} delay={k * 0.08} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-white/15 py-6">
                <span className="text-[12px] font-semibold tabular-nums text-mustard">0{k + 1}</span>
                <div>
                  <p className="font-display text-[1.6rem] font-bold leading-tight tracking-[-0.03em]">{p.k}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ivory/70">{p.v}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        {/* Publications — renders real entries from data/network.js; shows an honest empty state until then */}
        <div className="mt-20 border-t border-white/15 pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="display text-[clamp(1.8rem,3vw,2.6rem)]">Publications</p>
            <p className="eyebrow text-mustard">{research.publications.length ? `${research.publications.length} published` : 'Coming soon'}</p>
          </div>
          {research.publications.length ? (
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {research.publications.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="group block h-full rounded-[18px] border border-white/15 p-6 transition-colors hover:bg-white hover:text-navy">
                    <p className="eyebrow opacity-70">{r.type} · {r.publishedOn}</p>
                    <p className="mt-3 font-display text-[1.4rem] font-bold leading-tight tracking-[-0.02em]">{r.title}</p>
                    <p className="mt-1 text-[13.5px] opacity-70">{r.authors}</p>
                    <p className="mt-3 text-[14.5px] leading-relaxed opacity-80">{r.summary}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-ivory/70">
              NADI's research reports and papers will be published here as they are released. For research collaborations, write to <a href="mailto:nadifoundationkerala@gmail.com" className="link-u text-white">nadifoundationkerala@gmail.com</a>.
            </p>
          )}
        </div>
        <p className="mt-8 text-[12.5px] text-ivory/45">Source: Youth for Action chapter, Annual Report 2025–2026; NADI Foundation pamphlet.</p>
      </div>
    </section>
  )
}
