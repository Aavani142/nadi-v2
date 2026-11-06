import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { contact, ctas, donation, frameworks, initiatives, org, photos } from '../data/nadi.js'
import { EXPO, gsap, useGsap } from '../lib/motion.js'
import { Button, Img, Kicker, SplitWords, TextLink } from '../components/ui.jsx'

const giveMail = `mailto:${contact.email}?subject=${encodeURIComponent('Donation to NADI Foundation')}&body=${encodeURIComponent(
  "Hello NADI team,\n\nI would like to make a donation to NADI Foundation. Please share the bank / UPI details and the 80G receipt process.\n\nName:\nPhone:\nPAN (for the 80G receipt):\nInitiative I'd like to support (optional):\n",
)}`

const WHERE = [
  { name: initiatives.kappiness.name, what: 'Counselling, therapy and stigma-free mental health spaces.' },
  { name: initiatives.prabodhini.name, what: 'Libraries, mentorship and after-school learning for tribal children in Amboori.' },
  { name: initiatives.yfa.name, what: 'Field research, campaigns and leadership training for young volunteers.' },
  { name: initiatives.ekatva.name, what: 'Certified skills training and psychosocial support for transgender persons.' },
  { name: initiatives.navajeevana.name, what: 'Youth-led community health and resilience support for caregivers and ASHA workers in Wayanad.' },
]

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 1.1, ease: EXPO, delay: d },
})

