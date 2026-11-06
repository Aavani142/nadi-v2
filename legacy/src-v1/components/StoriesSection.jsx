// Stories: featured field stories, press coverage and NADI's public social channels.
import { motion } from 'framer-motion'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { stories, press, instagramPosts, contact, initiatives } from '../data/nadi.js'
import { ImageReveal, Reveal } from '../lib/Motion.jsx'
import { Eyebrow, Img, Lines, EASE } from './ui.jsx'

function Story({ s, className = '', aspect = 'aspect-[4/3]', sizes = '(min-width:1024px) 33vw, 92vw', delay = 0 }) {
  return (
    <Reveal delay={delay} className={className}>
      <figure className="group">
        <ImageReveal className={`${aspect} rounded-[22px]`} delay={delay}>
          <div className="h-full w-full transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]">
            <Img photo={s.photo} sizes={sizes} />
          </div>
        </ImageReveal>
        <figcaption className="mt-4 max-w-md">
          <p className="eyebrow text-accent">{s.tag}</p>
          <p className="mt-2 font-display text-[1.5rem] font-bold leading-tight tracking-[-0.03em] text-fg">{s.title}</p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-fg/60">{s.text}</p>
        </figcaption>
      </figure>
    </Reveal>
  )
}

function Press() {
  const tilt = [-6, 4, -2, 7]
  return (
    <div className="frame mt-28 grid items-center gap-14 lg:mt-40 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <Eyebrow>In the press</Eyebrow>
        <p className="display mt-6 text-[clamp(1.9rem,3.2vw,3rem)] leading-[1]">
          Kappiness and NADI's work have been covered by
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 accent text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.1] text-accent">
          {press.outlets.map((o, k) => <li key={o}>{o}{k < press.outlets.length - 1 && <span className="not-italic text-fg/25"> /</span>}</li>)}
        </ul>
        <p className="mt-6 text-[12.5px] text-fg/45">Clippings reproduced from the Annual Report 2025–2026.</p>
      </div>
      <div className="relative h-[110vw] max-h-[560px] lg:col-span-6 lg:col-start-7 lg:h-[560px]">
        {press.clippings.map((c, k) => (
          <motion.figure key={c.src}
            className="absolute w-[46%] cursor-default bg-paper p-2 shadow-[0_24px_50px_-24px_rgba(15,30,46,.45)]"
            style={{ left: `${[2, 50, 14, 54][k]}%`, top: `${[0, 4, 46, 50][k]}%`, zIndex: k }}
            initial={{ opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: tilt[k] }}
            whileHover={{ rotate: 0, scale: 1.06, zIndex: 10, transition: { duration: 0.4 } }}
            viewport={{ once: true, margin: '-80px 0px' }} transition={{ duration: 1, delay: k * 0.12, ease: EASE }}>
            <Img photo={c} sizes="280px" className="!h-auto" />
          </motion.figure>
        ))}
      </div>
    </div>
  )
}

function Social() {
  const handles = [
    { h: '@nadi.india', href: 'https://www.instagram.com/nadi.india/', d: 'NADI Foundation' },
    { h: '@kappi_ness', href: initiatives.kappiness.instagram, d: 'Kappiness' },
    { h: '@youth_4_action', href: initiatives.yfa.instagram, d: 'Youth for Action' },
    { h: '@navajeevana_', href: initiatives.navajeevana.instagram, d: 'Navajeevana' },
  ]
  return (
    <div className="frame mt-28 grid gap-14 border-t border-fg/10 pt-16 lg:mt-40 lg:grid-cols-12 lg:gap-8 lg:pt-20">
      <div className="lg:col-span-5">
        <Eyebrow>Follow the work</Eyebrow>
        <ul className="mt-8">
          {handles.map((x) => (
            <li key={x.h}>
              <a href={x.href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4 border-b border-fg/10 py-4">
                <span className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold tracking-[-0.04em] transition-colors group-hover:text-accent">{x.h}</span>
                <span className="flex items-center gap-2 text-[12.5px] text-fg/50">{x.d}<ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </a>
            </li>
          ))}
          <li>
            <a href={contact.socials[2].href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4 border-b border-fg/10 py-4">
              <span className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold tracking-[-0.04em] transition-colors group-hover:text-accent">Facebook</span>
              <span className="flex items-center gap-2 text-[12.5px] text-fg/50">{contact.socials[2].handle}<ArrowUpRight size={15} /></span>
            </a>
          </li>
        </ul>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <p className="eyebrow flex items-center gap-2 text-fg/50"><Instagram size={14} /> Recent public posts</p>
        <ol className="mt-6 grid gap-2 sm:grid-cols-2">
          {instagramPosts.map((p, k) => (
            <Reveal as="li" key={p.url} delay={k * 0.04}>
              <a href={p.url} target="_blank" rel="noopener noreferrer"
                className="group relative flex h-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-paper px-5 py-4 transition-colors duration-500 hover:bg-forest hover:text-ivory">
                <span>
                  <span className="block text-[14px] font-semibold">@{p.account}</span>
                  <span className="mt-0.5 block text-[12.5px] opacity-60">{p.type} · {p.date}</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 opacity-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>
            </Reveal>
          ))}
        </ol>
        <p className="mt-4 text-[12.5px] text-fg/45">Opens the original post on Instagram.</p>
      </div>
    </div>
  )
}

export default function StoriesSection() {
  const [g0, g1, g2, g3, g4] = stories.grid
  const f = stories.featured
  return (
    <section id="stories" className="g-sun relative pb-28 pt-24 sm:pt-32 lg:pb-40 lg:pt-40">
      <div className="frame">
        <Eyebrow>Stories</Eyebrow>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Lines className="display text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.95] lg:col-span-8"
            lines={['Stories from', <span key="i" className="accent text-accent">the ground.</span>]} />
          <p className="text-[15.5px] leading-relaxed text-fg/65 lg:col-span-4 lg:pt-5">
            Moments from NADI's programmes across Kerala, as documented in the Annual Report 2025–2026.
          </p>
        </div>

        {/* asymmetric editorial grid */}
        <div className="mt-16 grid gap-x-8 gap-y-16 lg:mt-24 lg:grid-cols-12 lg:gap-y-24">
          <Reveal className="lg:col-span-7">
            <figure className="group relative">
              <ImageReveal className="aspect-[4/3] rounded-[28px]">
                <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
                  <Img photo={f.photo} sizes="(min-width:1024px) 56vw, 92vw" />
                </div>
              </ImageReveal>
              <figcaption className="relative -mt-20 ml-4 mr-10 rounded-[22px] bg-page p-6 shadow-[0_20px_50px_-30px_rgba(15,30,46,.4)] sm:ml-8 sm:max-w-lg sm:p-8">
                <p className="eyebrow text-accent">{f.tag}</p>
                <p className="display mt-3 text-[clamp(1.9rem,3vw,2.8rem)] leading-[0.95]">{f.title}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-fg/65">{f.text}</p>
              </figcaption>
            </figure>
          </Reveal>
          <Story s={g0} className="lg:col-span-5 lg:mt-40" delay={0.1} />
          <Story s={g1} className="lg:col-span-3" aspect="aspect-[3/4]" sizes="(min-width:1024px) 22vw, 92vw" />
          <Story s={g2} className="lg:col-span-5 lg:mt-24" aspect="aspect-[16/10]" delay={0.08} />
          <Story s={g3} className="lg:col-span-4" delay={0.16} />
          <Story s={g4} className="lg:col-span-5 lg:col-start-4" aspect="aspect-[16/10]" />
        </div>
      </div>

      <Press />
      <Social />
    </section>
  )
}
