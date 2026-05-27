'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface HeaderProps {
  onOpenPrefs?: () => void
  activeSection?: string | null
  onSectionChange?: (s: 'women' | 'men' | null) => void
}

export default function Header({ onOpenPrefs, activeSection, onSectionChange }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems: { label: string; key: 'women' | 'men' }[] = [
    { label: 'Women', key: 'women' },
    { label: 'Men',   key: 'men'   },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E6DFD5] shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo + wordmark */}
        <Link href="/" onClick={() => onSectionChange?.(null)} className="flex items-center gap-2.5">
          <Image src="/ionio-logo.png" alt="Ionio" width={30} height={30} className="rounded-lg" />
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[17px] font-semibold text-[#1C1A17] tracking-tight">
              Ionio
            </span>
            <span className="text-[10px] text-[#C9952A] tracking-[0.2em] uppercase font-semibold">
              Research
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => onSectionChange?.(activeSection === item.key ? null : item.key)}
              className={`relative text-[13px] tracking-wide pb-0.5 transition-colors duration-200 ${
                activeSection === item.key ? 'text-[#1C1A17] font-medium' : 'text-[#6B6460] hover:text-[#1C1A17]'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-[#C9952A] rounded-full transition-all duration-300 ${
                activeSection === item.key ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`} style={{ transformOrigin: 'left' }} />
            </button>
          ))}
        </nav>

        {/* My Style */}
        <button
          onClick={onOpenPrefs}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E6DFD5] bg-white hover:border-[#C9952A]/40 hover:bg-[#FBF6ED] transition-all text-[13px] text-[#6B6460] hover:text-[#C9952A]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="hidden sm:block">My Style</span>
        </button>
      </div>
    </header>
  )
}
