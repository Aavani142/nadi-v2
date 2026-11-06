import { Download } from 'lucide-react'
import ReportPreview from './ReportPreview.jsx'

const fmt = (iso) => (iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null)

/** One report in the library: cover, title, period, description, publication date, PDF download. */
export default function ReportCard({ report }) {
  return (
    <article className="rp-card group grid gap-6 border-t border-fg/15 pt-6 sm:grid-cols-[10rem_1fr]">
      <ReportPreview report={report} className="aspect-[3/4] w-40 transition-transform duration-700 ease-out group-hover:-translate-y-1.5" />
      <div className="flex flex-col">
        <p className="eyebrow text-accent">{report.type} · {report.year}</p>
        <h3 className="mt-3 font-display text-[1.7rem] font-bold leading-tight tracking-[-0.03em] text-heading">{report.title}</h3>
        {report.description && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-fg/70">{report.description}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
          <a href={report.pdf} download target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-navy-deep px-5 text-[14px] font-semibold text-ivory transition-colors hover:bg-blue">
            <Download size={16} aria-hidden="true" /> Download PDF
          </a>
          {fmt(report.publishedOn) && <p className="text-[13px] text-fg/55">Published {fmt(report.publishedOn)}</p>}
        </div>
      </div>
    </article>
  )
}
