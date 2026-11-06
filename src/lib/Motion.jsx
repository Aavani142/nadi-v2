import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'

export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px 0px' }} transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </M>
  )
}

/** Word-by-word masked reveal. `accent` words get serif-italic treatment.
 *  The in-view trigger lives on the (unclipped) wrapper, so it always fires. */
export function SplitWords({ text, className = '', delay = 0, as: Tag = 'h2', accent = '', accentClass = 'font-serif font-normal italic' }) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} aria-hidden="true" className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px 0px' }}>
          <motion.span className={`inline-block ${accent && w.startsWith(accent) ? accentClass : ''}`}
            variants={{ hidden: { y: '115%' }, show: { y: 0, transition: { duration: 0.75, delay: delay + i * 0.06, ease: [0.2, 0.7, 0.2, 1] } } }}>
            {w}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  )
}

function Word({ w, i, n, prog }) {
  const o = useTransform(prog, [i / n, (i + 1) / n], [0.32, 1])
  return <motion.span style={{ opacity: o }} className="mr-[0.25em] inline-block">{w}</motion.span>
}
/** Text that lights up word-by-word as you scroll. */
export function WordsOnScroll({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return <p ref={ref} className={className}>{words.map((w, i) => <Word key={i} w={w} i={i} n={words.length} prog={scrollYProgress} />)}</p>
}

export function Parallax({ children, offset = 60, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">{children}</motion.div>
    </div>
  )
}

/** Masked image reveal with a slow inner zoom. */
// The in-view trigger must sit on an UNCLIPPED wrapper: Chrome's IntersectionObserver measures a target
// after its own clip-path, so a fully clipped element can never register as visible.
export function ImageReveal({ children, className = '', delay = 0, from = 'bottom' }) {
  const hidden = { bottom: 'inset(100% 0% 0% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)' }[from]
  return (
    <motion.div className={`${/\b(absolute|fixed|sticky)\b/.test(className) ? '' : 'relative'} ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>
      <motion.div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}
        variants={{ hidden: { clipPath: hidden }, show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] } } }}>
        <motion.div className="h-full w-full"
          variants={{ hidden: { scale: 1.22 }, show: { scale: 1, transition: { duration: 1.7, delay, ease: [0.22, 1, 0.36, 1] } } }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/** Element gently pulled toward the cursor. */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 16 }), y = useSpring(my, { stiffness: 220, damping: 16 })
  return (
    <motion.div ref={ref} style={{ x, y }} className={`inline-block ${className}`}
      onMouseMove={(e) => { const r = ref.current.getBoundingClientRect(); mx.set((e.clientX - r.left - r.width / 2) * strength); my.set((e.clientY - r.top - r.height / 2) * strength) }}
      onMouseLeave={() => { mx.set(0); my.set(0) }}>
      {children}
    </motion.div>
  )
}

export function CountUp({ to, suffix = '', duration = 2.2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return }
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (l) => setV(Math.round(l)) })
    return () => c.stop()
  }, [inView, to, duration])
  return <span ref={ref}>{v.toLocaleString('en-US')}{suffix}</span>
}