export default function Donate() {
  const root = useRef(null)
  useEffect(() => { document.title = 'Donate — NADI Foundation' }, [])

  useGsap(root, () => {
    gsap.from('.d-hero .w-in', { yPercent: 115, rotate: 3, stagger: 0.07, duration: 1.5, delay: 0.4 })
    gsap.from('.d-fade', { y: 24, opacity: 0, stagger: 0.08, duration: 1.2, delay: 0.8 })
    gsap.fromTo('.d-photo', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut', delay: 0.5 })
    gsap.fromTo('.d-photo img', { scale: 1.3 }, { scale: 1, duration: 2.2, delay: 0.5 })
  })

  return (
    <div ref={root}>
      {/* Hero */}
      <section aria-labelledby="donate-title" className="pt-28 sm:pt-36">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="d-fade kicker text-ink/60">Donate · 12A &amp; 80G certified</p>
            <h1 id="donate-title" className="d-hero display mt-8 text-[16vw] uppercase sm:text-[11vw] lg:text-[8.4vw] min-[1520px]:text-[128px]">
              <SplitWords text="Back the" className="block" />
              <span className="line-mask block"><span className="w-in italic-serif inline-block normal-case text-river">next wave</span></span>
              <SplitWords text="of change." className="block" />
            </h1>
            <p className="d-fade mt-8 max-w-lg text-lg leading-relaxed text-ink/75">
              Every rupee goes into grassroots work run by young people — and every donation to NADI Foundation is eligible for tax benefits under Section 80G.
            </p>
            <div className="d-fade mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              {donation.url
                ? <Button href={donation.url} variant="ember" size="lg">Give online</Button>
                : <Button href={giveMail} variant="ember" size="lg">Donate by email</Button>}
              <TextLink href={`tel:+91${contact.phone}`}>Or call {contact.phoneDisplay}</TextLink>
            </div>
          </div>
          <figure className="d-photo overflow-hidden rounded-[6px] lg:col-span-5">
            <Img photo={photos.learningPlay} eager sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/5]" />
          </figure>
        </div>
      </section>

      {/* Where it goes */}
      <section aria-labelledby="where-title" className="py-28 sm:py-36">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker n="01" className="text-ink/60">Where it goes</Kicker>
            <h2 id="where-title" className="display mt-8 text-6xl uppercase sm:text-7xl">Five <span className="italic-serif normal-case text-river">initiatives</span></h2>
          </div>
          <ol className="lg:col-span-8">
            {WHERE.map((w, i) => (
              <motion.li key={w.name} {...fade(i * 0.05)} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-ink/15 py-6 last:border-b sm:grid-cols-[3rem_14rem_1fr] sm:gap-6 sm:py-8">
                <span className="kicker tabular pt-2 text-ink/40">0{i + 1}</span>
                <span className="display text-4xl uppercase sm:text-5xl">{w.name}</span>
                <span className="col-start-2 leading-relaxed text-ink/70 sm:col-start-3 sm:pt-2">{w.what}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* How to give */}
      <section aria-labelledby="how-title" className="grain bg-ink py-28 text-paper sm:py-36">
        <div className="frame">
          <Kicker n="02" className="text-paper/60">How to give</Kicker>
          <h2 id="how-title" className="display mt-8 max-w-[14ch] text-[13vw] uppercase sm:text-[8vw] lg:text-[6.4vw] min-[1520px]:text-[98px]">
            Three ways to <span className="italic-serif normal-case text-river-light">reach us.</span>
          </h2>
          <div className="mt-16 grid gap-px border-y border-paper/15 md:grid-cols-3">
            {[
              { icon: Mail, k: 'Write', v: contact.email, href: giveMail, note: 'We reply with bank / UPI details and issue your 80G receipt.' },
              { icon: Phone, k: 'Call', v: contact.phoneDisplay, href: `tel:+91${contact.phone}`, note: 'Talk to the team about a one-time or recurring gift.' },
              { icon: MapPin, k: 'Visit', v: 'Vazhuthacaud, Thiruvananthapuram', href: contact.maps, note: contact.address.join(' ') },
            ].map((c, i) => (
              <motion.a
                key={c.k}
                href={c.href}
                {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                {...fade(i * 0.08)}
                className="group flex flex-col gap-10 py-10 md:px-8 md:first:pl-0 md:[&:not(:first-child)]:border-l md:border-paper/15"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-paper/20 transition-colors duration-500 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                  <c.icon aria-hidden className="h-5 w-5" />
                </span>
                <span>
                  <span className="kicker block text-paper/50">{c.k}</span>
                  <span className="mt-2 block break-words text-2xl font-semibold tracking-[-0.02em]">{c.v}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-paper/55">{c.note}</span>
                </span>
              </motion.a>
            ))}
          </div>
          {donation.upi && (
            <p className="mt-10 text-paper/70">UPI: <span className="font-mono text-paper">{donation.upi}</span></p>
          )}
        </div>
      </section>

      {/* 100 Rupees Challenge */}
      <section aria-labelledby="hundred-title" className="py-28 sm:py-36">
        <div className="frame grid items-center gap-12 lg:grid-cols-12">
          <motion.p {...fade()} id="hundred-title" className="display text-[34vw] leading-[0.8] text-river lg:col-span-6 lg:text-[19vw] min-[1520px]:text-[290px]">
            ₹100
          </motion.p>
          <motion.div {...fade(0.1)} className="lg:col-span-5 lg:col-start-8">
            <p className="kicker text-ink/50">Prabodhini · The 100 Rupees Challenge</p>
            <p className="mt-5 text-3xl font-medium leading-snug tracking-[-0.02em]">Small gifts build real libraries.</p>
            <p className="mt-5 leading-relaxed text-ink/70">
              Prabodhini’s 100 Rupees Challenge pools small contributions to build library resources for children in tribal communities of Amboori Panchayat.
            </p>
            <div className="mt-8"><Button href={giveMail} variant="ink">Take the challenge</Button></div>
          </motion.div>
        </div>
      </section>

      {/* Other ways */}
      <section aria-labelledby="other-title" className="border-t border-ink/15 bg-paper-dim py-28 sm:py-36">
        <div className="frame">
          <Kicker n="03" className="text-ink/60">Other ways to help</Kicker>
          <h2 id="other-title" className="display mt-8 text-[12vw] uppercase sm:text-7xl">Give time. <span className="italic-serif normal-case text-river">Or a platform.</span></h2>
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {frameworks.slice(0, 3).map((f, i) => (
              <motion.li key={f.k} {...fade(i * 0.08)} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-[6px]">
                  <Img photo={f.photo} sizes="(min-width: 768px) 30vw, 100vw" className="h-full w-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-[1.05]" />
                </div>
                <p className="kicker mt-5 text-ink/50">{f.for}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{f.k}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{f.text}</p>
                <TextLink href={ctas[f.cta].href} className="mt-4">{ctas[f.cta].label}</TextLink>
              </motion.li>
            ))}
          </ul>
          <p className="mt-16 max-w-2xl text-sm leading-relaxed text-ink/55">
            NADI Foundation is registered under the Societies Registration Act, 1860 ({org.facts.find((f) => f.k === 'Registration').v.split('· ')[1]}), listed on NGO Darpan ({org.facts.find((f) => f.k === 'NGO Darpan').v}), ISO 9001:2015 certified, and holds 12A &amp; 80G certification.
          </p>
        </div>
      </section>
    </div>
  )
}
