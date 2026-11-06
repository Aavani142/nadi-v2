import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, MapPin } from 'lucide-react'
import { initiatives as I, photos } from '../data/nadi.js'
import { useMedia } from '../lib/intro.js'
import { scrollToY, scrollToHash } from '../lib/SmoothScroll.jsx'
import { CountUp, ImageReveal } from '../lib/Motion.jsx'
import { Eyebrow, Img, Lines, SdgChips, EASE } from './ui.jsx'
import { Clay } from './Clay.jsx'

const ORDER = [
  { id: 'kappiness', key: 'kappiness' },
  { id: 'prabodhini', key: 'prabodhini' },
  { id: 'youth-for-action', key: 'yfa' },
  { id: 'ekatva', key: 'ekatva' },
  { id: 'navajeevana', key: 'navajeevana' },
]

// ───────── shared pieces ─────────
function Index({ i, theme, className = '' }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span className="tabular-nums">{String(i + 1).padStart(2, '0')} / 05</span>
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      <span className="opacity-80">{theme}</span>
    </p>
  )
}
function Plaque({ src, alt, className = '', imgClass = 'h-12' }) {
  return (
    <div className={`inline-flex w-fit items-center rounded-2xl bg-white px-4 py-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,.5)] ${className}`}>
      <img src={src} alt={alt} loading="lazy" className={`w-auto object-contain ${imgClass}`} />
    </div>
  )
}
/** Photo that reveals when its panel enters view. */
function Shot({ photo, className = '', sizes = '40vw', delay = 0, from = 'bottom' }) {
  return (
    <ImageReveal className={className} delay={delay} from={from}>
      <Img photo={photo} sizes={sizes} className="transition-transform duration-[1.2s] ease-out hover:scale-[1.04]" />
    </ImageReveal>
  )
}
const Title = ({ children, className }) => (
  <Lines as="h3" className={`display leading-[0.88] ${className}`} lines={[children]} />
)

