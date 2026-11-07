import { createContext, useContext } from 'react'

/**
 * The landing's world: a Kerala backwater at golden hour, made like cut paper — layered hills, coconut
 * palms, a river with a vallam (country boat), and NADI's people on the near bank: two flying kites,
 * a child pointing up, two students sitting in conversation, someone watching.
 *
 * Each depth is its own full-bleed <svg> (same viewBox, anchored bottom-right), so NadiHero can move
 * the layers independently for parallax as plain composited transforms; the paper filter (torn edge,
 * grain, a soft cast shadow) then renders once and is never re-run while things move. Only the kites
 * animate inside their SVG (NadiHero drives them via `driveKites`).
 */

export const VB = '0 0 1600 900'
const AR = 'xMaxYMax slice'
// Portrait screens (phones, upright tablets) frame the right of the scene — the kite flyers, the sun and
// the hills — a little wider and taller, so the people are a good size and nobody is cut off.
const VB_PORTRAIT = '1100 -60 500 960'
const AR_PORTRAIT = 'xMidYMax slice'
/** true on portrait screens; NadiHero provides it */
export const Portrait = createContext(false)

// ── palette: dusk over the backwaters, people in festival colour ─────────────
const P = {
  hillFar: '#7480A0', hillFar2: '#5E6C8E', land: '#4E6B5A', land2: '#41604F', palm: '#2C4838', palm2: '#3A5A45', trunk: '#4A3628',
  bank: '#7D7A3F', bank2: '#5D6131', grass: '#4B5724', grass2: '#6E7A34',
  coral: '#F2643D', saffron: '#F6A623', teal: '#14A39A', magenta: '#D6336C', indigo: '#4C5FD5', leaf: '#3BAA5C',
  mustard: '#E8B931', denim: '#2F4A73', charcoal: '#2B2B33', cream: '#F3E9DA', ink: '#1E1612', plum: '#7B3FA0',
}
const SKIN = ['#8D5524', '#A0673A', '#C68642', '#7A4A2A', '#B97A4F']

/** Shared defs — the paper filter and gradients — rendered once, referenced by every layer. */
export function SceneDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {/* cut paper: a slightly torn edge, fibre grain, and a soft shadow onto the layer below */}
        <filter id="rs-paper" x="-4%" y="-8%" width="108%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="6" xChannelSelector="R" yChannelSelector="G" result="torn" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="grain" />
          <feColorMatrix in="grain" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="g2">
            <feFuncR type="linear" slope="0.4" intercept="0.72" /><feFuncG type="linear" slope="0.4" intercept="0.72" />
            <feFuncB type="linear" slope="0.4" intercept="0.72" /><feFuncA type="linear" slope="0" intercept="1" />
          </feComponentTransfer>
          <feBlend in="torn" in2="g2" mode="multiply" result="tex" />
          <feComposite in="tex" in2="torn" operator="in" result="cut" />
          <feDropShadow in="cut" dx="0" dy="4" stdDeviation="4" floodColor="#1c140c" floodOpacity="0.32" />
        </filter>
        {/* the same, finer, for small things (people, kites, the boat) */}
        <filter id="rs-paper-s" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="grain" />
          <feColorMatrix in="grain" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="g2">
            <feFuncR type="linear" slope="0.35" intercept="0.76" /><feFuncG type="linear" slope="0.35" intercept="0.76" />
            <feFuncB type="linear" slope="0.35" intercept="0.76" /><feFuncA type="linear" slope="0" intercept="1" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="g2" mode="multiply" result="tex" />
          <feComposite in="tex" in2="SourceGraphic" operator="in" result="cut" />
          <feDropShadow in="cut" dx="0" dy="2" stdDeviation="1.5" floodColor="#1c140c" floodOpacity="0.35" />
        </filter>
        {/* long horizontal streaks for water */}
        <filter id="rs-streaks" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.003 0.08" numOctaves="2" seed="11" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.88  0 0 1.6 0 -0.82" />
        </filter>
        <linearGradient id="rs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C3557" /><stop offset="0.38" stopColor="#4F5F86" />
          <stop offset="0.62" stopColor="#C98A73" /><stop offset="0.78" stopColor="#F2B27E" /><stop offset="1" stopColor="#F7D3A0" />
        </linearGradient>
        <linearGradient id="rs-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B99AA6" /><stop offset="0.22" stopColor="#7F8FB0" />
          <stop offset="0.5" stopColor="#3F7290" /><stop offset="1" stopColor="#1F4A63" />
        </linearGradient>
        <linearGradient id="rs-bank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.bank} /><stop offset="1" stopColor={P.bank2} />
        </linearGradient>
        <radialGradient id="rs-sun">
          <stop offset="0" stopColor="#FFE2A8" /><stop offset="0.6" stopColor="#F7B36A" /><stop offset="1" stopColor="#F29A5A" />
        </radialGradient>
        <radialGradient id="rs-glow">
          <stop offset="0" stopColor="#FFD9A0" stopOpacity="0.55" /><stop offset="1" stopColor="#FFD9A0" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

