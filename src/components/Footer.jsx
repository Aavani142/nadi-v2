import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { logos, nav, navHref, org, contact, ctas } from '../data/nadi.js'
import { useAnchorClick } from '../lib/anchors.js'
import { PillLink } from './ui.jsx'

export default function Footer() {
  const onAnchor = useAnchorClick()
  const year = new Date().getFullYear()
  const col = 'eyebrow mb-5 text-mustard'
  const item = 'inline-flex min-h-[40px] items-center text-[15px] text-ivory/75 transition-colors hover:text-white'

  return (
    <footer className="relative bg-blue text-ivory">
      {/* every page ends on a NADI-blue section, so the footer's wave edge always rises out of that blue */}
      <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[60px] w-full sm:h-[100px]">
        <path d="M0 70 C 240 10, 420 10, 720 60 S 1200 120, 1440 40 V120 H0 Z" fill="#182C48" />
      </svg>
      <div className="relative -mt-px overflow-hidden bg-navy-deep pb-8">
        <div className="frame relative">
          <div className="grid gap-12 border-b border-white/10 pb-16 pt-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <a href="#top" onClick={(e) => onAnchor(e, '#top')} className="inline-block" aria-label="NADI Foundation — back to top">
                <img src={logos.onDark} alt="NADI Foundation" loading="lazy" className="h-16 w-auto sm:h-20" />
              </a>
              <p className="mt-8 max-w-md text-[15.5px] leading-relaxed text-ivory/75">{org.intro}</p>
              <dl className="mt-8 grid grid-cols-2 gap-6">
                <div><dt className="eyebrow text-mustard">Vision</dt><dd className="mt-2 font-display text-xl font-bold leading-snug tracking-[-0.02em]">{org.vision}</dd></div>
                <div><dt className="eyebrow text-mustard">Mission</dt><dd className="mt-2 font-display text-xl font-bold leading-snug tracking-[-0.02em]">{org.mission}</dd></div>
              </dl>
              <div className="mt-10 flex flex-wrap gap-3">
                <PillLink to="/donate" variant="ivory">Donate</PillLink>
                <PillLink href={ctas.volunteer.href} variant="ghost">{ctas.volunteer.label}</PillLink>
              </div>
            </div>

            <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-7">
              <p className={col}>Explore</p>
              <ul className="grid gap-0.5">
                {nav.map((n) => (
                  <li key={n.id}>
                    {n.page
                      ? <Link to={n.path} className={item}>{n.label}</Link>
                      : <a href={navHref(n)} onClick={(e) => onAnchor(e, navHref(n))} className={`${item} ${n.cta ? '!text-mustard' : ''}`}>{n.label}</a>}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-2">
              <p className={col}>Contact</p>
              <ul className="grid gap-0.5">
                <li><a href={`tel:+91${contact.phone}`} className={item}>{contact.phoneDisplay}</a></li>
                <li><a href={`mailto:${contact.email}`} className={`${item} break-all`}>{contact.email}</a></li>
                <li><a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className={item}>{contact.website}</a></li>
              </ul>
              <p className={`${col} mt-10`}>Follow</p>
              <ul className="grid gap-0.5">
                {contact.socials.map((s) => (
                  <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" className={item}>{s.label} · {s.handle}</a></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <p className={col}>Visit</p>
              <address className="text-[15px] not-italic leading-relaxed text-ivory/75">
                {contact.address.map((l) => <span key={l} className="block">{l}</span>)}
              </address>
              <a href={contact.maps} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-white">
                Open in Maps <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-10 font-display text-[clamp(1.6rem,3.4vw,3rem)] font-bold tracking-[-0.03em] text-white">
            Equity <span aria-hidden="true" className="text-blue-mist">·</span> Equality <span aria-hidden="true" className="text-blue-mist">·</span> <span className="accent font-normal text-blue-mist">Innovation</span>
          </p>
          <div className="flex flex-col gap-4 pt-8 text-[12.5px] text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} NADI Foundation · Reg. No. TVM/TC/668/2022 · NGO Darpan KL/2023/0345250 · ISO 9001:2015 · 12A &amp; 80G certified</p>
            <a href="#top" onClick={(e) => onAnchor(e, '#top')} className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-ivory/80 hover:text-white">
              Back to top <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