// ───────── 01 Kappiness — espresso, caramel, amber ─────────
function Kappiness({ i }) {
  const p = I.kappiness
  return (
    <div className="relative grid h-full gap-10 px-5 py-12 text-[#F4E6CF] sm:px-10 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-14" style={{ background: 'radial-gradient(120% 90% at 85% 10%, #4A2C1A 0%, #2B1A10 55%, #21140C 100%)' }}>
      <div className="flex flex-col lg:col-span-5">
        <Index i={i} theme={p.theme} className="text-[#E3A857]" />
        <div className="mt-8 flex items-center gap-4">
          <Plaque src={p.logo} alt="Kappiness logo" className="bg-[#FBF3E6]" imgClass="h-11" />
        </div>
        <Title className="accent mt-6 text-[clamp(3.8rem,8vw,8rem)] text-[#E3A857]">Kappiness</Title>
        <p className="eyebrow mt-3 text-[#F4E6CF]/70">{p.focus}</p>
        <p className="mt-6 max-w-lg font-serif text-[clamp(1.15rem,1.6vw,1.45rem)] font-light leading-snug">{p.lede}</p>
        <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-[#F4E6CF]/65">{p.body}</p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#F4E6CF]/15 pt-6 sm:grid-cols-4 lg:mt-auto lg:grid-cols-4">
          {p.stats.map((s) => (
            <div key={s.l}>
              <dt className="sr-only">{s.l}</dt>
              <dd className="font-serif text-4xl font-light text-[#E3A857]"><CountUp to={s.v} suffix={s.s} duration={1.6} /></dd>
              <dd className="mt-1 text-[12px] leading-snug text-[#F4E6CF]/60">{s.l}</dd>
            </div>
          ))}
        </dl>
        <SdgChips list={p.sdgs} light className="mt-6" />
      </div>

      <div className="relative h-[115vw] max-h-[640px] lg:col-span-7 lg:h-full lg:max-h-none">
        <Shot photo={photos.kappinessGarden} sizes="(min-width:1024px) 30vw, 60vw" className="absolute bottom-0 right-0 top-[4%] w-[60%] rounded-t-full" />
        <Shot photo={photos.kappinessRoom} sizes="(min-width:1024px) 18vw, 40vw" delay={0.15} className="absolute left-[6%] top-0 w-[40%] rounded-[22px] aspect-[4/3]" from="left" />
        <div className="absolute bottom-[6%] left-0 w-[46%] rounded-full p-2" style={{ background: '#2B1A10' }}>
          <Shot photo={photos.kappinessReading} sizes="(min-width:1024px) 20vw, 45vw" delay={0.3} className="aspect-square rounded-full" />
        </div>
        <p className="absolute bottom-0 right-0 translate-y-full pt-3 text-[12px] text-[#F4E6CF]/50 lg:translate-y-0 lg:pb-1 lg:pr-[62%] lg:text-right">Kappiness Mental Health Café &amp; Therapeutic Centre</p>
      </div>
    </div>
  )
}

// ───────── 02 Prabodhini — paper, forest, earth ─────────
function Prabodhini({ i }) {
  const p = I.prabodhini
  const polaroids = [
    { photo: photos.prabodhiniClass, r: -4 },
    { photo: photos.prabodhiniGroup2, r: 3 },
    { photo: photos.prabodhiniActivity, r: -2 },
  ]
  return (
    <div className="relative grid h-full bg-[#EFE5CF] text-[#2A2117] lg:grid-cols-12">
      <div className="relative h-[80vw] max-h-[560px] lg:col-span-6 lg:h-full lg:max-h-none">
        <Shot photo={photos.learningPlay} sizes="(min-width:1024px) 50vw, 100vw" from="left" className="absolute inset-0 rounded-b-[48px] lg:rounded-b-none lg:rounded-r-[220px]" />
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#EFE5CF] px-3.5 py-2 text-[12px] font-semibold lg:bottom-8 lg:left-8">
          <MapPin size={14} className="text-[#2F5D46]" /> {p.place}
        </span>
      </div>
      <div className="flex flex-col px-5 py-12 sm:px-10 lg:col-span-6 lg:px-14 lg:py-14">
        <Index i={i} theme={p.theme} className="text-[#2F5D46]" />
        <div className="mt-6 flex items-end gap-5">
          <Plaque src={p.logo} alt="Prabodhini logo" imgClass="h-20" className="px-3 py-2" />
        </div>
        <Title className="mt-6 text-[clamp(3.4rem,6.6vw,6.8rem)] text-[#2F5D46]">Prabodhini</Title>
        <p className="mt-5 max-w-xl font-serif text-[clamp(1.15rem,1.55vw,1.4rem)] font-light leading-snug">{p.lede}</p>
        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-[#2A2117]/65">{p.body}</p>
        <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] font-semibold text-[#8A5A2B]" aria-label="Learning approach">
          {p.flow.map((f, k) => (
            <li key={f} className="flex items-center gap-2">{f}{k < p.flow.length - 1 && <span aria-hidden="true" className="h-px w-5 bg-[#8A5A2B]/50" />}</li>
          ))}
        </ol>
        <div className="mt-8 flex items-end gap-3 lg:mt-auto">
          {polaroids.map((x, k) => (
            <motion.div key={k} className="w-[30%] max-w-[150px] bg-paper p-1.5 pb-5 shadow-[0_14px_30px_-16px_rgba(42,33,23,.55)]"
              initial={{ rotate: 0, y: 30, opacity: 0 }} whileInView={{ rotate: x.r, y: 0, opacity: 1 }} whileHover={{ rotate: 0, y: -6, scale: 1.04 }}
              viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 + k * 0.1, ease: EASE }}>
              <div className="aspect-[4/3] overflow-hidden"><Img photo={x.photo} sizes="150px" /></div>
            </motion.div>
          ))}
          <SdgChips list={p.sdgs} className="ml-auto hidden flex-col items-end xl:flex" />
        </div>
        <SdgChips list={p.sdgs} className="mt-6 xl:hidden" />
      </div>
    </div>
  )
}

