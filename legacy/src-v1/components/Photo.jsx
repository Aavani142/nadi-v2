import { useState } from 'react'

/** Real image if the file exists; otherwise a quiet, clearly-labelled placeholder (never a fake photo). */
export default function Photo({ src, label = 'Photo', alt, className = '', style, tone = '#16314A' }) {
  const [failed, setFailed] = useState(!src)
  if (failed) {
    return (
      <div role="img" aria-label={`Placeholder: ${label}`} style={{ background: tone, ...style }}
        className={`placeholder-lines relative flex items-end justify-start overflow-hidden ${className}`}>
        <span className="label m-3 bg-black/50 px-2 py-1 text-white/90">IMG · {label}</span>
      </div>
    )
  }
  return <img src={src} alt={alt || label} loading="lazy" onError={() => setFailed(true)} style={style} className={`object-cover ${className}`} />
}
