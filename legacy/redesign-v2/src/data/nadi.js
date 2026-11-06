/**
 * NADI Foundation — homepage content.
 *
 * Every fact here is taken from one of these sources (noted per block):
 *   [AR]  NADI Foundation Annual Report 2025–2026
 *   [PM]  NADI Foundation official pamphlet
 *   [IG]  Public Instagram grid of @nadi.india (post links only)
 * Do not add figures, events or people that are not in a source.
 */

const img = (n) => `/assets/img/${n}.webp`
const sm = (n) => `/assets/img/${n}-sm.webp`
/** Photo record. `sm` = 900px variant for small screens (only generated for large originals). */
const photo = (name, alt, { small = false } = {}) => ({
  src: img(name),
  srcSet: small ? `${sm(name)} 900w, ${img(name)} 1800w` : undefined,
  alt,
})

export const logos = {
  full: '/assets/logos/nadi-logo.png',
  // Same logo with the wordmark in ivory, for dark backgrounds (mark colours unchanged)
  onDark: '/assets/logos/nadi-logo-on-dark.png',
  mark: '/assets/logos/nadi-mark.png',
  sun: '/assets/logos/nadi-mark-sun.png',
  wave1: '/assets/logos/nadi-mark-wave1.png',
  wave2: '/assets/logos/nadi-mark-wave2.png',
  wordmark: '/assets/logos/nadi-wordmark.png',
}

export const photos = {
  volunteersMural: photo('yfa-volunteers-mural', 'Youth for Action volunteers gathered in front of a large street mural', { small: true }),
  teamNight: photo('nadi-team-night-mural', 'The NADI Foundation team seated together in front of a painted wall at night', { small: true }),
  learningPlay: photo('prabodhini-learning-through-play', 'Children and NADI volunteers outdoors with a "Learning through play" banner', { small: true }),
  mindfulness: photo('mindfulness-session', 'Students in school uniform seated on mats during a mindfulness session', { small: true }),
  sandSculpture: photo('girl-child-day-sand-sculpture', 'Volunteers standing behind a large sand sculpture made for National Girl Child Day', { small: true }),
  campus: photo('youth-gathering-campus', 'A large group of young volunteers and officials gathered outdoors', { small: true }),
  hivDay: photo('hiv-aids-awareness-day', 'Youth volunteers holding an HIV/AIDS awareness day banner'),
  bannerCampaign: photo('youth-banner-campaign', 'Volunteers holding a campaign banner outside an institution'),
  capacity: photo('capacity-building-session', 'Participants seated in a circle during a training session'),
  digitalLiteracy: photo('digital-literacy-training', 'A facilitator leading a digital literacy skill training session'),
  communityVisit: photo('community-visit', 'Young volunteers during a community visit'),
  kappinessGarden: photo('kappiness-garden-entrance', 'The leafy garden entrance of Kappiness Mental Health Café & Therapeutic Centre', { small: true }),
  kappinessReading: photo('kappiness-reading-corner', 'A reading corner with bean bags, books, records and a guitar at Kappiness', { small: true }),
  kappinessRoom: photo('kappiness-therapy-room', 'A calm counselling room with armchairs at Kappiness', { small: true }),
  kappinessCottage: photo('kappiness-cottage', 'A small cottage among trees at Kappiness'),
  prabodhiniGroup: photo('prabodhini-school-group', 'Prabodhini volunteers with schoolchildren outside a lower primary school'),
  prabodhiniGroup2: photo('prabodhini-school-group-2', 'Children and volunteers gathered in a school courtyard'),
  prabodhiniClass: photo('prabodhini-classroom', 'Children holding up their work in a classroom'),
  prabodhiniActivity: photo('prabodhini-activity', 'Children taking part in a hands-on learning activity'),
  ekatvaConvocation: photo('ekatva-convocation', 'EKATVA beneficiaries in graduation gowns at the convocation ceremony', { small: true }),
  ekatvaOrientation: photo('ekatva-orientation', 'Participants at an EKATVA orientation session', { small: true }),
  ekatvaBanner: photo('ekatva-orientation-banner', 'EKATVA beneficiaries in front of the orientation programme banner'),
  ekatvaBeautician: photo('ekatva-beautician-training', 'A beautician training session under the EKATVA programme'),
  ekatvaDriving: photo('ekatva-driving-school', 'EKATVA driving trainees with a KSRTC driving school bus'),
  ekatvaTwoWheeler: photo('ekatva-two-wheeler', 'An EKATVA trainee during two-wheeler driving practice'),
  ekatvaLibrary: photo('ekatva-group-library', 'EKATVA participants and team gathered outside a library'),
  navCaregivers: photo('navajeevana-caregivers-session', 'Women seated in a circle during a Navajeevana community session'),
  navTaskForce: photo('navajeevana-youth-task-force', 'Participants of the Navajeevana Youth Task Force Training'),
  girlChildVolunteers: photo('girl-child-day-volunteers', 'Volunteers in National Girl Child Day T-shirts on a beach'),
  pressHindu: photo('press-the-hindu', 'The Hindu newspaper feature on Kappiness'),
  pressKaapi: photo('press-kaapi-for-the-soul', 'Newspaper feature titled "Kaapi for the soul"'),
  pressConversations: photo('press-where-conversations', 'The Hindu feature titled "Where conversations create change"'),
  pressStigma: photo('press-break-stigma', 'Newspaper feature titled "Kappiness to break mental health stigma"'),
  prabin: { src: img('prabin'), alt: 'Portrait of Prabin P B' },
  sneha: { src: img('sneha'), alt: 'Portrait of Sneha Padayan' },
  jickson: { src: img('jickson'), alt: 'Portrait of Jickson Punnoose' },
}