// ───────── 03 Youth for Action — indigo, electric ─────────
function YouthForAction({ i }) {
  const p = I.yfa
  const mosaic = [
    { photo: photos.campus, c: 'col-span-4 row-span-3' },
    { photo: photos.girlChildVolunteers, c: 'col-span-2 row-span-3' },
    { photo: photos.hivDay, c: 'col-span-3 row-span-3' },
    { photo: photos.communityVisit, c: 'col-span-3 row-span-3' },
  ]
  return (
    <div className="relative h-full overflow-hidden bg-[#0A2D50] text-white">
      <div className="relative grid h-full gap-10 px-5 py-12 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-14">
        <div className="flex flex-col lg:col-span-5">
          <Index i={i} theme={p.theme} className="text-[#9CC0E4]" />
          <Plaque src={p.logo} alt="Youth for Action logo" imgClass="h-16" className="mt-6 px-3 py-2" />
          <Title className="mt-6 text-[clamp(3.2rem,6.2vw,6.4rem)]">
            Youth <span className="accent text-[#9CC0E4]">for</span> Action
          </Title>
          <p className="mt-5 max-w-lg font-serif text-[clamp(1.15rem,1.55vw,1.4rem)] font-light leading-snug text-white/90">{p.lede}</p>
          <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-white/60">{p.body}</p>
          <ol className="mt-7 grid grid-cols-5 gap-1.5" aria-label="Approach">
            {p.flow.map((f, k) => (
              <motion.li key={f} className="relative border-t-2 border-[#9CC0E4] pt-2 text-[12px] font-semibold leading-tight text-white/85"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + k * 0.1, duration: 0.6 }}>
                <span className="block text-[10px] tabular-nums text-[#9CC0E4]">0{k + 1}</span>{f}
              </motion.li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-auto">
            <SdgChips list={p.sdgs} light />
            <a href="#impact" onClick={(e) => { e.preventDefault(); scrollToHash('#impact') }} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9CC0E4] hover:text-white">
              Youth for Action in numbers <ArrowDownRight size={15} />
            </a>
          </div>
        </div>
        <div className="grid h-[110vw] max-h-[620px] grid-cols-6 grid-rows-6 gap-3 lg:col-span-7 lg:h-full lg:max-h-none">
          {mosaic.map((m, k) => (
            <Shot key={k} photo={m.photo} sizes="(min-width:1024px) 28vw, 60vw" delay={k * 0.1} className={`rounded-[20px] ${m.c}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ───────── 04 Ekatva — blush, wine, ink ─────────
function Ekatva({ i }) {
  const p = I.ekatva
  return (
    <div className="flex h-full flex-col bg-[#F4E1DE] text-[#1E1416]">
      <div className="relative h-[52vw] max-h-[420px] shrink-0 lg:h-[38%] lg:max-h-none">
        <Shot photo={photos.ekatvaConvocation} sizes="100vw" from="right" className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-5 pb-4 pt-16 sm:px-10 lg:px-12">
          <p className="eyebrow text-white/90">{p.milestone}</p>
        </div>
      </div>
      <div className="grid flex-1 gap-10 px-5 py-10 sm:px-10 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-10">
        <div className="lg:col-span-4">
          <Index i={i} theme={p.theme} className="text-[#8C1D40]" />
          <Title className="mt-5 font-serif text-[clamp(3.6rem,7vw,7rem)] font-normal uppercase !tracking-[0.01em]">Ekatva</Title>
          <Plaque src={p.logo} alt="EKATVA logo" imgClass="h-12" className="mt-5" />
        </div>
        <div className="lg:col-span-4">
          <p className="font-serif text-[clamp(1.15rem,1.55vw,1.4rem)] font-light leading-snug">{p.lede}</p>
          <p className="mt-4 text-[14.5px] leading-relaxed text-[#1E1416]/65">{p.body}</p>
          <SdgChips list={p.sdgs} className="mt-6" />
        </div>
        <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-6 lg:col-span-4">
          {p.stats.map((s) => (
            <div key={s.l} className="border-t border-[#8C1D40]/25 pt-3">
              <dt className="sr-only">{s.l}</dt>
              <dd className="font-serif text-[clamp(2.4rem,3.6vw,3.4rem)] font-light leading-none text-[#8C1D40]"><CountUp to={s.v} suffix={s.s} duration={1.4} /></dd>
              <dd className="mt-2 text-[12.5px] leading-snug text-[#1E1416]/65">{s.l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

// ───────── 05 Navajeevana — forest green with the logo's yellow & blue ─────────
function Navajeevana({ i }) {
  const p = I.navajeevana
  return (
    <div className="relative grid h-full gap-10 overflow-hidden bg-[#0E3B2E] px-5 py-12 text-[#E8F3EC] sm:px-10 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-14">
      <div className="flex flex-col lg:col-span-6">
        <Index i={i} theme={p.theme} className="text-[#F2C230]" />
        <Plaque src={p.logo} alt="Navajeevana logo" imgClass="h-20" className="mt-6 px-3 py-2" />
        <Title className="mt-6 text-[clamp(3.2rem,6.4vw,6.6rem)]">Navajeevana</Title>
        <p className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#F2C230]"><MapPin size={15} /> {p.place}</p>
        <p className="mt-6 max-w-xl font-serif text-[clamp(1.2rem,1.7vw,1.6rem)] font-light leading-snug">{p.lede}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-auto">
          <SdgChips list={p.sdgs} light />
          <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#F2C230] hover:text-white">
            Follow @navajeevana_ <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      <div className="relative h-[100vw] max-h-[560px] lg:col-span-6 lg:h-full lg:max-h-none">
        {/* ribbons in the Navajeevana logo's colours, flowing between the photographs */}
        <figure className="absolute right-0 top-[6%] w-[74%] max-w-[440px]">
          <Shot photo={photos.navTaskForce} sizes="440px" className="aspect-[3/2] rounded-[24px]" />
          <figcaption className="mt-2 text-right text-[12px] text-[#E8F3EC]/55">Youth Task Force training</figcaption>
        </figure>
        <figure className="absolute bottom-[4%] left-0 w-[70%] max-w-[420px]">
          <div className="rounded-[30px] bg-[#0E3B2E] p-2">
            <Shot photo={photos.navCaregivers} sizes="420px" delay={0.2} className="aspect-[3/2] rounded-[24px]" />
          </div>
          <figcaption className="mt-1 pl-2 text-[12px] text-[#E8F3EC]/55">A Navajeevana community session</figcaption>
        </figure>
      </div>
    </div>
  )
}

/** "Learn more" — the initiative's own official account, or NADI's account when it has none. No internal pages yet. */
function LearnMore({ k, name }) {
  const href = I[k].instagram ?? 'https://www.instagram.com/nadi.india/'
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Learn more about ${name} on Instagram`}
      className="group absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-ink shadow-[0_8px_24px_-12px_rgba(0,0,0,.5)] transition-colors hover:bg-white sm:right-6 sm:top-6">
      Learn more <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  )
}

const PANELS = { kappiness: Kappiness, prabodhini: Prabodhini, yfa: YouthForAction, ekatva: Ekatva, navajeevana: Navajeevana }

/** Desktop: sticky stacked panels; each recedes as the next slides over it. */
function StackedPanels() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <div ref={ref} className="relative">
      {ORDER.map((o, i) => <StackPanel key={o.id} i={i} id={o.id} progress={scrollYProgress} Comp={PANELS[o.key]} />)}
    </div>
  )
}
function StackPanel({ i, id, progress, Comp }) {
  const n = ORDER.length - 1
  const range = [i / n, Math.min((i + 1) / n, 1)]
  const last = i === n
  const scale = useTransform(progress, range, last ? [1, 1] : [1, 0.9])
  const dim = useTransform(progress, range, last ? [0, 0] : [0, 0.12]) // a whisper of depth — never grey out the colour
  const radius = useTransform(progress, range, last ? [36, 36] : [36, 56])
  return (
    <div id={`work-${id}`} className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: i + 1 }}>
      <motion.article style={{ scale, borderTopLeftRadius: radius, borderTopRightRadius: radius }} className="relative h-full origin-top overflow-hidden shadow-[0_-30px_60px_-30px_rgba(10,37,64,.45)]">
        <Comp i={i} />
        <LearnMore k={ORDER[i].key} name={I[ORDER[i].key].name} />
        <motion.div aria-hidden="true" style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.article>
    </div>
  )
}

