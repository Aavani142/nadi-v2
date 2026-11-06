import { logos } from '../../data/nadi.js'

/**
 * Report cover. Uses the supplied cover image; without one, renders a typographic NADI cover
 * from the report's own title and year (a design treatment — it never implies extra content).
 */
export default function ReportPreview({ report, className = '' }) {
  if (report.cover) {
    return (
      <div className={`overflow-hidden rounded-[4px] bg-surface ${className}`}>
        <img src={report.cover} alt={`Cover of ${report.title}`} loading="lazy" className="h-full w-full object-cover" />
      </div>
    )
  }
  return (
    <div aria-hidden="true" className={`relative flex flex-col justify-between overflow-hidden rounded-[4px] bg-navy-deep p-5 text-ivory ${className}`}>
      <img src={logos.onDark} alt="" className="h-7 w-auto self-start" />
      <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-10 w-full opacity-40">
        <path d="M0 20 C 40 4, 80 4, 100 20 S 160 36, 200 20" fill="none" stroke="#2A86C6" strokeWidth="1.5" />
      </svg>
      <div>
        <p className="eyebrow text-[#BFD6EC]">{report.type}</p>
        <p className="display mt-2 text-[1.7rem] leading-[0.95]">{report.year}</p>
      </div>
    </div>
  )
}