const Layer = ({ children, className = '' }) => {
  const portrait = useContext(Portrait)
  return <svg viewBox={portrait ? VB_PORTRAIT : VB} preserveAspectRatio={portrait ? AR_PORTRAIT : AR} className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true">{children}</svg>
}

// ── sky ──────────────────────────────────────────────────────────────────────
export function Sky() {
  const cloud = (x, y, w, c, o) => (
    <path d={`M${x} ${y} C${x + w * 0.1} ${y - 22} ${x + w * 0.3} ${y - 26} ${x + w * 0.42} ${y - 12} C${x + w * 0.55} ${y - 34} ${x + w * 0.8} ${y - 28} ${x + w * 0.86} ${y - 8} C${x + w * 0.95} ${y - 10} ${x + w} ${y - 4} ${x + w} ${y} Z`} fill={c} opacity={o} />
  )
  return (
    <Layer>
      <rect y="-400" width="1600" height="1300" fill="url(#rs-sky)" />
      <circle cx="1240" cy="560" r="300" fill="url(#rs-glow)" />
      <g filter="url(#rs-paper)">
        <circle className="rs-sun" cx="1240" cy="560" r="92" fill="url(#rs-sun)" />
        {cloud(140, 300, 360, '#E9B9A0', 0.85)}
        {cloud(760, 220, 300, '#D9A5A0', 0.7)}
        {cloud(1330, 420, 260, '#F4C9A8', 0.9)}
        {cloud(980, 470, 200, '#F6D2B0', 0.8)}
      </g>
      <g stroke="#2a2433" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".65">
        <path d="M1010 300 q8 -8 16 0 q8 -8 16 0" /><path d="M1060 270 q6 -6 12 0 q6 -6 12 0" /><path d="M960 330 q5 -5 10 0 q5 -5 10 0" />
      </g>
    </Layer>
  )
}

// ── far hills ────────────────────────────────────────────────────────────────
export function FarHills() {
  return (
    <Layer>
      <g filter="url(#rs-paper)">
        <path d="M0 590 C110 540 220 506 340 530 S560 590 700 548 S900 480 1040 520 S1300 584 1420 540 S1560 500 1600 520 L1600 720 L0 720 Z" fill={P.hillFar} />
        <path d="M0 630 C160 600 300 586 460 606 S760 640 900 616 S1160 584 1320 606 S1520 630 1600 612 L1600 720 L0 720 Z" fill={P.hillFar2} />
      </g>
    </Layer>
  )
}

// ── banks with palms ─────────────────────────────────────────────────────────
function Palm({ x, y, h, lean = 0.25, s = 1, c = P.palm }) {
  const tx = x + h * lean, ty = y - h
  const leaves = [-170, -140, -112, -80, -52, -22, 6].map((a, i) => {
    const r = (a * Math.PI) / 180, L = (58 + (i % 3) * 10) * s
    const ex = tx + Math.cos(r) * L, ey = ty + Math.sin(r) * L + 22 * s
    const mx = tx + Math.cos(r) * L * 0.5, my = ty + Math.sin(r) * L * 0.5 - 6 * s
    const nx = -Math.sin(r) * 9 * s, ny = Math.cos(r) * 9 * s
    return <path key={i} d={`M${tx} ${ty} Q${mx + nx} ${my + ny} ${ex} ${ey} Q${mx - nx * 0.2} ${my - ny * 0.2 - 4} ${tx} ${ty} Z`} fill={i % 2 ? c : P.palm2} />
  })
  return (
    <g>
      <path d={`M${x - 4 * s} ${y} Q${x + h * lean * 0.2} ${y - h * 0.55} ${tx - 2 * s} ${ty} L${tx + 2 * s} ${ty} Q${x + h * lean * 0.2 + 7 * s} ${y - h * 0.55} ${x + 5 * s} ${y} Z`} fill={P.trunk} />
      {leaves}
      <circle cx={tx} cy={ty + 6 * s} r={5 * s} fill="#5a3f22" />
    </g>
  )
}

