/**
 * The 17 UN Sustainable Development Goals — official names, colours and goal statements.
 * Icons: official UN SDG icons (via Wikimedia Commons), stored in /public/assets/sdg/.
 *
 * NADI mapping — `initiatives` lists ONLY the documented links: the SDG icons printed beside each
 * project in the official NADI pamphlet, corroborated by the Annual Report 2025–2026
 * (e.g. Prabodhini: "aligned with SDG Goals 4 and 10", AR p11).
 *   Kappiness → 3, 10          Prabodhini → 4, 10          Youth for Action → 17, 5, 16, 10
 *   Ekatva → 8, 10, 5          Navajeevana → 3, 1, 8, 10
 * Goals without a documented NADI link show the official information only.
 */
const icon = (n) => `/assets/sdg/sdg-${String(n).padStart(2, '0')}.svg`

export const SDGS = [
  { n: 1, name: 'No Poverty', color: '#E5243B', statement: 'End poverty in all its forms everywhere.', initiatives: ['navajeevana'] },
  { n: 2, name: 'Zero Hunger', color: '#DDA63A', statement: 'End hunger, achieve food security and improved nutrition and promote sustainable agriculture.', initiatives: [] },
  { n: 3, name: 'Good Health and Well-being', color: '#4C9F38', statement: 'Ensure healthy lives and promote well-being for all at all ages.', initiatives: ['kappiness', 'navajeevana'] },
  { n: 4, name: 'Quality Education', color: '#C5192D', statement: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.', initiatives: ['prabodhini'] },
  { n: 5, name: 'Gender Equality', color: '#FF3A21', statement: 'Achieve gender equality and empower all women and girls.', initiatives: ['ekatva', 'yfa'] },
  { n: 6, name: 'Clean Water and Sanitation', color: '#26BDE2', statement: 'Ensure availability and sustainable management of water and sanitation for all.', initiatives: [] },
  { n: 7, name: 'Affordable and Clean Energy', color: '#FCC30B', statement: 'Ensure access to affordable, reliable, sustainable and modern energy for all.', initiatives: [] },
  { n: 8, name: 'Decent Work and Economic Growth', color: '#A21942', statement: 'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.', initiatives: ['ekatva', 'navajeevana'] },
  { n: 9, name: 'Industry, Innovation and Infrastructure', color: '#FD6925', statement: 'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.', initiatives: [] },
  { n: 10, name: 'Reduced Inequalities', color: '#DD1367', statement: 'Reduce inequality within and among countries.', initiatives: ['kappiness', 'prabodhini', 'yfa', 'ekatva', 'navajeevana'] },
  { n: 11, name: 'Sustainable Cities and Communities', color: '#FD9D24', statement: 'Make cities and human settlements inclusive, safe, resilient and sustainable.', initiatives: [] },
  { n: 12, name: 'Responsible Consumption and Production', color: '#BF8B2E', statement: 'Ensure sustainable consumption and production patterns.', initiatives: [] },
  { n: 13, name: 'Climate Action', color: '#3F7E44', statement: 'Take urgent action to combat climate change and its impacts.', initiatives: [] },
  { n: 14, name: 'Life Below Water', color: '#0A97D9', statement: 'Conserve and sustainably use the oceans, seas and marine resources for sustainable development.', initiatives: [] },
  { n: 15, name: 'Life on Land', color: '#56C02B', statement: 'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.', initiatives: [] },
  { n: 16, name: 'Peace, Justice and Strong Institutions', color: '#00689D', statement: 'Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.', initiatives: ['yfa'] },
  { n: 17, name: 'Partnerships for the Goals', color: '#19486A', statement: 'Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.', initiatives: ['yfa'] },
].map((g) => ({ ...g, icon: icon(g.n) }))

/** Indices (into SDGS) of the goals with a documented NADI contribution — the ONLY goals the wheel
 *  auto-rotates through. Derived from the data, so adding a verified link updates the rotation. */
export const VERIFIED = SDGS.map((g, i) => (g.initiatives.length ? i : -1)).filter((i) => i >= 0)

/** What each initiative does towards a goal — drawn from the pamphlet / Annual Report wording. */
export const SDG_CONTRIBUTION = {
  kappiness: {
    3: 'Professional counselling, therapy and mental health awareness in an accessible, stigma-free café space.',
    10: 'Stigma-free, LGBTQ+ friendly therapy and outreach that widens access to mental health support.',
  },
  prabodhini: {
    4: 'After-school academic support, rural resource libraries and mentorship for children in tribal communities.',
    10: 'Educational inclusion for tribal children in Amboori Panchayat.',
  },
  yfa: {
    5: "Youth-led campaigns on gender equality and women's empowerment, including National Girl Child Day.",
    10: 'Community visits and social inclusion programmes led by young volunteers.',
    16: 'Youth engagement with governance, democracy, constitutional rights and civic responsibility.',
    17: 'An incubation platform equipping the next generation with leadership, volunteerism, empirical field research and community development skills.',
  },
  ekatva: {
    5: 'Identity affirmation and empowerment for transgender individuals.',
    8: 'Certified beautician and driving skill development towards employment and self-employment.',
    10: 'Inclusion, dignity and economic independence for transgender communities.',
  },
  // Navajeevana: the documents give no goal-specific detail, so its pamphlet description is shown.
}