/** Images the intro waits for before revealing the hero. */
export const criticalImages = [logos.onDark]

// ───────────────────────── Navigation ─────────────────────────
// Section links scroll on the homepage (and route home first from other pages).
// Donate is the single call to action and opens its own page.
export const nav = [
  { id: 'about', label: 'About', section: 'about' },
  { id: 'work', label: 'Our Work', section: 'work' },
  { id: 'impact', label: 'Impact', section: 'impact' },
  { id: 'stories', label: 'Stories', section: 'stories' },
  { id: 'news', label: 'News', section: 'news' },
  { id: 'team', label: 'Team', section: 'team' },
]
export const donateLink = { label: 'Donate', path: '/donate' }

/**
 * Online giving. No payment link was supplied with the source material, so the Donate page asks
 * donors to write or call. When NADI has a payment page (Razorpay, UPI intent link, etc.), set
 * `url` here and the Donate page shows a "Give online" button automatically.
 */
export const donation = {
  url: '',
  upi: '', // e.g. 'nadifoundation@bank' — shown on the Donate page when set
}

// Hero film. No NADI video footage was available at build time.
// Drop an optimised clip at /public/assets/video/nadi-hero.mp4 (+ .webm) and set `src` below;
// until then the hero plays a cinematic sequence of real Annual Report photographs.
// Recommended spec: see /public/assets/video/README.md
export const heroVideo = {
  src: '', // e.g. '/assets/video/nadi-hero.mp4'
  webm: '', // e.g. '/assets/video/nadi-hero.webm'
  poster: '/assets/img/yfa-volunteers-mural.webp',
}

