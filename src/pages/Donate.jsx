import { useEffect, useRef } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { contact, ctas, donation, focusAreas, frameworks, photos } from '../data/nadi.js'
import { gsap, revealIn, useGsap } from '../lib/gsap.js'
import { Img, PillLink } from '../components/ui.jsx'

const giveMail = `mailto:${contact.email}?subject=${encodeURIComponent('Donation to NADI Foundation')}&body=${encodeURIComponent(
  "Hello NADI team,\n\nI would like to donate to NADI Foundation. Please share how I can contribute.\n\nName:\nPhone number (required):\nArea I'd like to support (optional):\n",
)}`

/**
 * Donate. No official donation page, payment link or bank details were available, so this page
 * routes donors to NADI's office. Set `donation.url` / `donation.upi` in data/nadi.js and the
 * online options appear automatically. No payment is processed on this site.
 */
export default function Donate() {
  const ref = useRef(null)
  useEffect(() => { document.title = 'Donate — NADI Foundation' }, [])
  useGsap(ref, () => {
    gsap.timeline({ delay: 0.15 })
      .from('.dn-word', { yPercent: 110, duration: 1.4, stagger: 0.08 })
      .fromTo('.dn-photo', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0.3)
      .fromTo('.dn-photo img', { scale: 1.3 }, { scale: 1, duration: 2.2 }, 0.3)
      .from('.dn-fade', { y: 20, opacity: 0, duration: 1, stagger: 0.1 }, 0.8)
    revealIn(ref.current)
  })

  const ways = [
    { icon: Mail, k: 'Write to us', v: contact.email, href: giveMail, note: 'Tell us how you would like to give — we will reply with the details.' },
    { icon: Phone, k: 'Call the office', v: contact.phoneDisplay, href: `tel:+91${contact.phone}`, note: 'Talk to the team about supporting a programme.' },
    { icon: MapPin, k: 'Visit', v: 'Vazhuthacaud, Thiruvananthapuram', href: contact.maps, note: contact.address.join(' ') },
  ]

  return (
    <main id="main" ref={ref}>
      <section className="relative overflow-hidden bg-navy-deep pb-20 pt-32 text-ivory sm:pt-40 lg:pb-28">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="dn-fade eyebrow flex items-center gap-3 text-[#BFD6EC]"><span aria-hidden="true" className="h-px w-8 bg-current" />Donate</p>
            <h1 className="display mt-6 text-[clamp(3rem,8.4vw,8.6rem)] leading-[0.86] tracking-[-0.05em]">
              {['Support', 'the next wave', 'of change.'].map((w, i) => (
                <span key={w} className={`block overflow-hidden pb-[0.05em] ${i === 1 ? 'accent font-normal text-[#BFD6EC]' : ''}`}><span className="dn-word block">{w}</span></span>
              ))}
            </h1>
            <p className="dn-fade mt-8 max-w-xl text-[17px] leading-relaxed text-ivory/80">
              Your support helps young people at NADI Foundation take on mental health, education and community development across Kerala. NADI Foundation is 12A &amp; 80G certified.
            </p>
            <div className="dn-fade mt-8 flex flex-wrap gap-3">
              {donation.url
                ? <PillLink href={donation.url} external variant="ivory">Donate online</PillLink>
                : <PillLink href={giveMail} variant="ivory">Donate by email</PillLink>}
              <PillLink href={`tel:+91${contact.phone}`} variant="ghost">Call {contact.phoneDisplay}</PillLink>
            </div>
            {!donation.url && (
              <p className="dn-fade mt-6 max-w-xl text-[13px] leading-relaxed text-ivory/55">
                Online donations are not yet available on this website. Please contact the NADI office to donate — the team will share how to give.
              </p>
            )}
            {donation.upi && <p className="dn-fade mt-4 text-[15px]">UPI: <span className="font-mono">{donation.upi}</span></p>}
          </div>
          <div className="dn-photo aspect-[4/5] overflow-hidden rounded-[6px] lg:col-span-5">
            <Img photo={photos.learningPlay} sizes="(min-width:1024px) 40vw, 92vw" priority />
          </div>
        </div>
      </section>

      <section aria-labelledby="where-title" className="g-ivory pb-24 pt-24 sm:pt-32 lg:pb-32">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow flex items-center gap-3 text-accent"><span aria-hidden="true" className="h-px w-8 bg-current" />Where support goes</p>
            <h2 id="where-title" data-reveal-lines className="display mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.92] text-heading">
              <span className="block overflow-hidden pb-[0.05em]"><span data-line className="block">Three core</span></span>
              <span className="block overflow-hidden pb-[0.08em]"><span data-line className="accent block text-accent">areas.</span></span>
            </h2>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {focusAreas.map((a) => (
              <li key={a.id} data-reveal className="grid grid-cols-[3rem_1fr] border-t border-heading/15 py-7 last:border-b">
                <span className="text-[12px] font-semibold tabular-nums text-accent">{a.n}</span>
                <div>
                  <h3 className="font-display text-[1.7rem] font-bold leading-tight tracking-[-0.03em] text-heading">{a.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-fg/70">{a.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="how-title" className="bg-navy pb-24 pt-24 text-ivory sm:pt-32 lg:pb-32">
        <div className="frame">
          <p className="eyebrow flex items-center gap-3 text-[#BFD6EC]"><span aria-hidden="true" className="h-px w-8 bg-current" />How to give</p>
          <h2 id="how-title" data-reveal-lines className="display mt-6 text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.92]">
            <span className="block overflow-hidden pb-[0.05em]"><span data-line className="block">Reach the</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-line className="accent block text-[#BFD6EC]">NADI office.</span></span>
          </h2>
          <div className="mt-14 grid border-y border-white/15 md:grid-cols-3">
            {ways.map((w, i) => (
              <a key={w.k} href={w.href} data-reveal data-delay={i * 0.08} {...(w.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex min-w-0 flex-col gap-8 border-b border-white/15 py-10 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:[&:not(:first-child)]:border-l">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/25 transition-colors duration-500 group-hover:bg-ivory group-hover:text-navy-deep"><w.icon size={18} aria-hidden="true" /></span>
                <span>
                  <span className="eyebrow block text-ivory/75">{w.k}</span>
                  <span className="mt-2 block break-all text-[clamp(1.15rem,5.4vw,1.4rem)] font-semibold tracking-[-0.02em] sm:break-words">{w.v}</span>
                  <span className="mt-3 block text-[14px] leading-relaxed text-ivory/75">{w.note}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="other-title" className="relative overflow-hidden bg-blue pb-24 pt-24 text-ivory sm:pt-32 lg:pb-32">
        <div className="frame">
          <p className="eyebrow flex items-center gap-3 text-[#CFE2F4]"><span aria-hidden="true" className="h-px w-8 bg-current" />Other ways to help</p>
          <h2 id="other-title" className="display mt-6 text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.92]">Give time. <span className="accent font-normal text-[#CFE2F4]">Or a platform.</span></h2>
          <ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            {frameworks.slice(0, 3).map((f, i) => (
              <li key={f.k} data-reveal data-delay={i * 0.08} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-[6px]"><Img photo={f.photo} sizes="(min-width:768px) 30vw, 92vw" className="transition-transform duration-1000 ease-out group-hover:scale-[1.05]" /></div>
                <p className="eyebrow mt-5 text-[#CFE2F4]">{f.for}</p>
                <h3 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em]">{f.k}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ivory/75">{f.text}</p>
                <a href={ctas[f.cta].href} className="mt-2 inline-flex min-h-[44px] items-center text-[14px] font-semibold underline decoration-ivory/40 underline-offset-4">{ctas[f.cta].label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
