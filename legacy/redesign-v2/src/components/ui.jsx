import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

/** Responsive photograph. `photo` = { src, srcSet?, alt } from data/nadi.js. */
export function Img({ photo, className = '', sizes = '100vw', eager = false, ...rest }) {
  return (
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={photo.srcSet ? sizes : undefined}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
      className={className}
      {...rest}
    />
  )
}

/** Label that rolls up to a copy of itself on hover. */
export function RollText({ children, className = '' }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-expo group-hover:translate-y-0">{children}</span>
    </span>
  )
}

/** Pulls its child gently toward the pointer. Pointer devices only; inert on touch. */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 })
  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }
  return (
    <motion.span ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.span>
  )
}

const VARIANTS = {
  ember: 'bg-ember text-ink hover:bg-ink hover:text-paper',
  ink: 'bg-ink text-paper hover:bg-river',
  paper: 'bg-paper text-ink hover:bg-ember',
  river: 'bg-river text-paper hover:bg-ink',
  ghostDark: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  ghostLight: 'border border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink',
}

/**
 * Pill button. Internal paths use the router; `href` is an external/mailto/tel link.
 * The arrow slides out and a copy slides in on hover.
 */
export function Button({ to, href, children, variant = 'ink', size = 'md', icon = true, className = '', magnetic = true, ...rest }) {
  const pad = size === 'lg' ? 'h-14 pl-7 pr-2 text-base sm:h-16 sm:pl-8 sm:text-lg' : 'h-12 pl-6 pr-1.5 text-[15px]'
  const dot = size === 'lg' ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-9 w-9'
  const cls = `group inline-flex items-center gap-4 rounded-full font-semibold tracking-[-0.01em] transition-colors duration-300 ${pad} ${VARIANTS[variant]} ${icon ? '' : 'pr-6'} ${className}`
  const inner = (
    <>
      <RollText>{children}</RollText>
      {icon && (
        <span className={`relative grid ${dot} place-items-center overflow-hidden rounded-full`}>
          <span className="absolute inset-0 rounded-full bg-current opacity-[0.12]" />
          <ArrowUpRight aria-hidden className="h-[18px] w-[18px] transition-transform duration-500 ease-expo group-hover:-translate-y-6 group-hover:translate-x-6" />
          <ArrowUpRight aria-hidden className="absolute h-[18px] w-[18px] -translate-x-6 translate-y-6 transition-transform duration-500 ease-expo group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      )}
    </>
  )
  const isExternal = href && /^https?:/.test(href)
  const el = to ? (
    <Link to={to} className={cls} {...rest}>{inner}</Link>
  ) : (
    <a href={href} className={cls} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})} {...rest}>{inner}</a>
  )
  return magnetic ? <Magnetic strength={0.25}>{el}</Magnetic> : el
}

/** Text link with an underline that wipes out and back in on hover. */
export function TextLink({ href, to, children, className = '', ...rest }) {
  const cls = `group relative inline-flex items-center gap-1.5 font-semibold ${className}`
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-current transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-0" />
      </span>
      <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  )
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  const isExternal = href && /^https?:/.test(href)
  return <a href={href} className={cls} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})} {...rest}>{inner}</a>
}

/** Section label, e.g. "01  About". */
export function Kicker({ n, children, className = '' }) {
  return (
    <p className={`kicker flex items-center gap-3 ${className}`}>
      {n && <span className="tabular opacity-50">{n}</span>}
      <span className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  )
}

/**
 * Splits a string into words, each inside an overflow mask, for GSAP line/word reveals.
 * Animate `.w-in` (e.g. yPercent 110 → 0). Screen readers get the plain sentence.
 */
export function SplitWords({ text, className = '', wordClass = '' }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(' ').map((w, i) => (
          <span key={i} className="line-mask inline-block align-top">
            <span className={`w-in inline-block ${wordClass}`}>{w}</span>
            {' '}
          </span>
        ))}
      </span>
    </span>
  )
}
