export default function SectionHead({ label, className = '' }) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      <span className="h-2 w-2 bg-current" aria-hidden="true" />
      {label}
    </p>
  )
}