import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import SectionHead from './SectionHead.jsx'
import { SplitWords } from '../lib/Motion.jsx'
import { assets } from '../data/assets.js'
import { projects, sdgs, impact } from '../data/content.js'

/* ────────────────────────────────────────────────────────────────────────────
   PROJECT BRAND IDENTITIES & DESIGN SYSTEMS
   Each initiative has its own unique color palette, typography, official logo,
   and visual atmosphere derived directly from its official brand assets.
──────────────────────────────────────────────────────────────────────────── */
const THEMES = {
  kappiness: {
    bg: '#F8EEDB', // Warm caramel cream
    fg: '#3E1C08', // Deep roasted espresso
    sub: '#784724', // Warm coffee bean / chestnut
    accent: '#C86908', // Rich golden amber
    accentLight: '#F3DCBE', // Steamed milk tone
    border: 'rgba(62, 28, 8, 0.14)',
    dark: false,
    font: "'Fredoka', 'Hanken Grotesk', system-ui, sans-serif",
    weight: 600,
    tracking: '-0.02em',
    textTransform: 'lowercase',
    displayTitle: 'kappiness',
    tagline: 'Nourishing Minds, Pouring Happiness.',
    category: 'Mental Health Café & Therapeutic Centre',
    btn: {
      bg: '#3E1C08',
      fg: '#F8EEDB',
      iconBg: '#C86908',
      iconFg: '#FFFFFF',
    },
    visualBg: 'radial-gradient(ellipse at center, rgba(200, 105, 8, 0.16) 0%, rgba(248, 238, 219, 0.7) 100%)',
    ambientGlow: 'rgba(200, 105, 8, 0.22)',
  },
  prabodhini: {
    bg: '#140E0A', // Deep obsidian charcoal matching tree trunk
    fg: '#FAF4EB', // Warm ivory parchment
    sub: 'rgba(250, 244, 235, 0.74)', // Warm antique oat
    accent: '#D46E20', // Burnt terracotta copper from book leaves
    accentLight: 'rgba(212, 110, 32, 0.22)',
    border: 'rgba(250, 244, 235, 0.15)',
    dark: true,
    font: "'Tenor Sans', 'Hanken Grotesk', system-ui, sans-serif",
    weight: 400,
    tracking: '0.12em',
    textTransform: 'uppercase',
    displayTitle: 'PRABODHINI',
    tagline: 'An initiative of NADI Foundation',
    category: 'Quality Education for Tribal Children',
    btn: {
      bg: '#D46E20',
      fg: '#FAF4EB',
      iconBg: '#FAF4EB',
      iconFg: '#140E0A',
    },
    visualBg: 'radial-gradient(ellipse at center, rgba(212, 110, 32, 0.22) 0%, rgba(20, 14, 10, 0.85) 100%)',
    ambientGlow: 'rgba(212, 110, 32, 0.3)',
  },
  'youth-for-action': {
    bg: '#08145E', // Deep royal cobalt blue matching the figures
    fg: '#FFFFFF', // Crisp brilliant white
    sub: 'rgba(255, 255, 255, 0.78)',
    accent: '#3B82F6', // Vibrant electric blue arrow
    accentLight: 'rgba(59, 130, 246, 0.22)',
    border: 'rgba(255, 255, 255, 0.18)',
    dark: true,
    font: "'Montserrat', 'Hanken Grotesk', system-ui, sans-serif",
    weight: 800,
    tracking: '-0.01em',
    textTransform: 'uppercase',
    displayTitle: 'YOUTH FOR ACTION',
    tagline: 'An initiative of NADI Foundation',
    category: 'Youth Leadership & Community Action',
    btn: {
      bg: '#FFFFFF',
      fg: '#08145E',
      iconBg: '#3B82F6',
      iconFg: '#FFFFFF',
    },
    visualBg: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.26) 0%, rgba(8, 20, 94, 0.88) 100%)',
    ambientGlow: 'rgba(59, 130, 246, 0.35)',
  },
  ekatva: {
    bg: '#FFFFFF', // Haute gallery white
    fg: '#0A0A0A', // Jet noir Didone
    sub: 'rgba(10, 10, 10, 0.7)',
    accent: '#0A0A0A',
    accentLight: '#F4F4F5',
    border: 'rgba(10, 10, 10, 0.14)',
    dark: false,
    font: "'Bodoni Moda', 'Newsreader', Georgia, serif",
    weight: 700,
    tracking: '0.04em',
    textTransform: 'uppercase',
    displayTitle: 'EKATVA',
    tagline: 'Strengthening Transgender Lives Through Skill Development and Mental Health',
    category: 'Transgender Empowerment & Livelihoods',
    btn: {
      bg: '#0A0A0A',
      fg: '#FFFFFF',
      iconBg: '#27272A',
      iconFg: '#FFFFFF',
    },
    visualBg: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.04) 0%, rgba(255, 255, 255, 0.95) 100%)',
    ambientGlow: 'rgba(0, 0, 0, 0.12)',
  },
  navajeevana: {
    bg: '#072C1A', // Lush deep botanical evergreen
    fg: '#F0FDF4', // Fresh morning mint cream
    sub: 'rgba(240, 253, 244, 0.78)',
    accent: '#10B981', // Botanical emerald (top petals)
    accentSecondary: '#0284C7', // Oceanic cerulean (left petals)
    accentTertiary: '#F59E0B', // Golden marigold (right petals)
    accentLight: 'rgba(16, 185, 129, 0.22)',
    border: 'rgba(16, 185, 129, 0.24)',
    dark: true,
    font: "'Poppins', 'Hanken Grotesk', system-ui, sans-serif",
    weight: 600,
    tracking: '-0.02em',
    textTransform: 'none',
    displayTitle: 'Navajeevana',
    tagline: 'Community health, vitality & holistic wellbeing',
    category: 'Community Health & Wellbeing',
    btn: {
      bg: '#10B981',
      fg: '#072C1A',
      iconBg: '#F59E0B',
      iconFg: '#072C1A',
    },
    visualBg: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.24) 0%, rgba(7, 44, 26, 0.9) 100%)',
    ambientGlow: 'rgba(16, 185, 129, 0.32)',
  },
}

