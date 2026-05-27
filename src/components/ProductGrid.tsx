'use client'
import { useState, useMemo } from 'react'
import { Product, UserPreferences, Category, Gender, filterProducts } from '@/lib/catalog'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
  prefs: UserPreferences | null
  defaultGender?: Gender
  activeSection?: 'women' | 'men' | null
}

const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all',    label: 'All' },
  { id: 'top',    label: 'Tops' },
  { id: 'bottom', label: 'Bottoms' },
]

export default function ProductGrid({ products, prefs, defaultGender, activeSection }: Props) {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [search, setSearch]     = useState('')

  const filtered = useMemo(() => {
    let effectiveGender: Gender | undefined
    if (activeSection === 'women')      effectiveGender = 'female'
    else if (activeSection === 'men')   effectiveGender = 'male'
    else effectiveGender = defaultGender

    return filterProducts(
      products,
      effectiveGender,
      category !== 'all' ? category : undefined,
      search || undefined,
    )
  }, [products, activeSection, defaultGender, category, search])

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-7">
        {/* Search */}
        <div className="relative flex-1 max-w-[260px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0A89E]"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full pl-8 pr-4 py-2 bg-white border border-[#E6DFD5] rounded-lg text-[13px] text-[#1C1A17] placeholder-[#B0A89E] focus:outline-none focus:ring-1 focus:ring-[#C9952A]/30 focus:border-[#C9952A]/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all border ${
                category === c.id
                  ? 'bg-[#1C1A17] border-[#1C1A17] text-white'
                  : 'bg-white border-[#E6DFD5] text-[#6B6460] hover:border-[#1C1A17]/30 hover:text-[#1C1A17]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-[11px] text-[#B0A89E] mb-5">
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        {prefs && (
          <span className="ml-2 text-[#C9952A]">
            · {prefs.gender === 'female' ? 'Women' : 'Men'} · {prefs.bodyType} · {prefs.skinTone}
          </span>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-10 h-10 rounded-full bg-[#F0ECE6] flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#B0A89E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-[#6B6460] text-sm">No products match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} prefs={prefs} />
          ))}
        </div>
      )}
    </div>
  )
}
