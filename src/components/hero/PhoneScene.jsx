import { P, SKIN, Palm, Fig, handOf } from './RiverScene.jsx'

/**
 * The landing on phones — a calm, poster-like composition made for a tall screen, not the desktop
 * scene shrunk. One focal point: the sun setting in the middle of the frame behind three layered paper
 * ridges, the river born right beneath it and flowing toward you with the sun's reflection shimmering
 * down its centre. Two tall palms rise from the bottom corners and lean in to frame it. Along the
 * bottom, one strip of grass holds NADI's people — two students talking, a kite flyer and a child —
 * and a quiet line about who NADI is.
 *
 * Same cut-paper language, palette and layer classes as the desktop scene (NadiHero animates them the
 * same way). viewBox 400 × 860, anchored to the bottom so short screens lose only sky; tall screens
 * crop up to ~28 units a side, so everything that matters stays within x 30–370.
 */

const VB = '0 0 400 860'
const AR = 'xMidYMax slice'
const Layer = ({ children }) => (
  <svg viewBox={VB} preserveAspectRatio={AR} className="absolute inset-0 h-full w-full" aria-hidden="true">{children}</svg>
)

const SUN = { x: 200, y: 548, r: 66 }

export function PhoneSky() {
  const cloud = (x, y, w, c, o) => (
    <path d={`M${x} ${y} C${x + w * 0.1} ${y - 14} ${x + w * 0.3} ${y - 17} ${x + w * 0.42} ${y - 8} C${x + w * 0.55} ${y - 22} ${x + w * 0.8} ${y - 18} ${x + w * 0.86} ${y - 5} C${x + w * 0.95} ${y - 6} ${x + w} ${y - 3} ${x + w} ${y} Z`} fill={c} opacity={o} />
  )
  return (
    <Layer>
      <rect y="-500" width="400" height="1360" fill="url(#rs-sky)" />
      <circle cx={SUN.x} cy={SUN.y} r="220" fill="url(#rs-glow)" />
      <g filter="url(#rs-paper)">
        <circle className="rs-sun" cx={SUN.x} cy={SUN.y} r={SUN.r} fill="url(#rs-sun)" />
        {cloud(-20, 452, 150, '#F2C3A2', 0.85)}
        {cloud(268, 486, 150, '#F4C9A8', 0.8)}
      </g>
      <g stroke="#2a2433" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".55">
        <path d="M250 500 q5 -5 10 0 q5 -5 10 0" /><path d="M272 486 q4 -4 8 0 q4 -4 8 0" />
      </g>
    </Layer>
  )
}

export function PhoneHills() {
  return (
    <Layer>
      <g filter="url(#rs-paper)">
        <path d="M0 566 C70 532 140 526 200 546 S330 538 400 520 L400 720 L0 720 Z" fill={P.hillFar} />
        <path d="M0 598 C80 572 150 582 200 592 C260 580 330 566 400 588 L400 720 L0 720 Z" fill={P.hillFar2} />
      </g>
    </Layer>
  )
}

/** The green land either side of the river, with two small palms far off on the ridge. */
export function PhoneLand() {
  return (
    <Layer>
      <g filter="url(#rs-paper)">
        <path d="M0 622 C90 606 160 612 196 618 C240 612 320 604 400 616 L400 860 L0 860 Z" fill={P.land} />
        <path d="M208 618 C290 610 350 610 400 616 L400 860 L262 860 Z" fill={P.land2} />
      </g>
      <g filter="url(#rs-paper-s)">
        <Palm x={118} y={612} h={46} lean={0.2} s={0.32} c={P.palm2} />
        <Palm x={292} y={610} h={40} lean={-0.2} s={0.28} />
      </g>
    </Layer>
  )
}

const RIVER = 'M194 618 C186 652 214 680 192 716 C164 760 134 786 116 822 L288 822 C270 790 252 756 240 716 C226 676 210 650 208 618 Z'