/** `front`: only the palm that stands in front of the name (the rest of the bank sits behind it). */
export function Banks({ front = false }) {
  if (front) return <Layer><g filter="url(#rs-paper-s)"><Palm x={360} y={638} h={200} lean={0.24} s={1.1} /></g></Layer>
  return (
    <Layer>
      <g filter="url(#rs-paper)">
        <path d="M0 650 C200 618 420 626 640 652 C760 666 860 670 968 668 L1000 700 L1000 900 L0 900 Z" fill={P.land} />
        <path d="M930 720 C980 680 1010 666 1050 662 C1200 640 1400 628 1600 636 L1600 900 L930 900 Z" fill={P.land2} />
      </g>
      <g filter="url(#rs-paper-s)">
        <Palm x={120} y={644} h={170} lean={0.18} />
        <Palm x={230} y={636} h={130} lean={-0.2} s={0.85} c={P.palm2} />
        <Palm x={520} y={646} h={150} lean={-0.12} s={0.9} />
        <Palm x={640} y={654} h={112} lean={0.3} s={0.75} c={P.palm2} />
        <Palm x={820} y={664} h={86} lean={-0.2} s={0.6} />
        <Palm x={1130} y={652} h={96} lean={0.22} s={0.62} />
        <Palm x={1250} y={642} h={140} lean={-0.18} s={0.85} c={P.palm2} />
        <Palm x={1380} y={636} h={190} lean={0.2} s={1.05} />
        <Palm x={1530} y={636} h={150} lean={-0.25} s={0.9} />
      </g>
    </Layer>
  )
}

// ── river ────────────────────────────────────────────────────────────────────
const RIVER = 'M968 666 C840 712 560 758 320 812 C180 846 60 872 -20 900 L760 900 C820 860 900 806 980 760 C1020 728 1050 690 1052 662 Z'

export function River() {
  return (
    <Layer>
      <clipPath id="rs-river-clip"><path d={RIVER} /></clipPath>
      <g filter="url(#rs-paper)"><path d={RIVER} fill="url(#rs-river)" /></g>
      <g clipPath="url(#rs-river-clip)">
        <rect x="0" y="640" width="1100" height="260" filter="url(#rs-streaks)" opacity=".55" />
        {/* the sun's path on the water */}
        
        <g className="rs-ripples" stroke="#FFE9C8" strokeLinecap="round" fill="none">
          {[[930, 684, 40], [760, 724, 60], [560, 770, 80], [860, 760, 50], [380, 820, 110], [640, 840, 90], [200, 868, 120], [500, 880, 70]].map(([x, y, w], i) => (
            <path key={i} className="rs-ripple" style={{ animationDelay: `${-i * 1.7}s` }} d={`M${x} ${y} q${w / 2} -5 ${w} 0`} strokeWidth={1.6 + i * 0.25} opacity=".7" />
          ))}
        </g>
      </g>
      {/* a vallam with its rower */}
      <g className="rs-boat" filter="url(#rs-paper-s)">
        <g transform="translate(610 806)"><g className="rs-rock">
          <path d="M-74 -10 Q-80 -22 -70 -24 Q-60 -4 0 -2 Q60 -4 70 -24 Q80 -22 74 -10 Q40 14 0 14 Q-40 14 -74 -10 Z" fill="#3B2617" />
          <path d="M-62 -8 Q0 4 62 -8" stroke="#6B4528" strokeWidth="3" fill="none" />
          <circle cx="6" cy="-40" r="7" fill={SKIN[3]} />
          <circle cx="4" cy="-43" r="7" fill={P.ink} />
          <path d="M-4 -32 L16 -32 L14 -6 L-2 -6 Z" fill={P.saffron} />
          <path d="M14 -26 L-30 30" stroke="#6B4528" strokeWidth="3" strokeLinecap="round" />
          <path d="M-30 30 l-8 10" stroke="#6B4528" strokeWidth="7" strokeLinecap="round" />
        </g></g>
      </g>
    </Layer>
  )
}

