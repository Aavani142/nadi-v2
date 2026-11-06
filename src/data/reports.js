/**
 * Annual reports & publications — shown on the About page.
 *
 * EMPTY BY DESIGN: no published report PDFs were available when this site was built. Add a report
 * only when NADI supplies the approved PDF. Never add placeholder entries or fake download links.
 *
 * Report shape (maps 1:1 to a future Supabase table `reports`, snake_case columns):
 *   id           string   unique slug, e.g. 'annual-report-2025-26'
 *   title        string   e.g. 'Annual Report 2025–2026'
 *   year         string   reporting period, e.g. '2025–2026'
 *   type         'Annual report' | 'Programme update' | 'Publication'
 *   description  string   one or two sentences
 *   cover        string|null  cover image URL (e.g. /assets/reports/2025-26-cover.webp)
 *   pdf          string   PDF URL (e.g. /assets/reports/nadi-annual-report-2025-26.pdf)
 *   publishedOn  string   ISO date, YYYY-MM-DD
 *   published    boolean  only published reports are listed
 */
export const REPORTS = []

/** Published reports, newest first. Async-shaped so a Supabase query can replace it unchanged. */
export async function getReports() {
  return REPORTS.filter((r) => r.published !== false)
    .sort((a, b) => (b.publishedOn || '').localeCompare(a.publishedOn || ''))
}
