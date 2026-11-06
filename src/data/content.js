export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'SDGs', to: '/sdgs' },
  { label: 'Research', to: '/research' },
  { label: 'Stories', to: '/stories' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Team', to: '/team' },
  { label: 'Get Involved', to: '/get-involved' },
]
export const donateRoute = { label: 'Donate', to: '/donate' }
export const volunteerRoute = donateRoute // keeps the Footer and other old imports working

export const contact = {
  address: 'EVRA 325A, Easwaravilasam Lane, Vazhuthacaud, Thiruvananthapuram, Kerala 695014',
  phone: '9567191761',
  email: 'nadifoundationkerala@gmail.com',
  website: 'nadi.ngo',
  socials: [
    { label: 'Instagram · nadi.india', href: 'https://www.instagram.com/nadi.india', icon: 'instagram' },
    { label: 'Instagram · kappi_ness', href: 'https://www.instagram.com/kappi_ness', icon: 'instagram' },
    { label: 'Facebook · Nadifoundationkerala', href: 'https://www.facebook.com/Nadifoundationkerala', icon: 'facebook' },
  ],
}
const q = encodeURIComponent(contact.address)
export const mapEmbed = `https://www.google.com/maps?q=${q}&output=embed`
export const mapDirections = `https://www.google.com/maps/dir/?api=1&destination=${q}`

// Official SDG colours (UN)
export const sdgs = {
  3: { n: 3, name: 'Good Health and Well-being', color: '#4C9F38' },
  4: { n: 4, name: 'Quality Education', color: '#C5192D' },
  5: { n: 5, name: 'Gender Equality', color: '#FF3A21' },
  8: { n: 8, name: 'Decent Work and Economic Growth', color: '#A21942' },
  10: { n: 10, name: 'Reduced Inequalities', color: '#DD1367' },
  16: { n: 16, name: 'Peace, Justice and Strong Institutions', color: '#00689D' },
  17: { n: 17, name: 'Partnerships for the Goals', color: '#19486A' },
}

export const projects = [
  {
    id: 'kappiness', name: 'KAPPINESS', focus: 'Mental Health Café & Therapeutic Centre',
    desc: 'A café and therapeutic centre where wellbeing conversations and professional mental health support meet in a calm, welcoming space.',
    sdgs: [3, 10], doodle: 'cup', mask: 'arch',
    c: { bg: '#4A2C1A', mid: '#B97A3E', accent: '#E8C08A', light: '#F6EAD7' },
  },
  {
    id: 'prabodhini', name: 'PRABODHINI', focus: 'Quality education for tribal children',
    desc: 'Quality education and educational inclusion for tribal children — opening doors to learning, confidence and opportunity.',
    sdgs: [4, 10], doodle: 'book', mask: 'tilt',
    c: { bg: '#F3CE68', mid: '#2F6FA8', accent: '#7DB38A', light: '#FFF6D6', dark: true },
  },
  {
    id: 'youth-for-action', name: 'YOUTH FOR ACTION', focus: 'Youth leadership, volunteering & community action',
    desc: 'Youth leadership, volunteering and community action — young people stepping up to address the issues that matter around them.',
    sdgs: [5, 10, 16, 17], doodle: 'person', mask: 'circle',
    c: { bg: '#2B3FD1', mid: '#8B4FD9', accent: '#EF8875', light: '#E6E9FF' },
  },
  {
    id: 'ekatva', name: 'EKATVA', focus: 'Transgender empowerment & livelihoods',
    desc: 'Transgender empowerment through skills, mental health support and livelihood opportunities.',
    sdgs: [5, 8, 10], doodle: 'circles', mask: 'blob',
    c: { bg: '#B0246F', mid: '#F08A3C', accent: '#8B4FD9', light: '#FFE6F2' },
  },
  {
    id: 'navajeevana', name: 'NAVAJEEVANA', focus: 'Community health & wellbeing',
    // TODO: confirm Navajeevana's SDG mapping against the Annual Report
    desc: 'Community health and wellbeing — nurturing healthier, more resilient communities from the ground up.',
    sdgs: [3], doodle: 'leaf', mask: 'leaf',
    c: { bg: '#1F5E3B', mid: '#8CC7E8', accent: '#C9A26B', light: '#E4F3E6' },
  },
]

// Figures exactly as supplied (Annual Report 2025–2026 / pamphlet). Never combine across groups.
export const impact = {
  source: 'Reported in the 2025–2026 Annual Report',
  org: [
    { v: 5000, s: '+', l: 'Beneficiaries reached' },
    { v: 1000, s: '+', l: 'Active volunteers' },
    { v: 18, s: '', l: 'Staff members' },
  ],
  community: [
    { v: 30000, s: '+', l: 'Volunteering hours' },
    { v: 1000, s: '+', l: 'Community visits & field engagements' },
    { v: 50, s: '+', l: 'Awareness campaigns & talk sessions' },
  ],
  yfa: [
    { v: 1500, s: '+', l: 'Youth & volunteers engaged' },
    { v: 20, s: '+', l: 'Youth-led programmes & social activities' },
    { v: 15, s: '+', l: 'Key social & community issues addressed' },
  ],
}

// TODO: paste the real Director's Message from the Annual Report 2025–2026 here (array of paragraphs).
export const director = {
  name: 'Prabin P B',
  role: 'Director & Founder',
  pullQuote: '', // short excerpt from the actual message
  paragraphs: [],
  themes: ['Empowering youth', 'Mental wellbeing', 'Stronger communities', 'Innovation', 'Compassion', 'Inclusion', 'Collective responsibility'],
}