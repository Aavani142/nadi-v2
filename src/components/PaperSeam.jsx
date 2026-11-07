/**
 * A cut-paper ridgeline between two homepage sections — the landing's layered hills, carried down the
 * page. The section below rises over the one above as torn-paper hills (a fainter ridge behind, the
 * solid one in front), with fibre grain and a soft shadow cast upward. Some seams carry a palm.
 *
 * It lives *between* sections (most of them clip their overflow), as a zero-height row whose drawing
 * hangs upward over the bottom padding of the section above.
 */

/** Gentle hills from a seed: a few slow sines, so every seam has its own skyline. */
function ridge(seed, lo, hi) {
  const n = 48, pts = []
  for (let i = 0; i <= n; i++) {
    const x = (1600 * i) / n
    const t = x / 1600
    const v = 0.5 + 0.28 * Math.sin(t * 6.3 * (1 + (seed % 3) * 0.35) + seed) + 0.16 * Math.sin(t * 15.7 + seed * 2.1) + 0.06 * Math.sin(t * 41 + seed)
    pts.push([x, lo + (hi - lo) * (1 - v)])
  }
  let d = `M-60 110 L-60 ${pts[0][1].toFixed(1)} L${pts[0][0]} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]
    d += ` Q${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`
  }
  return { d: `${d} L1600 ${pts.at(-1)[1].toFixed(1)} L1660 ${pts.at(-1)[1].toFixed(1)} L1660 110 Z`, at: (x) => pts[Math.round((x / 1600) * n)][1] }
}

function Palm({ x, y, h, c }) {
  const tx = x + h * 0.2, ty = y - h
  return (
    <g fill={c} className="max-sm:hidden">
      <path d={`M${x - 1.6} ${y} Q${x + h * 0.04} ${y - h * 0.55} ${tx - 0.8} ${ty} L${tx + 0.8} ${ty} Q${x + h * 0.04 + 3} ${y - h * 0.55} ${x + 1.8} ${y} Z`} />
      {[-165, -130, -95, -60, -25, 5].map((a, i) => {
        const r = (a * Math.PI) / 180, L = h * (0.42 + (i % 2) * 0.1)
        const ex = tx + Math.cos(r) * L, ey = ty + Math.sin(r) * L + h * 0.16
        const mx = tx + Math.cos(r) * L * 0.5, my = ty + Math.sin(r) * L * 0.5 - 2
        const nx = -Math.sin(r) * 3, ny = Math.cos(r) * 3
        return <path key={i} d={`M${tx} ${ty} Q${mx + nx} ${my + ny} ${ex} ${ey} Q${mx} ${my - 1} ${tx} ${ty} Z`} />
      })}
    </g>
  )
}

/** One shared filter for every seam (cut edge and upward shadow — the site-wide grain supplies the fibre). Render once on the page. */
export function SeamDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="seam-paper" x="-2%" y="-60%" width="104%" height="180%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="torn" />
        <feDropShadow in="torn" dx="0" dy="-3" stdDeviation="4" floodColor="#1c140c" floodOpacity="0.18" />
      </filter>
    </svg>
  )
}

/**
 * @param to    colour of the section below (the paper that rises)
 * @param seed  varies the skyline
 * @param palms x positions (0–1600) for palm silhouettes on the back ridge
 */
export default function PaperSeam({ to, seed = 1, palms = [] }) {
  const back = ridge(seed + 7, 6, 40), front = ridge(seed, 26, 58)
  return (
    <div aria-hidden="true" className="pointer-events-none relative z-20 h-0">
      <svg viewBox="0 0 1600 80" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-[3px] h-[clamp(34px,4.6vw,72px)] w-full overflow-visible">
        <clipPath id={`seam-clip-${seed}`}><rect x="-200" y="-200" width="2000" height="280" /></clipPath>
        <g clipPath={`url(#seam-clip-${seed})`}><g filter="url(#seam-paper)">
          <path d={back.d} fill={to} opacity="0.5" />
          <path d={front.d} fill={to} />
        </g></g>
      </svg>
    </div>
  )
}
