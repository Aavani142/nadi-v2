import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { photos, contact } from '../data/nadi.js'
import { lockScroll } from '../lib/SmoothScroll.jsx'
import { useMedia } from '../lib/intro.js'
import { Eyebrow, Img, Lines } from './ui.jsx'

// Every photograph is from NADI's Annual Report 2025–2026; captions describe what it documents.
const ITEMS = [
  { photo: photos.sandSculpture, caption: 'National Girl Child Day sand sculpture — Youth for Action' },
  { photo: photos.kappinessReading, caption: 'The reading corner at Kappiness' },
  { photo: photos.prabodhiniGroup, caption: 'Prabodhini learning programme' },
  { photo: photos.ekatvaBeautician, caption: 'EKATVA beautician skill development, Ernakulam' },
  { photo: photos.hivDay, caption: 'HIV/AIDS awareness campaign — Youth for Action' },
  { photo: photos.teamNight, caption: 'The NADI Foundation team and volunteers' },
  { photo: photos.kappinessCottage, caption: 'The garden at Kappiness' },
  { photo: photos.capacity, caption: 'Capacity-building session' },
  { photo: photos.ekatvaDriving, caption: 'EKATVA driving skill development, Thiruvananthapuram' },
  { photo: photos.prabodhiniClass, caption: 'A Prabodhini classroom' },
  { photo: photos.digitalLiteracy, caption: 'Digital literacy skill training' },
  { photo: photos.ekatvaTwoWheeler, caption: 'EKATVA two-wheeler training' },
  { photo: photos.navCaregivers, caption: 'A Navajeevana community session, Wayanad' },
  { photo: photos.kappinessRoom, caption: 'A counselling room at Kappiness' },
  { photo: photos.bannerCampaign, caption: 'Youth for Action awareness campaign' },
  { photo: photos.prabodhiniActivity, caption: 'Hands-on learning at Prabodhini' },
  { photo: photos.ekatvaLibrary, caption: 'EKATVA participants and team' },
  { photo: photos.communityVisit, caption: 'Youth for Action community visit' },
]

function Column({ items, offset, progress, onOpen }) {
  const y = useTransform(progress, [0, 1], [offset, -offset])
  return (
    <motion.div style={{ y }} className="flex flex-col gap-3 sm:gap-4">
      {items.map(({ item, i }) => (
        <button key={i} type="button" onClick={() => onOpen(i)} aria-label={`Open photo: ${item.caption}`}
          className="group relative block overflow-hidden rounded-[14px] bg-white/5 text-left focus-visible:outline-mustard">
          <Img photo={item.photo} sizes="(min-width:1024px) 24vw, 48vw" className="!h-auto transition-transform duration-[1s] ease-out group-hover:scale-[1.06]" />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 items-end justify-between gap-3 text-[12.5px] font-semibold leading-snug text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {item.caption}<Expand size={15} className="shrink-0" />
          </span>
        </button>
      ))}
    </motion.div>
  )
}

function Lightbox({ index, onClose, onStep }) {
  const closeRef = useRef(null)
  const touch = useRef(null)
  useEffect(() => {
    lockScroll(true); closeRef.current?.focus()
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', k)
    return () => { window.removeEventListener('keydown', k); lockScroll(false) }
  }, [onClose, onStep])
  const item = ITEMS[index]
  return (
    <motion.div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[80] flex flex-col bg-navy-deep/[.97] text-ivory"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (touch.current ?? 0); if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1) }}>
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="text-[13px] tabular-nums text-ivory/60">{index + 1} / {ITEMS.length}</p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo viewer" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-navy"><X size={18} /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-20" onClick={onClose}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img key={index} src={item.photo.src} alt={item.photo.alt} onClick={(e) => e.stopPropagation()}
            className="max-h-[74vh] max-w-full rounded-lg object-contain shadow-2xl"
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} />
        </AnimatePresence>
        <button type="button" onClick={(e) => { e.stopPropagation(); onStep(-1) }} aria-label="Previous photo" className="absolute left-3 hidden h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-navy sm:grid"><ChevronLeft /></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onStep(1) }} aria-label="Next photo" className="absolute right-3 hidden h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-navy sm:grid"><ChevronRight /></button>
      </div>
      <p className="px-5 pb-6 pt-4 text-center text-[15px] text-ivory/85 sm:px-8">{item.caption}</p>
    </motion.div>
  )
}

export default function GallerySection() {
  const ref = useRef(null)
  const wide = useMedia('(min-width: 1024px)')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const [open, setOpen] = useState(null)
  const step = useCallback((d) => setOpen((i) => (i + d + ITEMS.length) % ITEMS.length), [])
  const close = useCallback(() => setOpen(null), [])

  const cols = wide ? 4 : 2
  const columns = Array.from({ length: cols }, () => [])
  ITEMS.forEach((item, i) => columns[i % cols].push({ item, i }))
  const offsets = wide ? [40, 110, 20, 90] : [20, 60]

  return (
    <section id="gallery" ref={ref} aria-label="Gallery" className="relative overflow-hidden bg-navy-deep pb-28 pt-24 text-ivory sm:pt-32 lg:pb-40 lg:pt-40">
      <div className="frame">
        <Eyebrow tone="text-mustard">Gallery</Eyebrow>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <Lines className="display text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.9] lg:col-span-8"
            lines={['Moments,', <span key="a" className="accent text-mustard">in frame.</span>]} />
          <p className="text-[15.5px] leading-relaxed text-ivory/65 lg:col-span-4 lg:pt-5">
            Photographs from NADI's programmes, documented in the Annual Report 2025–2026. Select any photo to view it larger. More on Instagram at <a href={contact.socials[0].href} target="_blank" rel="noopener noreferrer" className="link-u text-ivory">{contact.socials[0].handle}</a>.
          </p>
        </div>
        <div className={`mt-16 grid gap-3 sm:gap-4 lg:mt-24 ${wide ? 'grid-cols-4' : 'grid-cols-2'}`}>
          {columns.map((c, k) => <Column key={k} items={c} offset={offsets[k]} progress={scrollYProgress} onOpen={setOpen} />)}
        </div>
      </div>
      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