// ───────────────────────── Organisation [PM][AR] ─────────────────────────
export const org = {
  name: 'NADI Foundation',
  vision: 'Equity, Equality & Innovation',
  mission: 'Collective Action & Sustainability',
  // [PM] "Who we are"
  whoWeAre:
    'NADI Foundation is an ISO 9001:2015 certified, youth-driven non-governmental organisation based in Kerala and headquartered in Thiruvananthapuram. Affiliated with the Ministry of Youth Affairs and Sports, it works to build resilient community structures through professional, measurable development programmes.',
  // [PM] "Our approach"
  approach:
    'We work at the grassroots level to solve complex social challenges in mental health, education and community development — and we hold that work to international standards of transparency, accountability and long-term impact.',
  // [User brief] hero introduction
  intro: 'NADI Foundation is a youth-driven organisation working to strengthen communities through mental health, education, youth leadership and sustainable development.',
  // [AR p1] Director's Message — verbatim
  commitment: 'Lasting development is built on participation, resilience, and shared responsibility.',
  facts: [
    { k: 'Established', v: '10 September 2022' }, // [AR p5]
    { k: 'Headquarters', v: 'Vazhuthacaud, Thiruvananthapuram' },
    { k: 'Operational districts', v: 'Thiruvananthapuram · Wayanad · Ernakulam · Pathanamthitta' }, // [AR p5]
    { k: 'Working areas', v: 'Mental health · Tribal education · Youth & community development' },
    { k: 'Certification', v: 'ISO 9001:2015 certified' },
    { k: 'Registration', v: 'Societies Registration Act, 1860 · Reg. No. TVM/TC/668/2022' },
    { k: 'NGO Darpan', v: 'KL/2023/0345250' },
    { k: 'Tax status', v: '12A & 80G certified' }, // [PM]
  ],
}

