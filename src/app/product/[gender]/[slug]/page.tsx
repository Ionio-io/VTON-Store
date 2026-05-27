'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getProduct, getAllProducts, DEFAULT_PREFS } from '@/lib/catalog'
import { loadPreferences } from '@/lib/preferences'
import type { UserPreferences } from '@/lib/catalog'
import Header from '@/components/Header'
import TryOnViewer from '@/components/TryOnViewer'
import ModelCustomizer from '@/components/ModelCustomizer'
import PreferenceModal from '@/components/PreferenceModal'
import ProductCard from '@/components/ProductCard'

export default function ProductPage() {
  const params  = useParams()
  const gender  = params?.gender as string
  const slug    = params?.slug as string

  const [prefs, setPrefs]         = useState<UserPreferences>(DEFAULT_PREFS)
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted]     = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = loadPreferences()
    if (saved) setPrefs(saved)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', showModal)
    return () => document.body.classList.remove('modal-open')
  }, [showModal])

  const product = getProduct(gender, slug)

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[#C9952A] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex flex-col items-center justify-center gap-3">
        <p className="text-[#6B6460] text-sm">Product not found.</p>
        <Link href="/" className="text-sm text-[#C9952A] hover:underline">← Back to store</Link>
      </div>
    )
  }

  const allProducts = getAllProducts()
  const related     = allProducts
    .filter(p => p.gender === product.gender && p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <Header onOpenPrefs={() => setShowModal(true)} />

      {/* Breadcrumb */}
      <div className="border-b border-[#E6DFD5] pt-14">
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-[11px] text-[#B0A89E]">
          <Link href="/" className="hover:text-[#C9952A] transition-colors">Home</Link>
          <span>/</span>
          <span className="capitalize">{product.gender === 'female' ? 'Women' : 'Men'}</span>
          <span>/</span>
          <span className="text-[#1C1A17] truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Left — viewer */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <TryOnViewer product={product} prefs={prefs} />
          </motion.div>

          {/* Right — info */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
            className="flex flex-col gap-5"
          >
            {/* Category badge */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#FBF6ED] border border-[#C9952A]/20 text-[#C9952A] text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                {product.category}
              </span>
            </div>

            {/* Name */}
            <div>
              <h1 className="font-display text-[26px] sm:text-[30px] font-semibold text-[#1C1A17] leading-tight">
                {product.name}
              </h1>
              <p className="text-[11px] text-[#B0A89E] mt-1.5 font-mono">SKU: {product.sku}</p>
            </div>

            {/* AI callout */}
            {product.tryOnModels.length > 0 && (
              <div className="flex items-start gap-2.5 p-3.5 border border-[#C9952A]/20 bg-[#FBF6ED] rounded-xl">
                <span className="text-[#C9952A] mt-0.5 text-sm">✦</span>
                <div>
                  <p className="text-[12px] font-bold text-[#C9952A]">AI Try-On Available</p>
                  <p className="text-[11px] text-[#6B6460] mt-0.5">
                    {product.tryOnModels.length} model variant{product.tryOnModels.length !== 1 ? 's' : ''} · Customise below
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-[#E6DFD5]" />

            <ModelCustomizer prefs={prefs} onChange={setPrefs} productGender={product.gender} />

            {/* Actions — Add to Bag only */}
            <div className="pt-1">
              <button className="w-full py-3.5 bg-[#1C1A17] hover:bg-[#2C2A26] text-white text-[13px] font-bold rounded-full transition-colors tracking-wide">
                Add to Bag
              </button>
            </div>

            <p className="text-[11px] text-[#B0A89E]">
              Style: <span className="font-mono text-[#6B6460]">{product.handle}</span>
            </p>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#E6DFD5]">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9952A] font-bold mb-1">More Like This</p>
            <h2 className="font-display text-[20px] font-semibold text-[#1C1A17] mb-7">You Might Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} prefs={prefs} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <PreferenceModal
          initial={prefs}
          onSave={p => { setPrefs(p); setShowModal(false) }}
          onClose={() => setShowModal(false)}
          isFirstVisit={false}
        />
      )}
    </div>
  )
}
