import { useEffect, useRef } from 'react'

/**
 * A living "river" of thousands of fine strokes (nadi = river) drawn on a 2D canvas.
 * It flows left → right through a shifting flow-field and swirls around the cursor / finger.
 * No libraries. Pauses off-screen and respects reduced-motion.
 */
export default function RiverCanvas({ className = '', density = 1, speed = 1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, parts = [], raf = 0, visible = true, t = 0
    const mouse = { x: -9999, y: -9999, active: false }

    const spawn = (anywhere) => ({
      x: anywhere ? Math.random() * w : -10, y: Math.random() * h, px: 0, py: 0,
      life: Math.random() * 300, b: Math.random() > 0.9 ? 2 : Math.random() > 0.55 ? 1 : 0,
    })
    const build = () => {
      const n = Math.floor(Math.min(2400, Math.max(450, (w * h) / 1000)) * density)
      parts = Array.from({ length: n }, () => spawn(true))
    }
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }
    const field = (x, y) =>
      (Math.sin(x * 0.0035 + t * 0.25) + Math.cos(y * 0.005 - t * 0.18) + Math.sin((x + y) * 0.0022 + t * 0.1)) * 0.55

    const colors = ['rgba(74,154,208,0.5)', 'rgba(127,192,234,0.6)', 'rgba(243,206,104,0.85)']
    const step = () => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.1)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      for (const p of parts) {
        const a = field(p.x, p.y)
        let vx = (Math.cos(a) * 1.1 + 1.0) * speed
        let vy = Math.sin(a) * 1.3 * speed
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy, R = 180
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1, f = 1 - d / R
            vx += (dx / d) * f * 3.4 + (-dy / d) * f * 2.6
            vy += (dy / d) * f * 3.4 + (dx / d) * f * 2.6
          }
        }
        p.px = p.x; p.py = p.y
        p.x += vx; p.y += vy; p.life++
        if (p.x > w + 10 || p.y < -10 || p.y > h + 10 || p.life > 420) { Object.assign(p, spawn(false)); p.px = p.x; p.py = p.y; p.life = 0 }
      }
      ctx.lineWidth = 1
      for (let k = 0; k < 3; k++) {
        ctx.beginPath()
        for (const p of parts) if (p.b === k) { ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y) }
        ctx.strokeStyle = colors[k]
        ctx.stroke()
      }
      t += 0.016
    }

    const loop = () => { raf = requestAnimationFrame(loop); if (visible && !document.hidden) step() }
    const move = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
      mouse.active = mouse.x > 0 && mouse.x < r.width && mouse.y > 0 && mouse.y < r.height
    }
    const leave = () => { mouse.active = false }

    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(canvas)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerleave', leave)
    if (reduce) { for (let i = 0; i < 160; i++) step() } else loop()

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerleave', leave)
    }
  }, [density, speed])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}