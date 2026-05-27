import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

// ── CDN mode (Vercel / production) ──────────────────────────────────────────
// Set GARMENTS_CDN_URL and VTON_CDN_URL in your Vercel env vars to point at
// your CDN / object-storage bucket. When set, the API returns a redirect
// instead of reading from disk — no large files needed in the deployment.
//
// Example:
//   GARMENTS_CDN_URL = https://your-bucket.r2.dev/garments
//   VTON_CDN_URL     = https://your-bucket.r2.dev/vton
//
// ── Local / self-hosted mode ────────────────────────────────────────────────
// Leave those vars unset and the API reads from the local filesystem:
//   Garments : <project>/images/garments/
//   Try-ons  : VTON_DIR env var (or <project>/images/output/ as fallback)

const GARMENTS_CDN = process.env.GARMENTS_CDN_URL?.replace(/\/$/, '') ?? null
const VTON_CDN     = process.env.VTON_CDN_URL?.replace(/\/$/, '') ?? null

const GARMENTS_LOCAL = path.join(process.cwd(), 'images', 'garments')
const VTON_LOCAL     = process.env.VTON_DIR
  ? path.resolve(process.env.VTON_DIR)
  : path.join(process.cwd(), 'images', 'output')

function mimeType(file: string): string {
  const ext = path.extname(file).toLowerCase()
  if (ext === '.png')  return 'image/png'
  if (ext === '.webp') return 'image/webp'
  return 'image/jpeg'
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type     = searchParams.get('type')     // 'garment' | 'tryon'
  const gender   = searchParams.get('gender')   // 'male' | 'female'
  const slug     = searchParams.get('slug')     // garment slug
  const imgFile  = searchParams.get('img')      // '1.jpg', '2.jpg' …
  const filename = searchParams.get('filename') // 'F-HG_S4__slug.png'

  // ── CDN redirect (Vercel) ──────────────────────────────────────────────────
  if (type === 'garment' && gender && slug && GARMENTS_CDN) {
    const img = imgFile || '1.jpg'
    return NextResponse.redirect(`${GARMENTS_CDN}/${gender}/${slug}/${img}`)
  }
  if (type === 'tryon' && gender && filename && VTON_CDN) {
    return NextResponse.redirect(`${VTON_CDN}/${gender}/${filename}`)
  }

  // ── Filesystem (local dev / self-hosted) ───────────────────────────────────
  let filePath: string | null = null

  if (type === 'garment' && gender && slug) {
    const img = imgFile || '1.jpg'
    filePath = path.join(GARMENTS_LOCAL, gender, slug, img)
  } else if (type === 'tryon' && gender && filename) {
    filePath = path.join(VTON_LOCAL, gender, filename)
  }

  if (!filePath) return new NextResponse('Bad request', { status: 400 })

  filePath = filePath.replace(/\\/g, '/')

  try {
    if (!fs.existsSync(filePath)) return new NextResponse('Not found', { status: 404 })
    const buffer = fs.readFileSync(filePath)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType(filePath),
        'Cache-Control': 'public, max-age=86400',
        'ngrok-skip-browser-warning': 'true',
      },
    })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
