import { Link } from 'react-router-dom'
import { RiverLines } from '../components/ui.jsx'

/** Prepared route for pages built in a later phase. */
export default function Placeholder({ title, notFound = false }) {
  return (
    <main className="grain relative grid min-h-[80vh] place-items-center overflow-hidden bg-ivory px-5 pb-24 pt-32 text-center">
      <RiverLines className="pointer-events-none absolute inset-x-0 bottom-16 h-24 opacity-60" />
      <div className="relative">
        <p className="eyebrow text-blue">{notFound ? '404' : 'Coming soon'}</p>
        <h1 className="display mt-5 text-[clamp(3.4rem,10vw,8rem)] leading-[0.95]">{title}</h1>
        <p className="mx-auto mt-5 max-w-md text-ink/60">
          {notFound ? 'This page does not exist.' : 'This page is being prepared and will be part of the next phase of the NADI Foundation website.'}
        </p>
        <Link to="/" className="mt-9 inline-flex min-h-[48px] items-center rounded-full bg-blue px-7 text-[14px] font-semibold text-ivory transition-colors hover:bg-blue-deep">
          Back to the homepage
        </Link>
      </div>
    </main>
  )
}
