import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** Desktop-only follower ring that swells over links and buttons. */
export default function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 450, damping: 38, mass: 0.4 }), sy = useSpring(y, { stiffness: 450, damping: 38, mass: 0.4 })
  const [hover, setHover] = useState(false)
  const [fine, setFine] = useState(false)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setFine(true)
    const mv = (e) => { x.set(e.clientX); y.set(e.clientY); setHover(!!e.target.closest?.('a,button,[data-cursor]')) }
    window.addEventListener('mousemove', mv)
    return () => window.removeEventListener('mousemove', mv)
  }, [x, y])
  if (!fine) return null
  return (
    <motion.div aria-hidden="true" style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[95] -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-white mix-blend-difference"
      animate={{ scale: hover ? 1.8 : 1, backgroundColor: hover ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)' }} transition={{ duration: 0.25 }} />
  )
}
