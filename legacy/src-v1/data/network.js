/**
 * NADI's network — transcribed from the collaborator pages of the Annual Report 2025–2026 (pp. 39–43),
 * using the report's own headings. Only names that are clearly legible on those pages are listed;
 * logos whose names could not be read with certainty were left out rather than guessed.
 */
export const network = [
  {
    id: 'public',
    title: 'Direct beneficiaries & collaborators',
    note: 'Government bodies, public programmes and community organisations',
    names: [
      'Ministry of Youth Affairs and Sports', 'Ministry of Women and Child Development', 'Ministry of Tribal Affairs', 'MY Bharat',
      'Nehru Yuva Kendra Sangathan', 'National Service Scheme', 'NCC', 'Directorate of Higher Secondary Education',
      'Local Self-Government Department, Kerala', 'Social Justice Department', 'Corporation of Thiruvananthapuram',
      'Kerala State Council for Child Welfare', 'Kerala State Commission for Protection of Child Rights', 'State Election Commission, Kerala',
      'Kerala State Excise Department', 'Kudumbashree', 'Mission Shakti', 'Beti Bachao Beti Padhao', 'POSHAN Abhiyaan',
      'HLL Lifecare Limited', 'HLL Management Academy', 'KIMSHEALTH', 'kanthari', 'Sankalp', 'People for Animals', 'Good Deeds Day',
      'Citizen Digital Foundation', 'Zero Foundation', 'Volunteer for India', 'iVolunteer', 'Enroot', 'Global Science Festival Kerala',
      'Mathrubhumi International Festival of Letters', 'Play Fest', 'YMA Library & Reading Room, Puthucurichy', 'Amuseum', 'The Dale View',
    ],
  },
  {
    id: 'institutions',
    title: 'Institutions & collaborators',
    note: 'Universities, colleges and schools',
    names: [
      'University of Kerala', 'University of Calicut', 'Mahatma Gandhi University, Kottayam', 'Sree Sankaracharya University of Sanskrit',
      'Christ University, Bengaluru', "St. Joseph's University", 'Amrita Vishwa Vidyapeetham', 'National Forensic Sciences University',
      'Inter University Centre for Disability Studies', 'Madras Christian College', 'Madras School of Social Work', 'Loyola College of Social Sciences',
      'Rajagiri College of Social Sciences', 'Bharata Mata School of Social Work', 'Mar Gregorios College of Law', 'Don Bosco Arts and Science College',
      'Marian College Kuttikkanam', 'CHMM College for Advanced Studies', 'KMM College of Arts & Science', 'Christ Nagar College, Maranalloor',
      'National College', 'St. Thomas College', 'Holy Cross Institute of Management & Technology', 'Little Flower Institute of Social Sciences and Health',
      'Hindusthan College of Arts & Science', 'DIST', 'Chinmaya Vidyalaya', 'Ideal Educational & Charitable Trust, Cherpulassery',
      'G. Karthikeyan Anusmarana Samskarika Vedhi',
    ],
  },
  {
    id: 'media',
    title: 'Media beneficiaries & collaborators',
    note: 'Press, television and digital media',
    names: [
      'The Hindu', 'The Hindu MetroPlus', 'The Indian Express', 'The Times of India', 'Press Trust of India', 'Malayala Manorama',
      'Mathrubhumi', 'Mathrubhumi News', 'mathrubhumi.com', 'Asianet News', 'Reporter TV', 'News18 Malayalam', 'Madhyamam', 'Janayugom',
    ],
  },
]

/** Research & field learning — from the Youth for Action chapter of the Annual Report and the pamphlet. */
export const research = {
  lede: 'Youth for Action is built as an incubation platform for empirical field research. Volunteers study community realities first-hand, identify problems and their root causes, and explore solutions.',
  points: [
    { k: 'Community visits & field-based learning', v: 'Volunteers visit urban areas, slums and tribal settlements across Thiruvananthapuram to understand sanitation, drainage, waste management, public health, livelihoods, infrastructure and accessibility.' },
    { k: 'Findings taken to local authorities', v: 'In some instances, community findings were presented to local authorities — youth acting in civic engagement and community advocacy.' },
    { k: 'Capacity building', v: 'Proposal drafting, project planning, community assessment, field documentation and NGO proposal development training.' },
    { k: 'Academic alliances', v: 'Partnerships with academic institutions to build youth leadership through practical field research and workshops.' },
  ],
  stat: { v: 1000, s: '+', l: 'Community visits & field engagements', context: 'Youth for Action at a glance, Annual Report 2025–2026' },
  /**
   * Published research, papers and reports. Empty until NADI supplies verified publications — never add
   * fictional entries. Shape: { title, authors, publishedOn: 'YYYY-MM-DD', summary, url, type: 'Report' | 'Paper' | 'Brief' }
   */
  publications: [],
}