// ── people ───────────────────────────────────────────────────────────────────
const rad = (d) => (d * Math.PI) / 180
const A1 = 19, A2 = 18
function limb([sx, sy], [a, b]) {
  const e = [sx + A1 * Math.sin(rad(a)), sy + A1 * Math.cos(rad(a))]
  return { e, h: [e[0] + A2 * Math.sin(rad(a + b)), e[1] + A2 * Math.cos(rad(a + b))] }
}

/** Fig geometry, so kite strings can find the hand. */
export function handOf({ x, y, s = 1, face = 1, sit, arm }) {
  const lift = sit ? 26 : 0
  const { h } = limb([6, -84 + lift], arm)
  return [x + face * s * h[0], y + s * h[1]]
}

/**
 * A small paper figure seen from a distance, facing +x (face -1 mirrors). Feet at (x, y), ~100 units tall.
 */
function Fig({ x, y, s = 1, face = 1, skin = SKIN[1], hair = 'short', hairC = P.ink, top, bottom = P.denim, kurta, sit, kid, arm = [10, 8], back = [-8, 0], hold }) {
  const lift = sit ? 26 : 0
  const hr = kid ? 9.5 : 8.2
  const hd = [2, -96 + lift]
  const F = limb([6, -84 + lift], arm), B = limb([-6, -84 + lift], back)
  const hem = kurta ? -38 + lift : -46 + lift
  return (
    <g transform={`translate(${x} ${y}) scale(${s * face} ${s})`}>
      <ellipse cx={sit ? 10 : 0} cy="0" rx={sit ? 22 : 15} ry="3" fill="#000" opacity=".25" />
      {hair === 'long' && <rect x={hd[0] - 11} y={hd[1] - 6} width="11" height="30" rx="5" fill={hairC} />}
      <path d={`M-6 ${-84 + lift} L${B.e[0]} ${B.e[1]} L${B.h[0]} ${B.h[1]}`} stroke={top} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".85" />
      {sit ? (
        <g stroke={bottom} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M-2 -22 L18 -36 L26 -4" /><path d="M4 -20 L24 -30 L34 -4" opacity=".9" />
        </g>
      ) : (
        <g fill={bottom}>
          <path d="M-9 -47 L0 -47 L-4 -3 L-10 -3 Z" opacity=".88" /><path d="M0 -47 L9 -47 L9 -3 L3 -3 Z" />
        </g>
      )}
      <g fill={P.charcoal}>{sit ? <><ellipse cx="28" cy="-3" rx="6" ry="3" /><ellipse cx="36" cy="-3" rx="6" ry="3" /></> : <><ellipse cx="-6" cy="-2.5" rx="6" ry="3" /><ellipse cx="7" cy="-2.5" rx="6" ry="3" /></>}</g>
      <path d={`M-11 ${-80 + lift} C-11 ${-86 + lift} -7 ${-89 + lift} 0 ${-89 + lift} C7 ${-89 + lift} 11 ${-86 + lift} 11 ${-80 + lift} L${kurta ? 12 : 10} ${hem} L${kurta ? -12 : -10} ${hem} Z`} fill={top} />
      {hair === 'hijab' ? (
        <>
          <path d={`M${hd[0] - 12} ${hd[1] + 14} C${hd[0] - 14} ${hd[1] - 14} ${hd[0] + 14} ${hd[1] - 14} ${hd[0] + 12} ${hd[1] + 14} Z`} fill={hairC} />
          <ellipse cx={hd[0] + 3} cy={hd[1] + 1} rx="5.6" ry="6.6" fill={skin} />
        </>
      ) : (
        <>
          <circle cx={hd[0] - 2} cy={hd[1] - 2} r={hr + 0.8} fill={hairC} />
          <circle cx={hd[0]} cy={hd[1]} r={hr} fill={skin} />
          {hair === 'bun' && <circle cx={hd[0] - 7} cy={hd[1] - 7} r="4" fill={hairC} />}
        </>
      )}
      <path d={`M6 ${-84 + lift} L${F.e[0]} ${F.e[1]} L${F.h[0]} ${F.h[1]}`} stroke={top} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={F.h[0]} cy={F.h[1]} r="2.8" fill={skin} />
      {hold === 'book' && <rect x={F.h[0] - 2} y={F.h[1] - 9} width="10" height="12" rx="1" fill={P.cream} transform={`rotate(-12 ${F.h[0]} ${F.h[1]})`} />}
    </g>
  )
}

