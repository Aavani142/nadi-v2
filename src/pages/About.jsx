import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { focusAreas, initiatives, leadership as L, org, photos, contact } from '../data/nadi.js'
import { research } from '../data/network.js'
import { gsap, useGsap, ScrollTrigger } from '../lib/gsap.js'
import { aboutReveals, blinds, flipChars } from '../lib/aboutMotion.js'
import { scrollToHash } from '../lib/SmoothScroll.jsx'
import { Img, PillLink } from '../components/ui.jsx'
import { INITIATIVE_IDS } from '../components/InitiativesSection.jsx'
import AnnualReportsSection from '../components/reports/AnnualReportsSection.jsx'
import VisionMissionJourney from '../components/VisionMissionJourney.jsx'

const Eyebrow = ({ children, className = 'text-accent' }) => (
  <p className={`eyebrow flex items-center gap-3 ${className}`}><span aria-hidden="true" className="h-px w-8 bg-current" /><span className="ab-scramble">{children}</span></p>
)
/** Two-line display heading — its letters flip up in 3D on the About page (see lib/aboutMotion.js). */
const Heading = ({ id, a, b, className = '' }) => (
  <h2 id={id} data-reveal-lines className={`display text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9] text-heading ${className}`}>
    <span className="block overflow-hidden pb-[0.05em]"><span data-line className="block">{a}</span></span>
    <span className="block overflow-hidden pb-[0.08em]"><span data-line className="accent block text-accent">{b}</span></span>
  </h2>
)

// How NADI works — each point paraphrases a documented statement (pamphlet / Annual Report 2025–2026)
const APPROACH = [
  { k: 'Grassroots, measured', v: org.approach },
  { k: 'Youth-led', v: initiatives.yfa.lede },
  { k: 'Learning from the field', v: research.lede },
  { k: 'In partnership', v: 'NADI is affiliated with the Ministry of Youth Affairs and Sports, and works alongside government bodies, universities, colleges, health partners and the media — EKATVA, for example, is implemented in collaboration with HLL Lifecare Limited.' },
]
// the river path down the About page's left gutter — a slow meander
const RIVER = (() => {
  let d = 'M12 0'
  for (let y = 0; y < 1200; y += 50) d += ` C ${y % 100 ? 4 : 20} ${y + 17}, ${y % 100 ? 20 : 4} ${y + 33}, 12 ${y + 50}`
  return d
})()
const INIT_PHOTOS = { kappiness: photos.kappinessGarden, prabodhini: photos.learningPlay, yfa: photos.volunteersMural, ekatva: photos.ekatvaConvocation, navajeevana: photos.navTaskForce }

