import { useEffect, useRef, useState } from 'react'
import { FileText } from 'lucide-react'
import { getReports } from '../../data/reports.js'
import { contact } from '../../data/nadi.js'
import { gsap, revealIn, useGsap, ScrollTrigger } from '../../lib/gsap.js'
import ReportCard from './ReportCard.jsx'

/** Reports come through `getReports()` — swap it for a Supabase query later; the shape stays the same. */
function useReports() {
  const [state, setState] = useState({ reports: [], loading: true })
  useEffect(() => {
    let alive = true
    getReports().then((reports) => {
      if (!alive) return
      setState({ reports, loading: false })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    return () => { alive = false }
  }, [])
  return state
}

export default function AnnualReportsSection() {
  const ref = useRef(null)
  const { reports, loading } = useReports()
  useGsap(ref, () => {
    if (loading) return
    gsap.from('.rp-line', { yPercent: 110, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } })
    gsap.from('.rp-card, .rp-empty', { y: 50, opacity: 0, duration: 1.2, stagger: 0.12, scrollTrigger: { trigger: '.rp-list', start: 'top 85%', once: true } })
    revealIn(ref.current)
  }, [loading])

  const request = `mailto:${contact.email}?subject=${encodeURIComponent('Request: NADI Foundation annual report')}`

  return (
    <section id="reports" ref={ref} aria-labelledby="reports-title" className="g-ivory relative pb-28 pt-24 sm:pt-32 lg:pb-36 lg:pt-40">
      <div className="frame">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-accent"><span aria-hidden="true" className="h-px w-8 bg-current" />Transparency</p>
            <h2 id="reports-title" className="display mt-6 text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9] text-heading">
              <span className="block overflow-hidden pb-[0.05em]"><span className="rp-line block">Annual reports</span></span>
              <span className="block overflow-hidden pb-[0.08em]"><span className="rp-line accent block text-accent">&amp; publications.</span></span>
            </h2>
          </div>
          <p data-reveal className="text-[16.5px] leading-relaxed text-fg/75 lg:col-span-4 lg:col-start-9 lg:pb-3">
            Explore NADI Foundation's annual reports, programme updates and publications to understand our work, progress and commitment to transparency.
          </p>
        </div>

        <div className="rp-list mt-16 lg:mt-20">
          {loading ? null : reports.length ? (
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-12">
              {reports.map((r) => <ReportCard key={r.id} report={r} />)}
            </div>
          ) : (
            <div className="rp-empty grid gap-10 rounded-[6px] border border-dashed border-fg/25 px-6 py-12 sm:px-10 lg:grid-cols-12 lg:items-center lg:py-16">
              {/* an empty shelf: cover outlines, so the layout reads as a library awaiting its first report */}
              <div aria-hidden="true" className="flex items-end gap-3 lg:col-span-4">
                {[0, 1, 2].map((k) => (
                  <div key={k} className={`grid aspect-[3/4] w-[30%] max-w-[7.5rem] place-items-center rounded-[4px] border border-fg/15 bg-paper ${k === 1 ? 'mb-4' : ''}`}>
                    <FileText size={22} className="text-fg/25" />
                  </div>
                ))}
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1] text-heading">Annual reports will be published here as they become available.</p>
                <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-fg/70">
                  Each report will be listed with its reporting year, a short summary and a PDF download. To request a report in the meantime, write to the NADI office.
                </p>
                <a href={request} className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-fg/25 px-5 text-[14px] font-semibold text-heading transition-colors hover:border-accent hover:text-accent">
                  Request a report
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
