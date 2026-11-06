# Hero video slot — footage required

The homepage hero is built to play an authentic NADI Foundation video. No NADI footage was
available when the site was built, so it currently plays a "photo film" of real Annual Report
photographs instead. Unrelated stock footage must not be used here.

## What to supply

| | Recommendation |
|---|---|
| Content | Real NADI footage: Youth for Action field visits and campaigns, Prabodhini classes, Kappiness sessions, EKATVA training/convocation, Navajeevana community sessions, volunteers together |
| Length | 15–30 s, loopable (cut so the last frame flows into the first) |
| Framing | 16:9 landscape, 1920×1080; keep faces/action in the upper two-thirds (the bottom third is covered by the NADI FOUNDATION type) |
| Look | Calm, slow movement; no burned-in text or logos; no audio needed (it plays muted) |
| Files | `nadi-hero.mp4` (H.264, ~4–6 Mbps, < 8 MB) and optionally `nadi-hero.webm` (VP9) |
| Poster | First frame as `nadi-hero-poster.webp` (1920 px wide) |
| Consent | Only footage NADI owns and has consent to publish, especially for children and beneficiaries |

## How to enable

1. Put the files in this folder (`public/assets/video/`).
2. In `src/data/nadi.js` set:

```js
export const heroVideo = {
  src: '/assets/video/nadi-hero.mp4',
  webm: '/assets/video/nadi-hero.webm',
  poster: '/assets/video/nadi-hero-poster.webp',
}
```

The hero autoplays muted and inline, loops, shows the poster while loading, falls back to the
photo film if the video fails, and shows a still image for visitors who prefer reduced motion or
have data-saver turned on.