// The cast and where they stand. Kite flyers' hands anchor the strings.
export const FLYERS = [
  { x: 1158, y: 778, s: 1.05, face: -1, arm: [168, -14] },
  { x: 1452, y: 760, s: 1.0, face: -1, arm: [160, 6] },
]
export const KITES = [
  { x: 1000, y: 290, size: 64, p: [1450, 450, 52, 1], a: P.coral, b: '#D9502F', tail: [P.saffron, P.teal, P.saffron, P.teal], flyer: 0 },
  { x: 1330, y: 360, size: 46, p: [1250, 560, 40, 0], a: P.teal, b: '#0F857D', tail: [P.coral, P.mustard, P.coral], flyer: 1 },
  { x: 1210, y: 250, size: 32, p: null, a: P.mustard, b: '#CF9F1C', tail: [P.magenta, P.indigo], flyer: 0 },
]

function Kite({ k, i }) {
  const s = k.size
  return (
    <g className="rs-kite" data-kite={i} transform={`translate(${k.x} ${k.y})`}>
      <path className="rs-tail" d="" stroke="#3b2a1a" strokeWidth="1.6" fill="none" />
      <g className="rs-bows" />
      <g filter="url(#rs-paper-s)">
        <path d={`M0 ${-s} L${s * 0.72} ${-s * 0.12} L0 ${-s * 0.12} Z`} fill={k.a} />
        <path d={`M0 ${-s} L${-s * 0.72} ${-s * 0.12} L0 ${-s * 0.12} Z`} fill={k.b} />
        <path d={`M${-s * 0.72} ${-s * 0.12} L0 ${s * 1.05} L0 ${-s * 0.12} Z`} fill={k.a} />
        <path d={`M${s * 0.72} ${-s * 0.12} L0 ${s * 1.05} L0 ${-s * 0.12} Z`} fill={k.b} />
        <path d={`M0 ${-s} L0 ${s * 1.05} M${-s * 0.72} ${-s * 0.12} L${s * 0.72} ${-s * 0.12}`} stroke="#5b3d24" strokeWidth="1.8" />
      </g>
    </g>
  )
}