export function PhoneRiver() {
  return (
    <Layer>
      <clipPath id="ps-river-clip"><path d={RIVER} /></clipPath>
      <g filter="url(#rs-paper)"><path d={RIVER} fill="url(#rs-river)" /></g>
      <g clipPath="url(#ps-river-clip)">
        <rect x="0" y="610" width="400" height="240" filter="url(#rs-streaks)" opacity=".35" />
        {/* the sun's reflection: a soft column of light, broken into a few sparkles on the water */}
        <linearGradient id="ps-reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC98E" stopOpacity=".75" /><stop offset=".55" stopColor="#F6A86E" stopOpacity=".3" /><stop offset="1" stopColor="#F6A86E" stopOpacity="0" />
        </linearGradient>
        <path d="M196 618 L208 618 C214 680 236 740 246 806 L160 806 C170 740 190 680 196 618 Z" fill="url(#ps-reflect)" />
        <g fill="#FFE2B8">
          {[[201, 640, 5], [196, 664, 7], [208, 688, 6], [190, 714, 9], [214, 736, 7], [184, 760, 12], [222, 778, 9], [200, 796, 14]].map(([x, y, w], i) => (
            <ellipse key={i} className="ps-glint" style={{ animationDelay: `${-i * 0.43}s` }} cx={x} cy={y} rx={w} ry="1.3" />
          ))}
        </g>
        <g stroke="#FFE9C8" strokeLinecap="round" fill="none">
          {[[150, 756, 22], [238, 772, 20], [132, 800, 30], [250, 804, 26]].map(([x, y, w], i) => (
            <path key={i} className="rs-ripple" style={{ animationDelay: `${-i * 1.9}s` }} d={`M${x} ${y} q${w / 2} -3 ${w} 0`} strokeWidth="1.4" opacity=".6" />
          ))}
        </g>
      </g>
      {/* the vallam, coming down the river */}
      <g filter="url(#rs-paper-s)">
        <g transform="translate(214 738) scale(.5)"><g className="rs-rock">
          <path d="M-74 -10 Q-80 -22 -70 -24 Q-60 -4 0 -2 Q60 -4 70 -24 Q80 -22 74 -10 Q40 14 0 14 Q-40 14 -74 -10 Z" fill="#3B2617" />
          <path d="M-62 -8 Q0 4 62 -8" stroke="#6B4528" strokeWidth="3" fill="none" />
          <circle cx="6" cy="-40" r="7" fill={SKIN[3]} /><circle cx="4" cy="-43" r="7" fill={P.ink} />
          <path d="M-4 -32 L16 -32 L14 -6 L-2 -6 Z" fill={P.saffron} />
          <path d="M14 -26 L-30 30" stroke="#6B4528" strokeWidth="3" strokeLinecap="round" />
          <path d="M-30 30 l-8 10" stroke="#6B4528" strokeWidth="7" strokeLinecap="round" />
        </g></g>
      </g>
    </Layer>
  )
}

// the people on the grass, and the kites they hold
const FLYER = { x: 292, y: 808, s: 0.82, face: -1, arm: [166, -10] }
const CHILD = { x: 334, y: 812, s: 0.68, face: -1, kid: true, arm: [150, 14] }
const KITES = [
  { x: 312, y: 452, size: 28, a: P.coral, b: '#D9502F', tail: [P.saffron, P.teal, P.saffron], hold: FLYER },
  { x: 352, y: 560, size: 19, a: P.teal, b: '#0F857D', tail: [P.coral, P.mustard], hold: CHILD },
]

