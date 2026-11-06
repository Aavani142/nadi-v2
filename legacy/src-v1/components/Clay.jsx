import { useId } from 'react'

/**
 * Clay — hand-sculpted looking 3D objects (after the Kerala Literature Festival's clay organs),
 * drawn in SVG so they stay crisp and light. Each object belongs to NADI's own story:
 *   sun    — the sun in the NADI logo
 *   wave   — the river ("nadi") in the logo
 *   heart  — mental health (Kappiness, Navajeevana)
 *   book   — tribal education (Prabodhini)
 *   sprout — youth & community growth (Youth for Action, Ekatva)
 *   hands  — collective action, two hands joined
 *   cloud  — soft clay clouds that drift between sections
 *
 * The clay look comes from one filter: a grainy noise lit like a surface, multiplied into the
 * shape, a rounded specular highlight on the edges, and a soft cast shadow.
 */

const SHAPES = {
  sun: {
    view: '0 0 200 200',
    base: '#F5B301', light: '#FFD95A', dark: '#C77F00',
    draw: () => (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="92" y="6" width="16" height="40" rx="8" transform={`rotate(${i * 30} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="54" />
      </>
    ),
  },
  wave: {
    view: '0 0 240 150',
    base: '#2A86C6', light: '#6FB7EA', dark: '#0B4F86',
    draw: () => <path d="M10 118 C 30 60, 70 26, 118 30 C 168 34, 186 76, 160 96 C 142 110, 118 96, 128 80 C 136 68, 156 72, 156 72 C 140 52, 92 56, 76 92 C 66 114, 74 128, 86 134 L 22 134 C 14 134, 8 128, 10 118 Z" />,
  },
  heart: {
    view: '0 0 200 190',
    base: '#EE5A3B', light: '#FF9474', dark: '#B42F16',
    draw: () => <path d="M100 176 C 60 146, 12 112, 12 64 C 12 34, 36 12, 64 12 C 82 12, 94 22, 100 36 C 106 22, 118 12, 136 12 C 164 12, 188 34, 188 64 C 188 112, 140 146, 100 176 Z" />,
  },
  book: {
    view: '0 0 240 170',
    base: '#F2EBDD', light: '#FFFFFF', dark: '#B9AE98',
    draw: (c) => (
      <>
        <path d="M120 40 C 92 20, 50 16, 14 26 L 14 146 C 50 136, 92 140, 120 160 Z" fill={c.coverL} />
        <path d="M120 40 C 148 20, 190 16, 226 26 L 226 146 C 190 136, 148 140, 120 160 Z" fill={c.coverR} />
        <path d="M120 46 C 94 30, 58 28, 26 34 L 26 136 C 58 128, 94 132, 120 150 Z" />
        <path d="M120 46 C 146 30, 182 28, 214 34 L 214 136 C 182 128, 146 132, 120 150 Z" />
        <g stroke={c.dark} strokeWidth="3" strokeLinecap="round" fill="none" opacity=".55">
          <path d="M40 56 C 64 52, 88 54, 106 62" /><path d="M40 74 C 64 70, 88 72, 106 80" /><path d="M40 92 C 64 88, 88 90, 106 98" />
          <path d="M134 62 C 152 54, 176 52, 200 56" /><path d="M134 80 C 152 72, 176 70, 200 74" /><path d="M134 98 C 152 90, 176 88, 200 92" />
        </g>
      </>
    ),
    coverL: '#1E9E62', coverR: '#178A54',
  },
  sprout: {
    view: '0 0 200 220',
    base: '#1E9E62', light: '#5FD39A', dark: '#0E6B40',
    draw: (c) => (
      <>
        <path d="M94 210 C 92 170, 94 130, 100 96 L 108 96 C 104 130, 104 170, 108 210 Z" />
        <path d="M100 104 C 60 112, 18 92, 10 40 C 56 34, 96 56, 100 104 Z" />
        <path d="M106 92 C 112 42, 150 10, 194 14 C 196 66, 158 100, 106 92 Z" />
        <ellipse cx="102" cy="208" rx="62" ry="12" fill={c.soil} />
      </>
    ),
    soil: '#8A5A3C',
  },
  hands: {
    view: '0 0 240 170',
    base: '#C88A5E', light: '#EDB98F', dark: '#8E5634',
    draw: (c) => (
      <>
        <path d="M10 120 C 30 92, 60 78, 92 76 L 132 74 C 144 74, 148 90, 136 94 L 104 100 L 150 98 C 166 98, 168 116, 152 118 L 98 124 C 70 128, 46 140, 26 156 Z" />
        <path d="M230 50 C 210 78, 180 92, 148 94 L 108 96 C 96 96, 92 80, 104 76 L 136 70 L 90 72 C 74 72, 72 54, 88 52 L 142 46 C 170 42, 194 30, 214 14 Z" fill={c.second} />
      </>
    ),
    second: '#7A4B2C',
  },
  cloud: {
    view: '0 0 220 120',
    base: '#E9DCC6', light: '#FFF7E8', dark: '#B9A68A',
    draw: () => <path d="M30 104 C 8 104, 4 76, 24 70 C 20 46, 46 34, 64 46 C 70 20, 108 10, 124 34 C 140 18, 176 26, 176 54 C 200 52, 214 74, 202 92 C 196 102, 186 104, 176 104 Z" />,
  },
}

export function Clay({ kind = 'sun', className = '', style, float = false, delay = 0, title }) {
  const raw = useId().replace(/:/g, '')
  const s = SHAPES[kind] ?? SHAPES.sun
  const f = `clay-${raw}`, g = `clayg-${raw}`
  return (
    <svg viewBox={s.view} className={`pointer-events-none overflow-visible ${float ? 'clay-float' : ''} ${className}`}
      style={{ animationDelay: `${delay}s`, ...style }} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : 'true'}>
      <defs>
        <radialGradient id={g} cx="34%" cy="28%" r="80%">
          <stop offset="0" stopColor={s.light} />
          <stop offset=".5" stopColor={s.base} />
          <stop offset="1" stopColor={s.dark} />
        </radialGradient>
        <filter id={f} x="-25%" y="-25%" width="150%" height="160%" colorInterpolationFilters="sRGB">
          {/* grain: noise lit as a surface, multiplied into the shape */}
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="noise" />
          <feDiffuseLighting in="noise" surfaceScale="1.4" diffuseConstant="1.15" lightingColor="#fff" result="grain">
            <feDistantLight azimuth="225" elevation="58" />
          </feDiffuseLighting>
          <feComposite in="grain" in2="SourceGraphic" operator="arithmetic" k1="1.06" result="tex" />
          <feComposite in="tex" in2="SourceAlpha" operator="in" result="clay" />
          {/* rounded, soft edge highlight */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="soft" />
          <feSpecularLighting in="soft" surfaceScale="5" specularConstant=".55" specularExponent="16" lightingColor="#fff" result="spec">
            <feDistantLight azimuth="225" elevation="42" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feComposite in="clay" in2="specIn" operator="arithmetic" k2="1" k3=".7" result="lit" />
          {/* cast shadow */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="sb" />
          <feOffset in="sb" dx="5" dy="12" result="so" />
          <feFlood floodColor="#000" floodOpacity=".3" />
          <feComposite in2="so" operator="in" result="shadow" />
          <feMerge><feMergeNode in="shadow" /><feMergeNode in="lit" /></feMerge>
        </filter>
      </defs>
      <g filter={`url(#${f})`} fill={`url(#${g})`}>{s.draw(s)}</g>
    </svg>
  )
}

/** A few clay clouds drifting slowly across a section (decorative). */
export function ClayClouds({ items = [[8, 12, 70], [62, 6, 54], [86, 40, 44]], className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map(([x, y, w], i) => (
        <Clay key={i} kind="cloud" float delay={i * 1.3} className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: w }} />
      ))}
    </div>
  )
}