// ───────────────────────── Initiatives [PM][AR] ─────────────────────────
// SDG numbers are those printed beside each project in the pamphlet.
export const sdgColors = { 1: '#E5243B', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21', 8: '#A21942', 10: '#DD1367', 16: '#00689D', 17: '#19486A' }
export const sdgNames = { 1: 'No Poverty', 3: 'Good Health & Well-being', 4: 'Quality Education', 5: 'Gender Equality', 8: 'Decent Work & Economic Growth', 10: 'Reduced Inequalities', 16: 'Peace, Justice & Strong Institutions', 17: 'Partnerships for the Goals' }

// Official UN SDG names; initiative mapping as printed in the pamphlet.
export const sdgGoals = [
  { n: 1, name: 'No Poverty', by: ['Navajeevana'] },
  { n: 3, name: 'Good Health and Well-being', by: ['Kappiness', 'Navajeevana'] },
  { n: 4, name: 'Quality Education', by: ['Prabodhini'] },
  { n: 5, name: 'Gender Equality', by: ['Youth for Action', 'Ekatva'] },
  { n: 8, name: 'Decent Work and Economic Growth', by: ['Ekatva', 'Navajeevana'] },
  { n: 10, name: 'Reduced Inequalities', by: ['Kappiness', 'Prabodhini', 'Youth for Action', 'Ekatva', 'Navajeevana'] },
  { n: 16, name: 'Peace, Justice and Strong Institutions', by: ['Youth for Action'] },
  { n: 17, name: 'Partnerships for the Goals', by: ['Youth for Action'] },
]

export const initiatives = {
  kappiness: {
    name: 'Kappiness',
    theme: 'Good Health & Well-being',
    focus: 'Mental Health Café & Therapeutic Centre',
    logo: '/assets/logos/kappiness.webp',
    lede: "India's first Mental Health Café and Therapeutic Centre — professional counselling and therapy in an accessible, stigma-free environment.", // [PM]
    body: 'A flagship initiative of NADI Foundation, Kappiness brings together professional mental health services, awareness programmes, therapeutic activities, creative engagement and community outreach in a welcoming space.', // [AR p6]
    stats: [ // [AR p7] "Kappiness at a glance"
      { v: 10, s: '+', l: 'Celluloid movie screenings & discussions' },
      { v: 8, s: '+', l: 'Talk, interactive & thematic sessions' },
      { v: 10, s: '+', l: 'Mental health awareness sessions & programmes' },
      { v: 12, s: '+', l: 'Outreach activities, stalls & digital campaigns' },
    ],
    sdgs: [3, 10],
    instagram: 'https://www.instagram.com/kappi_ness/',
  },
  prabodhini: {
    name: 'Prabodhini',
    theme: 'Quality Education',
    focus: 'Educational inclusion for tribal communities',
    logo: '/assets/logos/prabodhini.webp',
    lede: 'Advancing educational inclusion for children in tribal communities of Amboori Panchayat through rural resource libraries and structured mentorship networks.', // [PM]
    body: 'After-school academic support, skills training and creative learning environments — from school libraries and book donation drives to daily classes and the "100 Rupees Challenge" for building library resources.', // [AR p11]
    flow: ['Learn', 'Participate', 'Understand', 'Practise', 'Build confidence'], // [AR p13]
    place: 'Amboori Panchayat',
    sdgs: [4, 10],
  },
  yfa: {
    name: 'Youth for Action',
    theme: 'Partnerships for the Goals',
    focus: 'Youth engagement & social action',
    logo: '/assets/logos/youth-for-action.webp',
    lede: 'An incubation platform equipping the next generation with leadership, volunteerism, empirical field research and community development skills.', // [PM]
    body: 'Young people move from passive participants to active contributors through community outreach, field visits, awareness campaigns, public health initiatives, environmental action and leadership development.', // [AR p15]
    flow: ['Learn', 'Engage', 'Volunteer', 'Lead', 'Create impact'], // [AR p15]
    sdgs: [17, 5, 16, 10],
    instagram: 'https://www.instagram.com/youth_4_action/',
  },
  ekatva: {
    name: 'Ekatva',
    theme: 'Equality & Decent Work',
    focus: 'Strengthening transgender lives through skill development and mental health',
    logo: '/assets/logos/ekatva.webp',
    lede: 'Strengthening transgender lives through certified vocational training, identity affirmation and financial literacy for sustainable livelihoods.', // [PM]
    body: 'Implemented in collaboration with HLL Lifecare Limited, EKATVA combines beautician skill development in Ernakulam and driving skill development in Thiruvananthapuram with integrated mental health and psychosocial support.', // [AR p24]
    stats: [ // [AR p25]
      { v: 40, s: '+', l: 'Transgender beneficiaries supported through skill development & related interventions' },
      { v: 17, s: '', l: 'Beautician course beneficiaries recognised at convocation' },
      { v: 2, s: '', l: 'Skill tracks — beautician & driving training' },
      { v: 2, s: '', l: 'Project locations — Ernakulam & Thiruvananthapuram' },
    ],
    milestone: 'EKATVA Convocation Ceremony · 12 June 2026 · EMS Hall, District Panchayat, Ernakulam', // [AR p32]
    sdgs: [8, 10, 5],
  },
  navajeevana: {
    name: 'Navajeevana',
    theme: 'Good Health & Well-being',
    focus: 'Community health & wellbeing',
    logo: '/assets/logos/navajeevana.webp',
    lede: 'A care network strengthening community health and well-being. It trains youth to lead local responses, supports family caregivers, and builds emotional resilience for ASHA workers.', // [PM]
    place: 'Thavinhal Panchayat, Wayanad',
    sdgs: [3, 1, 8, 10],
    instagram: 'https://www.instagram.com/navajeevana_/',
  },
}

// ───────────────────────── Impact [AR] ─────────────────────────
// Kept in their original reporting contexts. Never sum across groups.
export const impact = {
  profile: { // [AR p5] Organisation profile
    context: 'Organisation profile',
    items: [
      { v: 5000, s: '+', l: 'Beneficiaries reached' },
      { v: 1000, s: '+', l: 'Active volunteers' },
      { v: 18, s: '', l: 'Staff strength' },
    ],
  },
  yfa: { // [AR p16] Youth for Action at a glance — "Year-round youth engagement and community participation"
    context: 'Youth for Action at a glance',
    note: 'Year-round youth engagement and community participation',
    items: [
      { v: 1500, s: '+', l: 'Youth & volunteers engaged' },
      { v: 30000, s: '+', l: 'Volunteering hours' },
      { v: 1000, s: '+', l: 'Community visits & field engagements' },
      { v: 50, s: '+', l: 'Public awareness & social campaigns' },
      { v: 20, s: '+', l: 'Youth-led programmes & social activities' },
      { v: 15, s: '+', l: 'Key social & community issues addressed' },
    ],
  },
}

// ───────────────────────── Stories [AR] ─────────────────────────
// Captions describe what the Annual Report documents alongside each photograph.
export const stories = {
  featured: {
    photo: photos.sandSculpture,
    tag: 'Youth for Action · Gender equality',
    title: 'National Girl Child Day',
    text: "A sand sculpture and public awareness activity highlighting girls' empowerment, gender equality, equal opportunities and the rights and potential of every girl child.",
  },
  grid: [
    { photo: photos.mindfulness, tag: 'Youth wellbeing', title: 'Making room for mental health', text: 'Programmes such as Euphoria, Meraki, Koode and Mind at Ease encouraged emotional expression and open conversations.' },
    { photo: photos.ekatvaBeautician, tag: 'EKATVA · Ernakulam', title: 'Beautician skill development', text: 'Hands-on training from makeup and hair styling to saree draping, nettipattom making and parlour management.' },
    { photo: photos.hivDay, tag: 'Public health', title: 'HIV/AIDS awareness', text: 'Volunteers worked on reducing stigma, improving awareness and encouraging early detection and support.' },
    { photo: photos.ekatvaDriving, tag: 'EKATVA · Thiruvananthapuram', title: 'Driving skill development', text: "Support from learner's licence procedures to two-wheeler, four-wheeler and heavy vehicle training." },
    { photo: photos.prabodhiniGroup, tag: 'Prabodhini', title: 'Learning beyond the classroom', text: 'Summer learning kept children engaged during school holidays through creativity, play and skill building.' },
  ],
  strip: [
    { photo: photos.capacity, label: 'Capacity building' },
    { photo: photos.ekatvaOrientation, label: 'EKATVA orientation' },
    { photo: photos.digitalLiteracy, label: 'Digital literacy training' },
    { photo: photos.prabodhiniClass, label: 'Prabodhini classroom' },
    { photo: photos.campus, label: 'Youth for Action' },
    { photo: photos.kappinessReading, label: 'Kappiness' },
    { photo: photos.ekatvaLibrary, label: 'EKATVA' },
    { photo: photos.prabodhiniActivity, label: 'Prabodhini' },
    { photo: photos.bannerCampaign, label: 'Awareness campaign' },
  ],
}

// [AR pp33–35] Press coverage
export const press = {
  outlets: ['The Hindu', 'The Indian Express', 'The Times of India', 'Mathrubhumi', 'Malayala Manorama', 'Reporter TV'],
  clippings: [photos.pressHindu, photos.pressKaapi, photos.pressConversations, photos.pressStigma],
}

// [IG] Recent public posts on the @nadi.india grid (retrieved 4 Nov 2026). Links only — captions were not available.
export const instagramPosts = [
  { account: 'nadi.india', date: '30 Oct 2026', type: 'Photo series', url: 'https://www.instagram.com/p/DfHXneTEyv5/' },
  { account: 'navajeevana_', date: '31 Oct 2026', type: 'Photo series', url: 'https://www.instagram.com/p/DfKNfcCk9ve/' },
  { account: 'nadi.india', date: '28 Oct 2026', type: 'Photo series', url: 'https://www.instagram.com/p/DfCWdY5E8fQ/' },
  { account: 'navajeevana_', date: '28 Oct 2026', type: 'Reel', url: 'https://www.instagram.com/reel/DfCVebEzR4a/' },
  { account: 'youth_4_action', date: '22 Oct 2026', type: 'Photo', url: 'https://www.instagram.com/p/De02n9Dzubs/' },
  { account: 'youth_4_action', date: '18 Oct 2026', type: 'Photo series', url: 'https://www.instagram.com/p/Deqa3iOD3Gf/' },
  { account: 'youth_4_action', date: '15 Oct 2026', type: 'Photo series', url: 'https://www.instagram.com/p/Deg6WSMj8PU/' },
  { account: 'nadi.india', date: '13 Oct 2026', type: 'Photo', url: 'https://www.instagram.com/p/DebdDZZz5xW/' },
]

// ───────────────────────── Leadership [AR p2–3] ─────────────────────────
export const leadership = {
  director: { name: 'Prabin P B', role: 'Director & Founder', photo: photos.prabin },
  cofounders: [
    { name: 'Sneha Padayan', role: 'Co-founder', photo: photos.sneha },
    { name: 'Jickson Punnoose', role: 'Co-founder', photo: photos.jickson },
  ],
  // Verbatim excerpts from the Director's Message, Annual Report 2025–2026
  quote: 'For us, innovation is not merely about introducing new ideas — it is about finding better ways to address social challenges with compassion, inclusion, and collaboration.',
  message:
    'Every initiative we undertake is guided by a clear purpose: to empower youth, promote mental well-being, strengthen communities, and enhance the quality of life for all.',
}

// ───────────────────────── Get involved [PM] ─────────────────────────
export const contact = {
  phone: '9567191761',
  phoneDisplay: '+91 95671 91761',
  email: 'nadifoundationkerala@gmail.com',
  website: 'nadi.ngo',
  address: ['TC 16/233 EVRA 325 A,', 'Eswaravilasam Road, Jagathy,', 'Near Carmel Higher Secondary School,', 'Vazhuthacaud, Thiruvananthapuram, Kerala'],
  maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('EVRA 325A Eswaravilasam Road, Vazhuthacaud, Thiruvananthapuram, Kerala 695014'),
  socials: [
    { label: 'Instagram', handle: '@nadi.india', href: 'https://www.instagram.com/nadi.india/' },
    { label: 'Instagram', handle: '@kappi_ness', href: 'https://www.instagram.com/kappi_ness/' },
    { label: 'Facebook', handle: 'Nadifoundationkerala', href: 'https://www.facebook.com/Nadifoundationkerala' },
  ],
}

const mail = (subject, body) => `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
export const ctas = {
  contact: { label: 'Get in Touch', href: `mailto:${'nadifoundationkerala@gmail.com'}?subject=${encodeURIComponent('Hello NADI Foundation')}` },
  volunteer: { label: 'Volunteer', href: mail('Volunteer enquiry — NADI Foundation', 'Hello NADI team,\n\nI would like to volunteer with NADI Foundation.\n\nName:\nPhone:\nCollege / organisation (if any):\nAreas of interest:\n') },
  partner: { label: 'Collaborate', href: mail('Partnership enquiry — NADI Foundation', 'Hello NADI team,\n\nWe would like to explore a partnership with NADI Foundation.\n\nOrganisation:\nType (CSR / academic / community):\nContact person:\nPhone:\n') },
  support: { label: 'Support NADI', href: mail('Supporting NADI Foundation', 'Hello NADI team,\n\nI would like to support NADI Foundation\'s work. Please share how I can contribute.\n\nName:\nPhone:\n') },
}

// [PM] "Engagement frameworks"
export const frameworks = [
  { k: 'Volunteer Mobilization', for: 'Individuals · Students', text: 'Join a strong, growing network of over 1,000 active changemakers driving local development.', cta: 'volunteer', photo: photos.volunteersMural },
  { k: 'Academic Alliances', for: 'Schools · Colleges · Academic organisations', text: 'Partner with us to build youth leadership through practical field research and workshops.', cta: 'partner', photo: photos.capacity },
  { k: 'Corporate CSR Partnerships', for: 'Companies · CSR teams', text: 'Align your business goals with our verified community projects to create measurable social impact.', cta: 'partner', photo: photos.campus },
  { k: 'Support & Collaborate', for: 'Donors · Supporters · Community organisations', text: 'Reach out to our main office to explore partnership avenues, support our local programmes, or connect with a regional branch near you.', cta: 'support', photo: photos.learningPlay },
]
