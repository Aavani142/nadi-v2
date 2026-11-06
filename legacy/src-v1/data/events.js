/**
 * NADI events & activities.
 *
 * Source of truth for the "What's Happening at NADI" homepage section. Presentation components read
 * ONLY through the helpers at the bottom of this file, so this static list can later be replaced by a
 * Supabase query that returns the same shape — no component changes needed.
 *
 * Every entry is taken from a public NADI post (Instagram, via its official embed view) or from the
 * Annual Report 2025–2026. Nothing is inferred: fields that the source does not state are `null`.
 *
 * Event shape
 *   id            string   unique slug
 *   title         string
 *   date          string|null  ISO date of the event itself (YYYY-MM-DD), only if stated
 *   dateLabel     string|null  shown instead of `date` when the source gives no exact/valid date
 *   time          string|null  as stated, e.g. "6:30 PM IST"
 *   location      string|null  as stated
 *   description   string   faithful summary of the source caption / report text
 *   category      string   see CATEGORIES
 *   initiative    string|null  'kappiness' | 'prabodhini' | 'yfa' | 'ekatva' | 'navajeevana'
 *   status        'upcoming' | 'ongoing' | 'completed' | 'announced'   (see resolveStatus)
 *   image         { src, alt } | null
 *   instagram     string|null  original public post URL
 *   related       string[]     other official post URLs (e.g. the announcement poster)
 *   registration  string|null  ONLY an official registration URL published by NADI — never invented
 *   postedOn      string|null  ISO date of the source post
 *   priority      number       higher = shown first among equals (manual ordering control)
 *   source        string       where the information comes from
 *   featured      boolean      pin as the featured event (else the top-ranked one is featured)
 *   published     boolean      only published events are shown
 *
 * Future admin / Supabase table `events` (one row per object above, snake_case columns):
 *   id uuid pk · slug text unique · title text · date date null · date_label text null · time text null
 *   location text null · description text · category text → categories.id · initiative text null
 *   status text check (status in ('upcoming','ongoing','completed','announced'))
 *   image_path text null (Supabase Storage) · image_alt text · instagram_url text null · related_urls text[]
 *   registration_url text null · posted_on date null · priority int default 0 · featured bool default false
 *   published bool default false · source text · created_at / updated_at timestamptz · created_by uuid (staff)
 * Staff add and edit rows in the admin interface; `getEvents()` below becomes a `select … where published`.
 */

/** Category → label + festival accent colour (hex). An admin UI can manage this list as its own table. */
export const CATEGORIES = {
  research: { label: 'Field research', color: '#2A86C6' },
  training: { label: 'Training', color: '#1E9E62' },
  webinar: { label: 'Webinar', color: '#C23B7A' },
  dialogue: { label: 'Youth dialogue', color: '#F5B301' },
  livelihood: { label: 'Livelihood', color: '#EE5A3B' },
  awareness: { label: 'Awareness campaign', color: '#7A5AF8' },
  milestone: { label: 'Milestone', color: '#F5B301' },
}

const img = (n, alt) => ({ src: `/assets/events/${n}.webp`, alt })

