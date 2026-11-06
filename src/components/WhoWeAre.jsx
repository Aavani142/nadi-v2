import Photo from './Photo.jsx'
import Button from './Button.jsx'
import SectionHead from './SectionHead.jsx'
import { ImageReveal, Parallax, Reveal, WordsOnScroll } from '../lib/Motion.jsx'
import { assets } from '../data/assets.js'

const meta = [
  ['Certification', 'ISO 9001:2015'],
  ['Affiliation', 'Ministry of Youth Affairs and Sports'],
  ['Headquarters', 'Thiruvananthapuram, Kerala'],
  ['Model', 'Professional, measurable development programmes'],
]

export default function WhoWeAre() {
  return (
    <section className="bg-nadi-off px-4 py-24 text-ink sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHead label="Who we are" />
        <WordsOnScroll className="mt-12 max-w-6xl font-display text-[2rem] font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[4.4rem]"
          text="NADI Foundation is an ISO 9001:2015 certified, youth-driven non-governmental organisation based in Kerala, headquartered in Thiruvananthapuram." />

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="text-lg leading-relaxed text-ink/80 sm:text-xl">Affiliated with the Ministry of Youth Affairs and Sports, NADI works to build resilient community structures through professional, measurable development programmes.</p>
            <dl className="mt-8 border-t border-ink/20">
              {meta.map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-3 border-b border-ink/20 py-3">
                  <dt className="label text-ink/50">{k}</dt><dd className="col-span-2 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8"><Button to="/about" variant="ink">Explore About Us</Button></div>
          </Reveal>

          <div className="grid grid-cols-12 items-start gap-3 sm:gap-5 lg:col-span-8">
            <Parallax offset={25} className="col-span-7"><ImageReveal className="aspect-[4/5]"><Photo src={assets.whoWeAre[0]} label="who-1.jpg · volunteers" className="h-full w-full" /></ImageReveal></Parallax>
            <div className="col-span-5 mt-16 space-y-3 sm:space-y-5">
              <ImageReveal className="aspect-square" delay={0.15}><Photo src={assets.whoWeAre[1]} label="who-2.jpg · community" className="h-full w-full" tone="#1B4468" /></ImageReveal>
              <ImageReveal className="aspect-[4/3]" delay={0.3}><Photo src={assets.whoWeAre[2]} label="who-3.jpg · workshop" className="h-full w-full" tone="#2B3A4A" /></ImageReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}