export default function About() {
  const ref = useRef(null)
  const { hash } = useLocation()

  useEffect(() => { document.title = 'About — NADI Foundation' }, [])
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => { ScrollTrigger.refresh(); scrollToHash(hash, { immediate: true }) }, 200)
    return () => clearTimeout(t)
  }, [hash])

  useGsap(ref, () => {
    const cleanups = []
    // A · hero — letters flip up from the centre out; photos open like blinds
    flipChars('.ab-word', { delay: 0.2, stagger: 0.035 })
    cleanups.push(blinds(ref.current.querySelector('.ab-photo-main'), { slats: 9, delay: 0.45, trigger: null }))
    cleanups.push(blinds(ref.current.querySelector('.ab-photo-side'), { slats: 5, delay: 0.9, trigger: null, vertical: false }))
    gsap.from('.ab-fade', { x: -30, opacity: 0, filter: 'blur(8px)', duration: 1.1, stagger: 0.1, delay: 0.8, ease: 'expo.out', clearProps: 'filter' })
    gsap.to('.ab-photo-main img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.ab-hero', start: 'top top', end: 'bottom top', scrub: true } })
    // the river — a single line drawn down the page as you read
    gsap.fromTo('.ab-river path', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
    // E · approach statement brightens word by word
    gsap.fromTo('.ab-ap-word', { opacity: 0.2 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.ab-ap-text', start: 'top 80%', end: 'bottom 50%', scrub: true } })
    // G · director — portrait opens in horizontal slats, quote words sharpen in from the left
    cleanups.push(blinds(ref.current.querySelector('.ab-dir-photo'), { slats: 6, vertical: false, trigger: '#director' }))
    gsap.from('.ab-dir-word', { x: -18, opacity: 0, filter: 'blur(6px)', duration: 0.9, stagger: 0.025, ease: 'expo.out', clearProps: 'filter', scrollTrigger: { trigger: '#director', start: 'top 60%', once: true } })
    // G2 · founders — each portrait opens in vertical slats, one after another
    gsap.utils.toArray('.ab-founder').forEach((el, i) => {
      cleanups.push(blinds(el.querySelector('.ab-founder-photo'), { slats: 5, delay: i * 0.15, trigger: el }))
      gsap.from(el.querySelector('figcaption'), { x: -24, opacity: 0, filter: 'blur(6px)', duration: 1, delay: 0.5 + i * 0.15, ease: 'expo.out', clearProps: 'filter', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
    })
    // touch screens have no hover: a portrait colours in while it is in the centre of the screen
    gsap.matchMedia().add('(hover: none)', () => {
      gsap.utils.toArray('.ab-founder').forEach((card) => ScrollTrigger.create({
        trigger: card, start: 'top 65%', end: 'bottom 35%',
        toggleClass: { targets: card.querySelector('img'), className: '!grayscale-0' },
      }))
    })
    cleanups.push(aboutReveals(ref.current))
    return () => cleanups.forEach((c) => c && c())
  })

  const approachWords = org.approach.split(' ')

  return (
    <main id="main" ref={ref} className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[4px] top-[92svh] z-[5] w-4 sm:left-[10px] sm:w-6 lg:left-[18px]">
        <svg viewBox="0 0 24 1200" preserveAspectRatio="none" fill="none" className="ab-river block h-full w-full text-[#78BAEC] opacity-60">
          <path d={RIVER} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      {/* A · Hero */}
      <section className="ab-hero relative overflow-hidden bg-navy-deep pb-20 pt-32 text-ivory sm:pt-40 lg:pb-28">
        <div className="frame">
          <p className="ab-fade eyebrow flex items-center gap-3 text-[#BFD6EC]"><span aria-hidden="true" className="h-px w-8 bg-current" />About us</p>
          <h1 className="display mt-6 text-[clamp(3.2rem,10.5vw,11rem)] leading-[0.84] tracking-[-0.05em]">
            {['About NADI', 'Foundation'].map((w, i) => (
              <span key={w} className={`block pb-[0.04em] ${i === 1 ? 'text-[#BFD6EC]' : ''}`}><span className="ab-word block">{w}</span></span>
            ))}
          </h1>
          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
            <div className="ab-photo-main relative aspect-[16/10] overflow-hidden rounded-[6px] lg:col-span-8">
              <Img photo={photos.teamNight} sizes="(min-width:1024px) 62vw, 92vw" priority />
            </div>
            <div className="flex flex-col lg:col-span-4">
              <p className="ab-fade text-[clamp(1.25rem,1.8vw,1.55rem)] font-medium leading-snug">
                A youth-driven, ISO 9001:2015 certified non-governmental organisation in Thiruvananthapuram, building resilient communities across Kerala.
              </p>
              <p className="ab-fade mt-5 text-[15.5px] leading-relaxed text-ivory/70">{org.intro}</p>
              <div className="ab-photo-side mt-8 aspect-[4/3] overflow-hidden rounded-[6px] lg:mt-auto">
                <Img photo={photos.volunteersMural} sizes="(min-width:1024px) 30vw, 92vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B · Who we are */}
      <section aria-labelledby="who-title" className="g-ivory pb-24 pt-24 sm:pt-32 lg:pb-32 lg:pt-40">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow>Who we are</Eyebrow>
            <Heading id="who-title" a="Youth-driven." b="Rooted in Kerala." className="mt-6" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-14">
            <p data-reveal className="text-[clamp(1.2rem,1.7vw,1.45rem)] leading-relaxed text-heading">{org.whoWeAre}</p>
            <p data-reveal className="mt-6 text-[16px] leading-relaxed text-fg/70">
              Since its establishment on 10 September 2022, NADI has worked across Thiruvananthapuram, Wayanad, Ernakulam and Pathanamthitta — with children in tribal communities, young people and students, transgender persons seeking livelihoods, family caregivers and frontline health workers.
            </p>
          </div>
        </div>
        <dl className="frame mt-20 grid gap-x-8 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {org.facts.map((f, i) => (
            <div key={f.k} data-reveal data-delay={(i % 4) * 0.06} className="border-t border-heading/20 py-6">
              <dt className="eyebrow text-fg/55">{f.k}</dt>
              <dd className="mt-2 text-[15.5px] font-medium leading-snug text-heading">{f.v}</dd>
            </div>
          ))}
        </dl>
        <p className="frame mt-2 text-[12px] text-fg/45">Source: NADI Foundation pamphlet and Annual Report 2025–2026.</p>
      </section>

      {/* C · Vision & Mission — pinned scroll sequence */}
      <VisionMissionJourney />

      {/* D · Three core focus areas */}
      <section aria-labelledby="areas-title" className="bg-navy-deep pb-24 pt-24 text-ivory sm:pt-32 lg:pb-32 lg:pt-40">
        <div className="frame">
          <Eyebrow className="text-[#BFD6EC]">Our three core focus areas</Eyebrow>
          <h2 id="areas-title" data-reveal-lines className="display mt-6 text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9]">
            <span className="block overflow-hidden pb-[0.05em]"><span data-line className="block">Three core areas.</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-line className="accent block text-[#BFD6EC]">One collective purpose.</span></span>
          </h2>
          <ol className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:mt-24">
            {focusAreas.map((a, i) => (
              <li key={a.id} className={i === 1 ? 'md:mt-20' : ''}>
                <div data-reveal-img className="aspect-[4/5] overflow-hidden rounded-[6px]"><Img photo={a.photo} sizes="(min-width:768px) 30vw, 92vw" /></div>
                <p data-reveal className="display mt-6 text-[2.6rem] leading-none text-ivory/40">{a.n}</p>
                <h3 data-reveal className="display mt-3 text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[0.95]">{a.title}{a.sub && <span className="accent mt-1 block text-[0.7em] font-normal text-[#BFD6EC]">{a.sub}</span>}</h3>
                <p data-reveal className="mt-4 text-[15.5px] leading-relaxed text-ivory/70">{a.text}</p>
                <p data-reveal className="eyebrow mt-4 text-ivory/45">{a.initiatives.map((k) => initiatives[k].name).join(' · ')}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* E · Our approach */}
      <section aria-labelledby="approach-title" className="g-ivory pb-24 pt-24 sm:pt-32 lg:pb-32 lg:pt-40">
        <div className="frame">
          <Eyebrow>Our approach</Eyebrow>
          <h2 id="approach-title" className="sr-only">Our approach</h2>
          <p className="ab-ap-text mt-8 max-w-5xl font-display text-[clamp(1.8rem,3.8vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.035em] text-heading">
            {approachWords.map((w, i) => <span key={i} className="ab-ap-word">{w} </span>)}
          </p>
          <ol className="mt-20 grid gap-x-8 sm:grid-cols-2 lg:mt-28">
            {APPROACH.map((p, i) => (
              <li key={p.k} data-reveal data-delay={(i % 2) * 0.08} className="grid grid-cols-[3rem_1fr] border-t border-heading/15 py-7">
                <span className="text-[12px] font-semibold tabular-nums text-accent">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-[1.6rem] font-bold leading-tight tracking-[-0.03em] text-heading">{p.k}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-fg/70">{p.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* F · Our initiatives */}
      <section aria-labelledby="initiatives-title" className="bg-navy pb-24 pt-24 text-ivory sm:pt-32 lg:pb-32 lg:pt-40">
        <div className="frame">
          <Eyebrow className="text-[#BFD6EC]">Our initiatives</Eyebrow>
          <h2 id="initiatives-title" data-reveal-lines className="display mt-6 text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9]">
            <span className="block overflow-hidden pb-[0.05em]"><span data-line className="block">Five initiatives.</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-line className="accent block text-[#BFD6EC]">One shared purpose.</span></span>
          </h2>
          <ul className="mt-16 border-t border-white/15 lg:mt-20">
            {Object.entries(INITIATIVE_IDS).map(([key, id], i) => {
              const p = initiatives[key]
              return (
                <li key={key} data-reveal className="border-b border-white/15">
                  <Link to={`/#work-${id}`} className="group grid items-center gap-5 py-7 sm:grid-cols-[3rem_9rem_1fr_auto] sm:gap-8">
                    <span className="hidden text-[12px] font-semibold tabular-nums text-[#BFD6EC] sm:block">0{i + 1}</span>
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-[6px] sm:aspect-[4/3] sm:w-36 sm:rounded-[4px]">
                      <Img photo={INIT_PHOTOS[key]} sizes="(min-width:640px) 144px, 92vw" className="transition-transform duration-700 ease-out group-hover:scale-[1.08]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex h-9 items-center rounded-md bg-white px-2"><img src={p.logo} alt="" loading="lazy" className="h-7 w-auto max-w-[6rem] object-contain" /></span>
                        <h3 className="display text-[clamp(1.9rem,3.2vw,3rem)] leading-none transition-transform duration-500 ease-out group-hover:translate-x-2">{p.name}</h3>
                      </div>
                      <p className="eyebrow mt-3 text-[#BFD6EC]">{p.focus}</p>
                      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ivory/70">{p.lede}</p>
                    </div>
                    <span className="hidden h-12 w-12 place-items-center rounded-full border border-white/25 transition-colors group-hover:bg-ivory group-hover:text-navy-deep sm:grid"><ArrowUpRight size={18} /></span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* G · Director's message */}
      <section id="director" aria-labelledby="dir-title" className="g-ivory pb-24 pt-24 sm:pt-32 lg:pb-32 lg:pt-40">
        <div className="frame">
          <Eyebrow>Director's message</Eyebrow>
          <Heading id="dir-title" a="A message from" b="the Director." className="mt-6" />
          <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-8">
            <figure className="lg:col-span-4">
              <div className="ab-dir-photo aspect-[4/5] overflow-hidden rounded-[6px] bg-surface"><Img photo={L.director.photo} sizes="(min-width:1024px) 30vw, 90vw" className="object-top" /></div>
              <figcaption className="mt-5 border-t border-heading/70 pt-4">
                <p className="font-display text-[1.9rem] font-bold leading-none tracking-[-0.04em] text-heading">{L.director.name}</p>
                <p className="eyebrow mt-2 text-accent">{L.director.role}, NADI Foundation</p>
              </figcaption>
            </figure>
            <div className="lg:col-span-7 lg:col-start-6">
              <blockquote>
                <p className="font-serif text-[clamp(1.7rem,3vw,2.8rem)] font-light leading-[1.15] tracking-[-0.02em] text-heading">
                  <span className="sr-only">{L.quote}</span>
                  <span aria-hidden="true">“{L.quote.split(' ').map((w, i) => (
                    <span key={i} className="ab-dir-word inline-block">{w}&nbsp;</span>
                  ))}”</span>
                </p>
                <div className="mt-10 space-y-5 border-t border-heading/15 pt-8 text-[16.5px] leading-relaxed text-fg/80">
                  <p data-reveal>“{L.message}”</p>
                  <p data-reveal>“{org.commitment}”</p>
                </div>
                <footer data-reveal className="mt-6 text-[12.5px] text-fg/50">Excerpts from the Director's Message, NADI Foundation Annual Report 2025–2026.</footer>
              </blockquote>
              {/* PLACEHOLDER: the full approved message has not been supplied — never write it on NADI's behalf */}
              <div data-reveal className="mt-10 rounded-[6px] border border-dashed border-heading/25 bg-paper/60 p-6">
                <p className="eyebrow text-accent">Full message</p>
                <p className="mt-2 text-[15px] leading-relaxed text-fg/70">
                  The complete Director's Message will be published here once NADI shares the approved text. The excerpts above are quoted verbatim from the Annual Report 2025–2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* G2 · Founders */}
      <section id="founders" aria-labelledby="founders-title" className="bg-navy-deep pb-24 pt-24 text-ivory sm:pt-32 lg:pb-32 lg:pt-40">
        <div className="frame">
          <Eyebrow className="text-[#BFD6EC]">Founders</Eyebrow>
          <h2 id="founders-title" data-reveal-lines className="display mt-6 text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9]">
            <span className="block overflow-hidden pb-[0.05em]"><span data-line className="block">Meet the</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-line className="accent block text-[#BFD6EC]">founders.</span></span>
          </h2>
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 lg:mt-20 lg:gap-x-10">
            {[L.director, ...L.cofounders].map((p, i) => (
              <li key={p.name} className={`ab-founder ${i === 0 ? 'col-span-2 sm:col-span-1' : i === 1 ? 'sm:mt-16' : 'sm:mt-32'}`}>
                <figure className="group">
                  <div className="ab-founder-photo aspect-[4/5] overflow-hidden rounded-[6px] bg-navy">
                    <Img photo={p.photo} sizes="(min-width:640px) 30vw, 92vw" className="object-top grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0" />
                  </div>
                  <figcaption className="mt-5 border-t border-ivory/30 pt-4">
                    <p className="font-display text-[clamp(1.15rem,2.4vw,2.2rem)] font-bold leading-tight tracking-[-0.04em]">{p.name}</p>
                    <p className="eyebrow mt-2 text-[#BFD6EC]">{p.role}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-14 text-[12.5px] text-ivory/45">Names and roles as published in the NADI Foundation Annual Report 2025–2026.</p>
        </div>
      </section>

      {/* H · Annual reports & publications */}
      <AnnualReportsSection />

      {/* I · Closing CTA */}
      <section aria-labelledby="cta-title" className="relative overflow-hidden bg-blue pb-24 pt-24 text-ivory sm:pt-32 lg:pb-32 lg:pt-40">
        <div className="frame grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 id="cta-title" data-reveal-lines className="display text-[clamp(2.8rem,7.4vw,7.6rem)] leading-[0.88] lg:col-span-9">
            <span className="block overflow-hidden pb-[0.05em]"><span data-line className="block">Be part of a</span></span>
            <span className="block overflow-hidden pb-[0.05em]"><span data-line className="block">more inclusive</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-line className="accent block text-[#CFE2F4]">future.</span></span>
          </h2>
          <div data-reveal className="lg:col-span-3">
            <p className="text-[15.5px] leading-relaxed text-ivory/80">Support NADI's work in mental health, education and community development. NADI Foundation is 12A &amp; 80G certified.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PillLink to="/donate" variant="ivory">Donate</PillLink>
              <PillLink href={`mailto:${contact.email}`} variant="ghost">Contact us</PillLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