const STACK_QUERY = '(min-width: 1024px) and (min-height: 640px)'

/** Scroll to an initiative by id — accounts for the sticky stack on desktop, where element rects lie. */
export function scrollToInitiative(id) {
  const i = ORDER.findIndex((o) => o.id === id)
  const stack = document.getElementById('work-stack')
  if (i < 0) return
  if (stack && window.matchMedia(STACK_QUERY).matches) {
    const top = stack.getBoundingClientRect().top + window.scrollY
    scrollToY(top + i * window.innerHeight)
  } else scrollToHash(`#work-${id}`)
}

export default function InitiativesSection() {
  const desktop = useMedia(STACK_QUERY, true)
  const jump = (e, i) => { e.preventDefault(); scrollToInitiative(ORDER[i].id) }

  return (
    <section id="work" className="relative bg-page">
      <div className="frame pb-14 pt-24 sm:pt-32 lg:pb-24 lg:pt-40">
        <div className="relative">
          <Clay kind="sun" float className="absolute left-[40rem] -top-4 hidden w-28 lg:block" />
        </div>
        <Eyebrow tone="text-accent">Our work</Eyebrow>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Lines className="display text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.95] lg:col-span-7"
            lines={['Five initiatives.', <span key="i" className="accent text-accent">One shared purpose.</span>]} />
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
            <p className="text-[17px] leading-relaxed text-fg/70">
              From a mental health café in Thiruvananthapuram to tribal classrooms in Amboori and a care network in Wayanad, each initiative has its own people, place and character.
            </p>
            <ol className="mt-8 border-t border-fg/10">
              {ORDER.map((o, i) => (
                <li key={o.id} className="border-b border-fg/10">
                  <a href={`#work-${o.id}`} onClick={(e) => jump(e, i)} className="group flex items-center justify-between py-3">
                    <span className="flex items-baseline gap-4">
                      <span className="text-[11px] font-semibold tabular-nums text-accent">0{i + 1}</span>
                      <span className="font-display text-xl font-bold tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:translate-x-1.5">{I[o.key].name}</span>
                    </span>
                    <ArrowDownRight size={16} className="text-fg/30 transition-colors group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {desktop ? (
        <div id="work-stack"><StackedPanels /></div>
      ) : (
        <div className="flex flex-col gap-3 px-2 pb-3 sm:px-3">
          {ORDER.map((o, i) => {
            const Comp = PANELS[o.key]
            return (
              <article key={o.id} id={`work-${o.id}`} className="relative overflow-hidden rounded-[28px]" style={{ scrollMarginTop: 12 }}>
                <Comp i={i} />
                <LearnMore k={o.key} name={I[o.key].name} />
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