/** Foreground: the near bank, grass, the people and their kites. */
export function NearBank() {
  const tufts = Array.from({ length: 46 }, (_, i) => {
    const x = 700 + i * 20 + ((i * 37) % 11)
    const y = x < 1040 ? 900 - (x - 560) * 0.24 : 770 - (x - 1040) * 0.07
    const c = i % 3 ? P.grass : P.grass2
    return <path key={i} d={`M${x} ${y + 8} q-3 -12 -7 -16 M${x} ${y + 8} q1 -14 3 -20 M${x} ${y + 8} q4 -10 9 -13`} stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none" />
  })
  return (
    <Layer>
      <g filter="url(#rs-paper)">
        <path d="M560 900 C700 860 860 800 1040 770 C1200 746 1400 736 1600 730 L1600 900 Z" fill="url(#rs-bank)" />
        <path d="M0 830 C80 836 170 862 240 900 L0 900 Z" fill={P.bank2} />
      </g>
      <g>{tufts}</g>
      <g fill={P.coral} opacity=".9">{[[1080, 800], [1230, 790], [1360, 780], [1510, 770], [960, 820]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.2" fill={i % 2 ? P.mustard : P.coral} />)}</g>

      {/* strings first, so kites and people sit on top */}
      <g className="rs-strings" stroke="#2a2018" strokeWidth="1.1" fill="none" opacity=".75">
        {KITES.map((k, i) => <path key={i} data-string={i} d="" />)}
      </g>

      <g filter="url(#rs-paper-s)">
        {/* kite flyer, with a child pointing up beside him */}
        <Fig {...FLYERS[0]} skin={SKIN[0]} top={P.coral} bottom={P.denim} back={[-14, 10]} />
        <Fig x={1206} y={782} s={0.92} kid face={-1} skin={SKIN[3]} top={P.mustard} bottom={P.coral} arm={[150, 10]} />
        {/* two students sitting on the bank, talking */}
        <Fig x={1282} y={770} s={1} sit skin={SKIN[2]} hair="hijab" hairC={P.teal} top={P.indigo} bottom={P.charcoal} arm={[60, 40]} hold="book" />
        <Fig x={1362} y={768} s={1} sit face={-1} skin={SKIN[1]} hair="short" top={P.leaf} bottom={P.denim} arm={[40, 70]} />
        {/* the second flyer, and a friend watching */}
        <Fig {...FLYERS[1]} skin={SKIN[4]} hair="long" top={P.magenta} bottom={P.cream} kurta back={[-10, 0]} />
        <Fig x={1532} y={756} s={1.02} face={-1} skin={SKIN[1]} hair="bun" top={P.saffron} bottom={P.plum} kurta arm={[-6, 0]} />
      </g>

      {KITES.map((k, i) => <Kite key={i} k={k} i={i} />)}
    </Layer>
  )
}

/**
 * Kite motion: each kite drifts and tilts on its own slow beat; its tail waves; its string re-hangs
 * from the flyer's hand. Call with t (seconds); `still` draws the resting pose.
 */
export function driveKites(root, t, still = false, portrait = false, minX = 0) {
  // landscape: keep the kites in clear sky right of the title — spread them over [lo, hi] when the title
  // reaches further across (narrower laptops), keeping their order and spacing
  const lo = Math.max(1000, minX), hi = Math.min(1560, Math.max(1330, lo + 220))
  const spread = (x) => lo + ((x - 1000) / 330) * (hi - lo)
  KITES.forEach((k, i) => {
    const g = root.querySelector(`[data-kite="${i}"]`), str = root.querySelector(`[data-string="${i}"]`)
    if (!g || !str) return
    const ph = i * 1.9
    const dx = still ? 0 : Math.sin(t * 0.6 + ph) * 14 + Math.sin(t * 1.3 + ph) * 5
    const dy = still ? 0 : Math.cos(t * 0.8 + ph) * 9
    const rot = still ? -8 : -8 + Math.sin(t * 0.9 + ph) * 7
    if (portrait && !k.p) { g.style.display = str.style.display = 'none'; return }
    g.style.display = str.style.display = ''
    const [bx0, by0, size, pf] = portrait ? k.p : [spread(k.x), k.y, k.size, k.flyer]
    const sc = size / k.size // kites are drawn at k.size; portrait ones are scaled
    const x = bx0 + dx, y = by0 + dy
    g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${sc.toFixed(3)})`)

    // tail: a wave hanging from the bottom point, bows along it
    const s = k.size, n = 5, seg = s * 0.55
    let d = `M0 ${s * 1.05}`
    const bows = []
    for (let j = 1; j <= n; j++) {
      const yy = s * 1.05 + j * seg, xx = Math.sin(t * 2.2 + j * 0.9 + ph) * (4 + j * 2.4) * (still ? 0.6 : 1)
      d += ` L${xx.toFixed(1)} ${yy.toFixed(1)}`
      if (j <= k.tail.length) bows.push(`<path d="M${(xx - 6).toFixed(1)} ${(yy - 4).toFixed(1)} L${(xx + 6).toFixed(1)} ${(yy + 4).toFixed(1)} L${(xx + 6).toFixed(1)} ${(yy - 4).toFixed(1)} L${(xx - 6).toFixed(1)} ${(yy + 4).toFixed(1)} Z" fill="${k.tail[j - 1]}"/>`)
    }
    g.querySelector('.rs-tail').setAttribute('d', d)
    g.querySelector('.rs-bows').innerHTML = bows.join('')

    // string: from the bridle (just below the cross-stick) to the hand, with a gentle sag
    const r = (rot * Math.PI) / 180
    const bx = x - Math.sin(r) * s * sc * 0.2, by = y + Math.cos(r) * s * sc * 0.2
    const [hx, hy] = handOf(FLYERS[pf])
    const mx = (bx + hx) / 2 + 30, my = (by + hy) / 2 + 40
    str.setAttribute('d', `M${bx.toFixed(1)} ${by.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}`)
  })
}

/** Flowing water for the title: stretched turbulence mapped to river blues and foam, as a tile. */
export const WATER = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='420'><filter id='w' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.0045 0.03' numOctaves='4' seed='7' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncR type='table' tableValues='0.10 0.20 0.45 0.80 0.98'/><feFuncG type='table' tableValues='0.36 0.52 0.74 0.92 1'/><feFuncB type='table' tableValues='0.50 0.66 0.84 0.96 1'/><feFuncA type='linear' slope='0' intercept='1'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#w)'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})()

/** Paper grain for the whole frame. */
export const GRAIN = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})()