const EASE = [0.22, 1, 0.36, 1]
const pad2 = (n) => String(n).padStart(2, '0')

/* ── Ambient visual patterns tailored to each project's brand identity ── */
function BrandBackdrop({ id, t }) {
  if (id === 'kappiness') {
    // Warm café ripples & coffee aroma curves
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="35%" fill="none" stroke={t.accent} strokeWidth="1.5" strokeDasharray="4 6" />
        <circle cx="50%" cy="50%" r="48%" fill="none" stroke={t.sub} strokeWidth="1" opacity="0.6" />
        <path d="M 40% 80% Q 45% 65% 42% 50% T 46% 30%" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <path d="M 60% 80% Q 55% 65% 58% 50% T 54% 30%" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    )
  }
  if (id === 'prabodhini') {
    // Concentric knowledge rings & organic tree growth rings
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="30%" fill="none" stroke={t.accent} strokeWidth="1.5" />
        <circle cx="50%" cy="50%" r="44%" fill="none" stroke={t.fg} strokeWidth="1" strokeDasharray="6 8" opacity="0.4" />
        <circle cx="50%" cy="50%" r="58%" fill="none" stroke={t.accent} strokeWidth="1" opacity="0.3" />
        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke={t.accent} strokeWidth="1" strokeDasharray="3 6" opacity="0.3" />
      </svg>
    )
  }
  if (id === 'youth-for-action') {
    // Kinetic upward speed lines & chevron momentum
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20% 90% L 50% 30% L 80% 90%" fill="none" stroke={t.accent} strokeWidth="2" opacity="0.5" />
        <path d="M 30% 90% L 50% 50% L 70% 90%" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.4" />
        <line x1="15%" y1="85%" x2="85%" y2="15%" stroke={t.accent} strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
      </svg>
    )
  }
  if (id === 'ekatva') {
    // Haute couture architectural gridlines & editorial crosshairs
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <rect x="12%" y="12%" width="76%" height="76%" fill="none" stroke="#000000" strokeWidth="1" />
        <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#000000" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#000000" strokeWidth="0.5" strokeDasharray="2 4" />
      </svg>
    )
  }
  if (id === 'navajeevana') {
    // Tri-color vitality aura radiating green, cerulean & gold
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="32%" fill="none" stroke={t.accent} strokeWidth="2" opacity="0.6" />
        <circle cx="50%" cy="50%" r="44%" fill="none" stroke={t.accentSecondary} strokeWidth="1.5" strokeDasharray="5 7" opacity="0.5" />
        <circle cx="50%" cy="50%" r="56%" fill="none" stroke={t.accentTertiary} strokeWidth="1.5" opacity="0.5" />
      </svg>
    )
  }
  return null
}

