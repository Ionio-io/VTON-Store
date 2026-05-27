# Westside Virtual Try-On Store

A personalised fashion storefront where every product is shown on a model that matches the shopper's body type and skin tone.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

---

## Overview

Shoppers select their gender, body type, and skin tone on first visit. Every product in the catalogue then shows a try-on image rendered on a model that exactly matches those preferences — not a generic stock photo.

### Features

- **Personalised Try-On** — 4 female body types × 3 skin tones + 5 male body types × 3 skin tones = 27 unique model variants
- **First-Visit Onboarding** — preference modal on first visit, persisted to `localStorage`
- **Live Model Customiser** — body type and skin tone can be changed on the product page; the try-on updates instantly
- **Gender-Safe Fallback** — if preferences don't match the product's gender, the system falls back to a sensible default model
- **100 Products** — 50 female, 50 male across tops and bottoms
- **1,350 Try-On Images** — pre-rendered across all model × garment combinations
- **CDN-backed Images** — garment photos and try-ons served from a CDN; no large files in the repo

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| Image Serving | `/api/img` route — CDN redirect (production) or local filesystem (dev) |
| State | React `useState` + `localStorage` |

---

## Project Structure

```
westside-store/
├── src/
│   ├── app/
│   │   ├── api/img/route.ts          # Image serving — CDN or local filesystem
│   │   ├── product/[gender]/[slug]/  # Product detail page
│   │   ├── page.tsx                  # Home / storefront
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── PreferenceModal.tsx       # First-visit body type + skin tone picker
│   │   ├── ProductCard.tsx           # Lazy-loaded card with hover try-on toggle
│   │   ├── ProductGrid.tsx           # Filterable grid (search + category)
│   │   ├── TryOnViewer.tsx           # Product page try-on viewer + variant preloader
│   │   └── ModelCustomizer.tsx       # Live body type / skin tone switcher
│   └── lib/
│       ├── catalog.ts                # Types, helpers, getEffectiveModelId()
│       └── preferences.ts            # localStorage read / write
├── public/
│   └── ionio-logo.png
├── catalog.json                      # 100-product catalogue
├── .env.example                      # Required environment variables
├── vercel.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+

### Local Development

```bash
git clone https://github.com/Ionio-io/VTON-Store.git
cd VTON-Store
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Point at your local VTON output folder
VTON_DIR=/absolute/path/to/vton_outputs

# Or use CDN URLs (see Deployment section below)
GARMENTS_CDN_URL=https://...
VTON_CDN_URL=https://...
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Image Serving

All images are served through `/api/img`. The route operates in two modes:

**CDN mode** (production) — set `GARMENTS_CDN_URL` and `VTON_CDN_URL` env vars; the API returns a redirect to the CDN, no large files needed in the deployment.

**Filesystem mode** (local dev) — leave CDN vars unset; the API reads from:
- Garments: `<project>/images/garments/{gender}/{slug}/{img}`
- Try-ons: `VTON_DIR/{gender}/{modelId}__{slug}.png`

```
GET /api/img?type=garment&gender=female&slug=<slug>&img=1.jpg
GET /api/img?type=tryon&gender=female&filename=F-HG_S4__<slug>.png
```

---

## Model ID Formula

Every try-on image is identified by a **Model ID**:

```
{gender_prefix}-{body_type}_{skin_tone}

Examples:
  F-HG_S4    →  Female · Hourglass · Medium
  M-INV_S3   →  Male · Inverted Triangle · Fair
  F-REC_S5   →  Female · Rectangle · Deep
```

**Female body types:** `HG` (Hourglass) · `REC` (Rectangle) · `SPO` (Pear) · `TRAP` (Trapezoid)  
**Male body types:** `INV` (Inverted Triangle) · `OVL` (Oval) · `REC` (Rectangle) · `TRAP` (Trapezoid) · `TRI` (Triangle)  
**Skin tones:** `S3` (Fair) · `S4` (Medium) · `S5` (Deep)

---

## Deployment (Vercel)

1. Import this repo in [Vercel](https://vercel.com/new)
2. Set **Root Directory** to `.` (repo root)
3. Add environment variables:

| Variable | Value |
|---|---|
| `GARMENTS_CDN_URL` | CDN base URL for garment images |
| `VTON_CDN_URL` | CDN base URL for try-on outputs |

4. Deploy — build takes ~2 minutes.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Ink | `#1C1A17` | Text, buttons |
| Canvas | `#F8F6F2` | Page background |
| Accent | `#C9952A` | Gold highlights, CTAs |
| Stone | `#6B6460` | Secondary text |
| Border | `#E6DFD5` | All borders |

**Fonts:** Playfair Display (headings) · DM Sans (body)

---

## License

Private — all rights reserved © Ionio