function PhoneKite({ k }) {
  const s = k.size, [hx, hy] = handOf(k.hold), bx = k.x, by = k.y + s * 0.2
  return (
    <>
      <path className="rs-strings" d={`M${bx} ${by} Q${(bx + hx) / 2 + 14} ${(by + hy) / 2 + 26} ${hx} ${hy}`} stroke="#2a2018" strokeWidth=".8" fill="none" opacity=".65" />
      {/* swings about its bridle, so the string stays attached */}
      <g className="rs-kite ps-kite" style={{ transformOrigin: `${bx}px ${by}px` }}>
        <g transform={`translate(${k.x} ${k.y}) rotate(-8)`}>
          <path d={`M0 ${s * 1.05} q6 ${s * 0.4} -2 ${s * 0.8} t3 ${s * 0.8} t-3 ${s * 0.7}`} stroke="#3b2a1a" strokeWidth="1.1" fill="none" />
          {k.tail.map((c, j) => <path key={j} d={`M${-5 + (j % 2) * 3} ${s * (1.4 + j * 0.62)} l8 4.5 v-4.5 l-8 4.5 z`} fill={c} />)}
          <g filter="url(#rs-paper-s)">
            <path d={`M0 ${-s} L${s * 0.72} ${-s * 0.12} L0 ${-s * 0.12} Z`} fill={k.a} />
            <path d={`M0 ${-s} L${-s * 0.72} ${-s * 0.12} L0 ${-s * 0.12} Z`} fill={k.b} />
            <path d={`M${-s * 0.72} ${-s * 0.12} L0 ${s * 1.05} L0 ${-s * 0.12} Z`} fill={k.a} />
            <path d={`M${s * 0.72} ${-s * 0.12} L0 ${s * 1.05} L0 ${-s * 0.12} Z`} fill={k.b} />
            <path d={`M0 ${-s} L0 ${s * 1.05} M${-s * 0.72} ${-s * 0.12} L${s * 0.72} ${-s * 0.12}`} stroke="#5b3d24" strokeWidth="1.3" />
          </g>
        </g>
      </g>
    </>
  )
}

/** Foreground: the framing palms, the strip of grass, NADI's people and the words on the land. */
export function PhoneNear() {
  const tufts = Array.from({ length: 18 }, (_, i) => {
    const x = 14 + i * 21.5 + ((i * 7) % 9), y = 800 + ((i * 11) % 8)
    return <path key={i} d={`M${x} ${y + 6} q-2 -8 -5 -11 M${x} ${y + 6} q1 -10 2 -14 M${x} ${y + 6} q3 -7 7 -9`} stroke={i % 3 ? P.grass : P.grass2} strokeWidth="1.7" strokeLinecap="round" fill="none" />
  })
  return (
    <Layer>
      {/* two tall palms frame the sunset from the bottom corners */}
      <g filter="url(#rs-paper-s)">
        <Palm x={10} y={820} h={290} lean={0.2} s={1.45} />
        <Palm x={392} y={820} h={258} lean={-0.2} s={1.3} c={P.palm2} />
      </g>
      <g filter="url(#rs-paper)">
        <path d="M0 794 C90 786 160 802 200 798 C260 794 330 784 400 792 L400 860 L0 860 Z" fill="url(#rs-bank)" />
      </g>
      <g>{tufts}</g>
      {KITES.map((k, i) => <PhoneKite key={i} k={k} />)}
      <g filter="url(#rs-paper-s)">
        {/* two students talking on the left */}
        <Fig x={52} y={806} s={0.66} sit skin={SKIN[2]} hair="hijab" hairC={P.teal} top={P.indigo} bottom={P.charcoal} arm={[60, 40]} hold="book" />
        <Fig x={108} y={802} s={0.66} sit face={-1} skin={SKIN[1]} top={P.leaf} bottom={P.denim} arm={[40, 70]} />
        {/* the kite flyer and a child on the right */}
        <Fig {...FLYER} skin={SKIN[0]} top={P.coral} bottom={P.denim} back={[-14, 10]} />
        <Fig {...CHILD} skin={SKIN[3]} top={P.mustard} bottom={P.magenta} />
      </g>
      {/* the words on the land, in a light hand */}
      <text x="200" y="828" textAnchor="middle" fill="#F6EADA" opacity=".78" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="300" fontSize="12">
        a river of change, shaped by young people
      </text>
    </Layer>
  )
}