/* ── Hero Visual: Prominent Official Logo Showcase or High-Res Photograph ── */
function ProjectVisual({ p, t }) {
  const photoSrc = assets.projectPhotos?.[p.id]
  const logoSrc = assets.projects[p.id]?.[0]
  const [photoFailed, setPhotoFailed] = useState(!photoSrc)
  const [logoFailed, setLogoFailed] = useState(!logoSrc)

  return (
    <div
      className="relative flex h-full min-h-[260px] sm:min-h-[320px] lg:min-h-[440px] w-full items-center justify-center overflow-hidden rounded-[1.5rem] p-5 sm:p-7 md:rounded-[2rem] md:p-8"
      style={{ background: t.visualBg }}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute h-[75%] w-[75%] rounded-full blur-3xl opacity-60 transition-transform duration-700 group-hover/card:scale-110"
        style={{ background: t.ambientGlow }}
      />

      {/* Bespoke brand ambient graphics */}
      <BrandBackdrop id={p.id} t={t} />

      {!photoFailed && photoSrc ? (
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={photoSrc}
            alt={`${p.name} — project photograph`}
            loading="lazy"
            onError={() => setPhotoFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
          />
          {/* Floating Logo Badge on Photo */}
          {!logoFailed && logoSrc && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5 rounded-2xl bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md">
              <img src={logoSrc} alt={`${p.name} official logo`} className="h-9 w-auto max-w-[130px] object-contain" />
            </div>
          )}
        </div>
      ) : (
        /* Curated Official Logo Showcase Frame */
        <div className="relative z-10 flex w-full max-w-sm sm:max-w-md flex-col items-center justify-center">
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`relative flex w-full items-center justify-center rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] ring-1 ${
              t.dark ? 'ring-white/20' : 'ring-black/10'
            }`}
          >
            {/* Corner authenticity pill */}
            <div className="absolute right-4 top-4 flex items-center gap-1.5 opacity-60">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.accent }} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Official</span>
            </div>

            {!logoFailed && logoSrc ? (
              <img
                src={logoSrc}
                alt={`${p.name} Official Logo`}
                draggable="false"
                onError={() => setLogoFailed(true)}
                className="max-h-[140px] sm:max-h-[180px] md:max-h-[220px] w-auto max-w-[90%] select-none object-contain transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
              />
            ) : (
              <span className="font-display text-2xl font-black uppercase text-neutral-900">{p.name}</span>
            )}
          </motion.div>

          {/* Subtitle tag below plaque */}
          <div className="mt-3.5 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: t.sub }}>
              {p.name} · Official Identity
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── One Sticky Stacked Card ── */
function Card({ p, i, n, progress, reduce }) {
  const t = THEMES[p.id] || THEMES.kappiness
  const last = i === n - 1
  const logoSrc = assets.projects[p.id]?.[0]
  const [logoFailed, setLogoFailed] = useState(!logoSrc)

  // SOHUB stacked scroll depth: earlier cards subtly scale down and dim as later cards slide over
  const depth = n - 1 - i
  const scale = useTransform(progress, [i / n, 1], [1, reduce || last ? 1 : 1 - depth * 0.035])
  const shade = useTransform(progress, [i / n, 1], [0, reduce || last ? 0 : Math.min(0.38, depth * 0.09)])

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.75, delay, ease: EASE },
        }

  const stats = p.id === 'youth-for-action' ? impact.yfa : null

  return (
    <div
      id={p.id}
      style={{ '--i': i, scrollMarginTop: '5rem' }}
      className={`sticky top-[calc(4.5rem+var(--i)*12px)] md:top-[calc(5.5rem+var(--i)*18px)] ${
        last ? '' : 'pb-[10vh] md:pb-[14vh]'
      }`}
    >
      <motion.article
        style={{
          scale,
          transformOrigin: 'center top',
          background: t.bg,
          color: t.fg,
          zIndex: i,
        }}
        className="group/card relative min-h-[580px] h-auto md:h-[calc(100svh-8rem)] md:min-h-[640px] md:max-h-[860px] overflow-hidden rounded-[1.75rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.45)] md:rounded-[2.5rem]"
      >
        <div className="flex h-full flex-col p-5 sm:p-7 md:p-10 lg:p-12">
          {/* Top Row: Index, Category Badge, and Affiliation */}
          <div className="flex items-center justify-between gap-4 border-b pb-4 sm:pb-5" style={{ borderColor: t.border }}>
            <div className="flex items-baseline gap-2 font-display font-black leading-none tracking-[-0.03em]">
              <span className="text-3xl sm:text-4xl md:text-5xl" style={{ color: t.fg }}>
                {pad2(i + 1)}
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: t.sub }}>
                / {pad2(n)}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Category Pill */}
              <span
                className="rounded-full px-3.5 py-1.5 text-right text-xs sm:text-[13px] font-semibold leading-tight tracking-[0.02em]"
                style={{
                  border: `1px solid ${t.border}`,
                  color: t.fg,
                  background: t.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                {t.category}
              </span>
            </div>
          </div>

          {/* Main Grid: Left Column (Brand Identity & Copy) + Right Column (Hero Visual Showcase) */}
          <div className="mt-5 grid min-h-0 flex-1 gap-6 md:mt-8 md:gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Project Identity, Official Logo Lockup, Typography & Details */}
            <div className="flex min-h-0 flex-col justify-center lg:col-span-7">
              {/* Prominent Official Logo Emblem Badge */}
              {!logoFailed && logoSrc && (
                <motion.div {...rise(0.05)} className="mb-4 inline-flex items-center gap-3">
                  <div className="flex h-12 items-center justify-center rounded-xl bg-white px-3.5 py-1.5 shadow-md ring-1 ring-black/10">
                    <img
                      src={logoSrc}
                      alt={`${p.name} official logo`}
                      className="h-8 w-auto max-w-[120px] object-contain"
                      onError={() => setLogoFailed(true)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: t.sub }}>
                      Official Initiative
                    </span>
                    <span className="text-xs font-bold" style={{ color: t.fg }}>
                      NADI Foundation
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Project Headline in its Authentic Brand Typeface */}
              <motion.h3
                {...rise(0.12)}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[0.98] font-black"
                style={{
                  fontFamily: t.font,
                  fontWeight: t.weight,
                  letterSpacing: t.tracking,
                  textTransform: t.textTransform,
                  color: t.fg,
                }}
              >
                {t.displayTitle}
              </motion.h3>

              {/* Tagline if available */}
              {t.tagline && (
                <motion.p
                  {...rise(0.18)}
                  className="mt-2.5 max-w-xl font-serif text-sm sm:text-base md:text-lg italic leading-snug"
                  style={{ color: t.sub }}
                >
                  {t.tagline}
                </motion.p>
              )}

              {/* Project Description */}
              <motion.p
                {...rise(0.24)}
                className="mt-3.5 max-w-xl text-sm sm:text-base md:text-[17px] leading-relaxed"
                style={{ color: t.sub }}
              >
                {p.desc}
              </motion.p>

              {/* Special Reported Stats (Youth for Action) */}
              {stats && (
                <motion.dl
                  {...rise(0.3)}
                  className="mt-5 grid max-w-xl grid-cols-3 gap-3 border-t pt-4 sm:gap-4 md:mt-6 md:pt-5"
                  style={{ borderColor: t.border }}
                >
                  {stats.map((s) => (
                    <div key={s.l}>
                      <dt className="sr-only">{s.l}</dt>
                      <dd className="font-display text-2xl sm:text-3xl font-black tracking-tight" style={{ color: t.fg }}>
                        {s.v.toLocaleString('en-US')}
                        {s.s}
                      </dd>
                      <p className="mt-1 text-[11px] sm:text-xs leading-tight" style={{ color: t.sub }}>
                        {s.l}
                      </p>
                    </div>
                  ))}
                </motion.dl>
              )}

              {/* Interactions & SDG Alignments */}
              <motion.div {...rise(0.35)} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-8">
                {/* Explore Project Interaction */}
                <Link
                  to={`/our-work#${p.id}`}
                  className="group/btn inline-flex min-h-[48px] items-center gap-3 rounded-full py-1.5 pl-6 pr-2 text-xs sm:text-[13px] font-bold uppercase tracking-[0.1em] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ background: t.btn.bg, color: t.btn.fg }}
                >
                  Explore Project
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover/btn:rotate-45"
                    style={{ background: t.btn.iconBg, color: t.btn.iconFg }}
                  >
                    <ArrowUpRight size={17} />
                  </span>
                </Link>

                {/* SDG Alignments */}
                <div className="flex flex-wrap items-center gap-2">
                  {p.sdgs.map(
                    (n2) =>
                      sdgs[n2] && (
                        <span
                          key={n2}
                          title={`SDG ${n2}: ${sdgs[n2].name}`}
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                          style={{
                            background: t.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                            color: t.fg,
                          }}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ background: sdgs[n2].color }} />
                          SDG {n2}
                        </span>
                      )
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <motion.div
              className="flex-1 lg:col-span-5 lg:flex-none"
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, scale: 0.96 },
                    whileInView: { opacity: 1, scale: 1 },
                    viewport: { once: true, amount: 0.25 },
                    transition: { duration: 0.8, ease: EASE },
                  })}
            >
              <ProjectVisual p={p} t={t} />
            </motion.div>
          </div>
        </div>

        {/* Depth shade overlay when earlier cards sit behind incoming cards */}
        <motion.div aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.article>
    </div>
  )
}

export default function Projects() {
  const track = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const n = projects.length

  return (
    <section id="projects" aria-label="Our initiatives" className="bg-nadi-off text-ink">
      <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-24 sm:px-8 sm:pt-36 md:pb-16">
        <SectionHead label="Initiatives" className="text-nadi-deep" />
        <SplitWords
          text="Our five initiatives"
          accent="initiatives"
          accentClass="font-serif font-normal italic text-nadi-deep"
          className="mt-10 font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:text-[7rem]"
        />
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-ink/70">
          Every initiative operates with its own distinct brand identity and specialised focus, united by NADI Foundation's mission for equitable community development.
        </p>
      </div>

      {/* The track must NOT have overflow-hidden/auto, or `sticky` stops working. */}
      <div ref={track} className="mx-auto max-w-[1600px] px-3 pb-24 sm:px-8 md:pb-32">
        {projects.map((p, i) => (
          <Card key={p.id} p={p} i={i} n={n} progress={scrollYProgress} reduce={reduce} />
        ))}
      </div>
    </section>
  )
}