export const EVENTS = [
  {
    id: 'disability-social-audit-2026',
    title: 'Disability Social Audit — fieldwork begins',
    date: null,
    dateLabel: 'Fieldwork under way',
    time: null,
    location: 'Railway stations, bus terminals, parks, malls and roads',
    description:
      "NADI Foundation's Disability Social Audit team has begun fieldwork to assess how accessible public spaces and infrastructure are — documenting barriers and the everyday challenges faced by persons with disabilities, to advocate for more inclusive public spaces.",
    category: 'research',
    initiative: null,
    status: 'ongoing',
    image: img('disability-social-audit', 'The Disability Social Audit team working through documents together at Kappiness'),
    instagram: 'https://www.instagram.com/p/DfHXneTEyv5/',
    related: [],
    registration: null,
    postedOn: '2026-10-30',
    priority: 10,
    featured: true,
    source: 'Instagram @nadi.india',
  },
  {
    id: 'navajeevana-aaa-training',
    title: 'AAA Training: Building Resilience in Everyday Life',
    date: null,
    dateLabel: 'Date to be confirmed',
    time: null,
    location: 'Vyapara Bhavan, Valad',
    description:
      'A Navajeevana training programme for ASHA workers, Anganwadi workers and ANMs on emotional resilience, coping strategies and handling everyday challenges while prioritising personal well-being. Trainer: Aravind VP. With HLL Lifecare Limited and HLL Management Academy.',
    category: 'training',
    initiative: 'navajeevana',
    // The poster reads "31 November 2026", which is not a valid date, so no date or status is inferred.
    status: 'announced',
    image: img('navajeevana-aaa-training', 'Poster for the AAA Training programme for ASHA workers, Anganwadi workers and ANMs'),
    instagram: 'https://www.instagram.com/p/DfKNfcCk9ve/',
    related: [],
    registration: null,
    postedOn: '2026-10-31',
    priority: 5,
    source: 'Instagram @navajeevana_',
  },
  {
    id: 'un-day-expert-webinar-2026',
    title: 'Expert Webinar on United Nations Day: From Crisis to Resilience',
    date: '2026-10-26',
    dateLabel: null,
    time: '6:30 PM IST',
    location: 'Online (Zoom)',
    description:
      'A Youth for Action expert webinar on the future of humanitarian action, with Vrindhanath M. C., Programme Officer, United Nations Mine Action Service (UNMAS), Nigeria. Organised in association with the Department of Disaster Management, Loyola College, Thiruvananthapuram.',
    category: 'webinar',
    initiative: 'yfa',
    status: 'completed',
    image: img('un-day-expert-webinar', 'Poster for the Expert Webinar in observance of United Nations Day'),
    instagram: 'https://www.instagram.com/p/De02n9Dzubs/',
    related: [],
    registration: null, // registration was via a QR code on the poster; no link was published
    postedOn: '2026-10-22',
    priority: 0,
    source: 'Instagram @youth_4_action',
  },
  {
    id: 'udid-awareness-2026',
    title: 'Understanding the UDID card',
    date: null,
    dateLabel: 'Posted 28 Oct 2026',
    time: null,
    location: null,
    description:
      'An awareness campaign explaining the Unique Disability ID (UDID) and how it helps persons with disabilities — "Inclusion is not charity. It is a right."',
    category: 'awareness',
    initiative: null,
    status: 'completed',
    image: img('udid-awareness', 'Campaign graphic: Unique Disability ID (UDID) — one ID, easier access, greater inclusion'),
    instagram: 'https://www.instagram.com/p/DfCWdY5E8fQ/',
    related: [],
    registration: null,
    postedOn: '2026-10-28',
    priority: 0,
    source: 'Instagram @nadi.india',
  },
  {
    id: 'youth-room-debate-3',
    title: 'The Youth Room — Debate Series 3',
    date: '2026-10-18',
    dateLabel: null,
    time: '4:00 PM onwards',
    location: 'Kappiness Mental Health Café & Therapeutic Centre, Thiruvananthapuram',
    description:
      'An open youth debate: "Job ready or just degree ready? Who is responsible for youth employability?" Participants debated whether higher education should prepare graduates for degrees or for the workforce. Free entry, with participation certificates. Presented with Tatvika Avalokanam.',
    category: 'dialogue',
    initiative: 'yfa',
    status: 'completed',
    image: img('youth-room-debate-3', 'Participants seated in a circle during The Youth Room debate at Kappiness'),
    instagram: 'https://www.instagram.com/p/Deqa3iOD3Gf/',
    related: ['https://www.instagram.com/p/Ded6nGdvKyX/'],
    registration: null,
    postedOn: '2026-10-18',
    priority: 0,
    source: 'Instagram @youth_4_action',
  },
  {
    id: 'job-drive-atm-custodian-2026',
    title: 'Job Drive — ATM Operations (Custodian)',
    date: '2026-10-14',
    dateLabel: null,
    time: '10:00 AM',
    location: 'Two-Thirds Foundation Community Space, Perumathura, Thiruvananthapuram',
    description:
      'A Youth for Action job drive for 20 ATM Operations (Custodian) vacancies, organised by NADI Foundation with Two-Thirds Foundation and Hitachi — a step towards bringing youth closer to employment opportunities.',
    category: 'livelihood',
    initiative: 'yfa',
    status: 'completed',
    image: img('job-drive-atm-custodian', 'Candidates attending a session at the job drive in Perumathura'),
    instagram: 'https://www.instagram.com/p/Deg6WSMj8PU/',
    related: ['https://www.instagram.com/p/DebdDZZz5xW/'],
    registration: null,
    postedOn: '2026-10-15',
    priority: 0,
    source: 'Instagram @youth_4_action, @nadi.india',
  },
  {
    id: 'ekatva-convocation-2026',
    title: 'EKATVA Convocation Ceremony',
    date: '2026-06-12',
    dateLabel: null,
    time: null,
    location: 'EMS Hall, District Panchayat, Ernakulam',
    description:
      '17 transgender beneficiaries who completed the beautician training programme — written, practical and viva assessments — were recognised with certificates and mementos.',
    category: 'milestone',
    initiative: 'ekatva',
    status: 'completed',
    image: { src: '/assets/img/ekatva-convocation.webp', alt: 'EKATVA beneficiaries in graduation gowns at the convocation ceremony' },
    instagram: null,
    related: [],
    registration: null,
    postedOn: null,
    priority: 0,
    source: 'Annual Report 2025–2026',
  },
]

// ───────────────────────── access layer (swap for Supabase later) ─────────────────────────

/** Status is derived from the date when one is known, so a past event can never be shown as upcoming. */
export function resolveStatus(e, today = new Date()) {
  if (e.date) {
    const d = new Date(`${e.date}T23:59:59`)
    return d >= today ? 'upcoming' : 'completed'
  }
  return e.status === 'upcoming' ? 'announced' : e.status // undated items are never "upcoming"
}

const sortKey = (e) => e.date || e.postedOn || '0000-00-00'

/** Returns { upcoming, recent } — each sorted for display. Async-shaped so a fetch can replace it. */
export async function getEvents({ today = new Date() } = {}) {
  const all = EVENTS.filter((e) => e.published !== false).map((e) => ({ ...e, status: resolveStatus(e, today) }))
  const upcoming = all.filter((e) => e.status === 'upcoming')
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)) || b.priority - a.priority)
  const recent = all.filter((e) => e.status !== 'upcoming')
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.priority - a.priority || sortKey(b).localeCompare(sortKey(a)))
  return { upcoming, recent }
}

export const STATUS_LABEL = { upcoming: 'Upcoming', ongoing: 'Ongoing', completed: 'Completed', announced: 'Announced' }

/** Future events page. Set `ready: true` once /events exists; until then "View all" opens NADI's Instagram feed. */
export const EVENTS_PAGE = { ready: false, path: '/events', fallback: 'https://www.instagram.com/nadi.india/' }
