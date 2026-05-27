// Builds the correct image URL depending on environment.
// On Vercel (NEXT_PUBLIC_ vars set at build time) → direct CDN URL, zero API hop.
// Local dev (vars unset) → /api/img route → local filesystem.

const GARMENTS_CDN = (process.env.NEXT_PUBLIC_GARMENTS_CDN_URL ?? '').replace(/\/$/, '') || null
const VTON_CDN     = (process.env.NEXT_PUBLIC_VTON_CDN_URL     ?? '').replace(/\/$/, '') || null

export function getGarmentSrc(gender: string, slug: string, img = '1.jpg'): string {
  if (GARMENTS_CDN) return `${GARMENTS_CDN}/${gender}/${slug}/${img}`
  return `/api/img?type=garment&gender=${encodeURIComponent(gender)}&slug=${encodeURIComponent(slug)}&img=${encodeURIComponent(img)}`
}

export function getTryOnSrc(gender: string, filename: string): string {
  if (VTON_CDN) return `${VTON_CDN}/${gender}/${filename}`
  return `/api/img?type=tryon&gender=${encodeURIComponent(gender)}&filename=${encodeURIComponent(filename)}`
}
