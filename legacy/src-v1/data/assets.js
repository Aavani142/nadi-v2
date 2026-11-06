// ASSET MAP — now points at the files that actually exist in /public/assets/photos.
// encodeURIComponent handles the spaces in the filenames.
const P = '/assets/photos/'
const f = (n) => P + encodeURIComponent(n)
export const assets = {
  logo: '/assets/nadi-logo.png',
  hero: [f('hero-1.jpg')], // drop your landing photo at public/assets/photos/hero-1.jpg
  whoWeAre: [],
  director: f('PRABIN.jpeg'),
  team: { prabin: f('PRABIN.jpeg'), jickson: f('JICKSON.jpeg'), sneha: f('SNEHA.jpeg') },
  areas: { mentalHealth: '', tribalEducation: '', youth: '' },
  projects: {
    kappiness: [f('KAPPINESS LOGO.jpg.jpeg')],
    prabodhini: [f('PRABODHINI LOGO.jpg.jpeg')],
    'youth-for-action': [f('YOUTH FOR ACTION LOGO.jpg.jpeg')],
    ekatva: [f('EKATVA LOGO.jpg.jpeg')],
    navajeevana: [f('NAVAJEEVANA LOGO.jpg.jpeg')],
  },
  projectPhotos: {
    // Dedicated project photography can be mapped here:
    // e.g. kappiness: f('kappiness-photo.jpg'),
  },
  volunteer: [],
}
