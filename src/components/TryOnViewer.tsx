'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Product, UserPreferences, getEffectiveModelId, getTryOnFilename,
  MALE_BODY_TYPES, FEMALE_BODY_TYPES, SKIN_TONES,
} from '@/lib/catalog'
import { getGarmentSrc, getTryOnSrc } from '@/lib/images'

interface Props {
  product: Product
  prefs: UserPreferences
}

// All 15 model combinations for this product's gender
function getAllModelIds(gender: 'female' | 'male') {
  const prefix    = gender === 'female' ? 'F' : 'M'
  const bodyTypes = gender === 'female'
    ? FEMALE_BODY_TYPES.map(b => b.id)
    : MALE_BODY_TYPES.map(b => b.id)
  const ids: string[] = []
  for (const bt of bodyTypes) {
    for (const st of SKIN_TONES.map(s => s.id)) {
      ids.push(`${prefix}-${bt}_${st}`)
    }
  }
  return ids
}

export default function TryOnViewer({ product, prefs }: Props) {
  const [view, setView]     = useState<'tryon' | 'original'>('tryon')
  const [imgIdx, setImgIdx] = useState(0)

  // Reset to first garment image when toggling back to original
  function toggleView(v: 'tryon' | 'original') {
    if (v === 'original') setImgIdx(0)
    setView(v)
  }

  const modelId   = getEffectiveModelId(prefs, product.gender)
  const filename  = getTryOnFilename(modelId, product.slug)
  const tryOnSrc  = getTryOnSrc(product.gender, filename)

  const garmentImages = product.garmentImages.length > 0 ? product.garmentImages : ['1.jpg']
  const garmentSrc    = getGarmentSrc(product.gender, product.slug, garmentImages[imgIdx])
  const activeSrc     = view === 'tryon' ? tryOnSrc : garmentSrc

  // Preload all 15 model variant images in background
  useEffect(() => {
    const allIds = getAllModelIds(product.gender)
    allIds.forEach(id => {
      const fn  = getTryOnFilename(id, product.slug)
      const src = getTryOnSrc(product.gender, fn)
      const img = new window.Image()
      img.src = src
    })
  }, [product.gender, product.slug])

  return (
    <div className="space-y-3">
      {/* Toggle tabs */}
      <div className="flex items-center bg-[#F8F6F2] border border-[#E6DFD5] rounded-xl p-1 gap-1">
        {(['tryon', 'original'] as const).map(v => (
          <button key={v} onClick={() => toggleView(v)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] font-medium transition-all duration-200 ${
              view === v
                ? 'bg-white text-[#1C1A17] shadow-sm border border-[#E6DFD5]'
                : 'text-[#6B6460] hover:text-[#1C1A17]'
            }`}
          >
            {v === 'tryon' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Try-On
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Original
              </>
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#F0ECE6] aspect-[3/4]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSrc}
            src={activeSrc}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-cover object-top"
          />
        </AnimatePresence>

        {view === 'tryon' && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/90 border border-[#E6DFD5] backdrop-blur-sm rounded-lg">
            <span className="text-[10px] text-[#C9952A] font-mono">{modelId}</span>
          </div>
        )}
      </div>

      {/* Garment thumbnails — show only when in original mode and multiple images exist */}
      {view === 'original' && garmentImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mt-1">
          {[...new Set(garmentImages)].map((img, i) => (
            <button key={img} onClick={() => setImgIdx(i)}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                imgIdx === i ? 'border-[#C9952A]' : 'border-[#E6DFD5] hover:border-[#C9952A]/40'
              }`}
            >
              <img
                src={getGarmentSrc(product.gender, product.slug, img)}
                alt="" className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
