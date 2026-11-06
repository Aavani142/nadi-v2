import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const v = {
  yellow: 'bg-nadi-yellow text-ink hover:bg-cream',
  cream: 'bg-cream text-ink hover:bg-nadi-yellow',
  ink: 'bg-ink text-cream hover:bg-nadi-deep',
  outline: 'border border-cream/40 text-cream hover:bg-cream hover:text-ink',
}
export default function Button({ to, href, variant = 'yellow', children, className = '', ...rest }) {
  const cls = `group inline-flex min-h-[52px] items-center gap-3 px-6 py-3 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${v[variant]} ${className}`
  const inner = (<><span>{children}</span><ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" /></>)
  return to ? <Link to={to} className={cls} {...rest}>{inner}</Link> : <a href={href} className={cls} {...rest}>{inner}</a>
}
