'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import PreferenceModal from '@/components/PreferenceModal'
import { getAllProducts } from '@/lib/catalog'
import { loadPreferences } from '@/lib/preferences'
import type { UserPreferences } from '@/lib/catalog'

const EASE = [0.22, 1, 0.36, 1] as const

const SECTION_LABELS: Record<string, string> = {
  women: "Women's Edit",
  men:   "Men's Edit",
}

export default function StorePage() {
  const [prefs, setPrefs]               = useState<UserPreferences | null>(null)
  const [showModal, setShowModal]       = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [mounted, setMounted]           = useState(false)
  const [activeSection, setActiveSection] = useState<'women' | 'men' | null>(null)

  const products = getAllProducts()

  useEffect(() => {
    setMounted(true)
    const saved = loadPreferences()
    if (saved) { setPrefs(saved) }
    else { setIsFirstVisit(true); setShowModal(true) }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', showModal)
    return () => document.body.classList.remove('modal-open')
  }, [showModal])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[#C9952A] border-t-transparent animate-spin" />
      </div>
    )
  }

  const sectionLabel = activeSection ? SECTION_LABELS[activeSection] : 'All Products'

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      <Header
        onOpenPrefs={() => setShowModal(true)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Hero */}
      <section className="relative pt-28 pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C9952A] mb-3"
          >
            Ionio Research
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="font-display font-semibold text-[#1C1A17] leading-[1.1] max-w-2xl"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Fashion that fits{' '}
            <em className="text-[#C9952A]">every body.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
            className="text-[#6B6460] text-[14px] mt-3 max-w-md leading-relaxed"
          >
            See garments on a model that matches your exact body type and skin tone — before you buy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
            className="mt-6 flex items-center gap-4 flex-wrap"
          >
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1A17] hover:bg-[#2C2A26] text-white text-[13px] font-semibold rounded-full transition-colors"
            >
              Personalise My Looks
              <span className="opacity-60 text-xs">↗</span>
            </button>

            {prefs && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-[12px] text-[#6B6460]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9952A] shrink-0" />
                <span>{prefs.gender === 'female' ? 'Women' : 'Men'} · {prefs.bodyType} · {prefs.skinTone}</span>
                <button onClick={() => setShowModal(true)}
                  className="text-[#C9952A] hover:underline ml-0.5">Change</button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#E6DFD5]" />

      {/* Collection */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between mb-7">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#C9952A] font-bold mb-1">Collection</p>
            <h2 className="font-display text-[22px] font-semibold text-[#1C1A17]">{sectionLabel}</h2>
          </div>
          <span className="text-[12px] text-[#B0A89E]">{products.length} pieces</span>
        </div>

        <ProductGrid
          products={products}
          prefs={prefs}
          defaultGender={prefs?.gender}
          activeSection={activeSection}
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E6DFD5] px-6 py-8 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-[15px] text-[#1C1A17]">Ionio</span>
            <span className="text-[10px] text-[#C9952A] tracking-[0.2em] uppercase font-bold">Research</span>
          </div>
          <p className="text-[11px] text-[#B0A89E]">
            © {new Date().getFullYear()} Ionio Research · AI-Powered Fashion Try-On
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showModal && (
          <PreferenceModal
            key="pref-modal"
            initial={prefs ?? undefined}
            onSave={p => { setPrefs(p); setShowModal(false); setIsFirstVisit(false) }}
            onClose={isFirstVisit ? undefined : () => setShowModal(false)}
            isFirstVisit={isFirstVisit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
