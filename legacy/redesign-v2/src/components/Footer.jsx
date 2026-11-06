import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { contact, donateLink, nav, org, ctas } from '../data/nadi.js'
import { useGoToSection } from '../lib/nav.js'
import { gsap, useGsap } from '../lib/motion.js'

export default function Footer() {
  const root = useRef(null)
  const goTo = useGoToSection()

  useGsap(root, () => {
    gsap.from('.footer-mark span', {
      yPercent: 100, stagger: 0.06, duration: 1.6,
      scrollTrigger: { trigger: '.footer-mark', start: 'top 95%' },
    })
  })

  const reg = org.facts.filter((f) => ['Registration', 'NGO Darpan', 'Certification', 'Tax status'].includes(f.k))

  return (
    <footer ref={root} className="grain relative overflow-hidden bg-ink text-paper">
      <div className="frame grid gap-14 pb-16 pt-24 sm:pt-28 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="display text-5xl uppercase sm:text-6xl">Say <span className="italic-serif normal-case text-river-light">hello.</span></p>
          <a href={`mailto:${contact.email}`} className="mt-6 block break-all text-xl font-medium text-paper/90 underline decoration-paper/25 underline-offset-[6px] transition-colors hover:decoration-paper sm:text-2xl">
            {contact.email}
          </a>
          <a href={`tel:+91${contact.phone}`} className="mt-2 block text-xl font-medium text-paper/90 sm:text-2xl">{contact.phoneDisplay}</a>
          <address className="mt-8 not-italic leading-relaxed text-paper/55">
            {contact.address.map((l) => <span key={l} className="block">{l}</span>)}
          </address>
          <a href={contact.maps} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">Open in Maps</a>
        </div>

        <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
          <p className="kicker text-paper/40">Explore</p>
          <ul className="mt-5 space-y-2.5">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`/#${n.section}`} onClick={(e) => { e.preventDefault(); goTo(n.section) }} className="text-paper/80 transition-colors hover:text-paper">{n.label}</a>
              </li>
            ))}
            <li><Link to={donateLink.path} className="font-semibold text-ember">Donate</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="kicker text-paper/40">Follow</p>
          <ul className="mt-5 space-y-2.5">
            {contact.socials.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer" className="text-paper/80 transition-colors hover:text-paper">{s.handle}</a></li>
            ))}
            <li><a href={ctas.partner.href} className="text-paper/80 transition-colors hover:text-paper">Partner with us</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="kicker text-paper/40">Registered</p>
          <dl className="mt-5 space-y-3 text-sm text-paper/60">
            {reg.map((f) => (
              <div key={f.k}><dt className="sr-only">{f.k}</dt><dd>{f.v}</dd></div>
            ))}
          </dl>
        </div>
      </div>

      <div className="frame flex flex-wrap items-center justify-between gap-4 border-t border-paper/10 py-6 text-sm text-paper/45">
        <p>© {new Date().getFullYear()} NADI Foundation, Thiruvananthapuram.</p>
        <button type="button" onClick={() => goTo('top')} className="group flex items-center gap-2 hover:text-paper">
          Back to top <ArrowUp aria-hidden className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:-translate-y-1" />
        </button>
      </div>

      <p aria-hidden className="footer-mark display -mb-[0.16em] flex justify-center overflow-hidden text-[39vw] uppercase leading-[0.8] text-paper/[0.07] select-none">
        {'NADI'.split('').map((c, i) => <span key={i} className="inline-block">{c}</span>)}
      </p>
    </footer>
  )
}
