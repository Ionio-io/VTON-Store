'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Product, UserPreferences, getEffectiveModelId, getTryOnFilename } from '@/lib/catalog'

interface Props {
  product: Product
  prefs: UserPreferences | null
}

export default function ProductCard({ product, prefs }: Props) {
  const [tryOnError, setTryOnError]   = useState(false)
  const [imgLoaded, setImgLoaded]     = useState(false)
  const [imgError, setImgError]       = useState(false)
  const [inView, setInView]           = useState(false)
  const [showTryOn, setShowTryOn]     = useState(false)
  const cardRef                       = useRef<HTMLAnchorElement>(null)

  const garmentSrc       = `/api/img?type=garment&gender=${product.gender}&slug=${product.slug}&img=1.jpg`
  const effectiveModelId = prefs ? getEffectiveModelId(prefs, product.gender) : null
  const tryOnSrc         = effectiveModelId
    ? `/api/img?type=tryon&gender=${product.gender}&filename=${getTryOnFilename(effectiveModelId, product.slug)}`
    : null

  // Intersection observer — load try-on only once card enters viewport
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { rootMargin: '300px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Auto-show try-on when in view and prefs exist
  useEffect(() => {
    if (inView && prefs && tryOnSrc && !tryOnError) setShowTryOn(true)
  }, [inView, prefs?.gender, prefs?.bodyType, prefs?.skinTone]) // eslint-disable-line

  // Reset on pref change
  useEffect(() => {
    setTryOnError(false)
    setImgLoaded(false)
    if (inView && prefs && tryOnSrc) setShowTryOn(true)
    else if (!prefs) setShowTryOn(false)
  }, [prefs?.gender, prefs?.bodyType, prefs?.skinTone]) // eslint-disable-line

  const hasTryOn  = !!tryOnSrc && !tryOnError
  const activeSrc = showTryOn && hasTryOn ? tryOnSrc! : garmentSrc

  // Hide card entirely if garment image fails
  if (imgError && !showTryOn) return null

  return (
    <Link
      ref={cardRef}
      href={`/product/${product.gender}/${product.slug}`}
      className="product-card group block"
    >
      <div className="relative rounded-xl bg-[#F0ECE6] aspect-[3/4] overflow-hidden">

        {/* Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#EDE8E1] to-[#F0ECE6] animate-pulse" />
        )}

        <img
          src={activeSrc}
          alt={product.name}
          onLoad={() => { setImgLoaded(true); setImgError(false) }}
          onError={() => {
            if (showTryOn) { setTryOnError(true); setShowTryOn(false) }
            else setImgError(true)
          }}
          className={`w-full h-full object-cover object-top transition-opacity duration-400 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300 pointer-events-none" />

        {/* Bottom gradient for pill */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Try-on toggle — hover only, always */}
        {hasTryOn && (
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setShowTryOn(v => !v); setImgLoaded(false) }}
            className="
              absolute bottom-2.5 left-1/2 -translate-x-1/2
              flex items-center gap-1.5 px-3 py-1.5
              rounded-full text-[11px] font-semibold whitespace-nowrap
              bg-white/90 border border-[#E6DFD5] text-[#1C1A17]
              shadow-sm backdrop-blur-sm
              opacity-0 group-hover:opacity-100
              translate-y-1 group-hover:translate-y-0
              transition-all duration-250
            "
          >
            <svg className="w-3 h-3 shrink-0 text-[#C9952A]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {showTryOn ? 'Show Original' : 'Try On Me'}
          </button>
        )}

        {/* Category badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/85 border border-[#E6DFD5] backdrop-blur-sm rounded-full text-[10px] font-medium text-[#6B6460] capitalize tracking-wide">
          {product.category}
        </span>
      </div>

      {/* Info — no gender label */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-[13px] font-medium text-[#1C1A17] leading-snug line-clamp-2 group-hover:text-[#C9952A] transition-colors duration-200">
          {product.name}
        </h3>
      </div>
    </Link>
  )
}
