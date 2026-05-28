'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gender, BodyType, SkinTone,
  MALE_BODY_TYPES, FEMALE_BODY_TYPES, SKIN_TONES,
  UserPreferences, DEFAULT_PREFS,
} from '@/lib/catalog'
import { savePreferences } from '@/lib/preferences'

interface Props {
  initial?: UserPreferences
  onSave: (prefs: UserPreferences) => void
  onClose?: () => void
  isFirstVisit?: boolean
}

// Base model images served as static assets from public/models/
function modelPreviewSrc(gender: Gender, bodyType: string, skinTone: string) {
  const gPrefix = gender === 'female' ? 'F' : 'M'
  return `/models/${gPrefix}-${bodyType}_${skinTone}.webp`
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function PreferenceModal({ initial, onSave, onClose, isFirstVisit }: Props) {
  const [prefs, setPrefs] = useState<UserPreferences>(initial ?? DEFAULT_PREFS)

  function set<K extends keyof UserPreferences>(key: K, val: UserPreferences[K]) {
    setPrefs(p => ({ ...p, [key]: val }))
  }

  function handleSave() {
    savePreferences(prefs)
    onSave(prefs)
  }

  const bodyTypes = prefs.gender === 'male' ? MALE_BODY_TYPES : FEMALE_BODY_TYPES

  return (
    <AnimatePresence>
      <motion.div
        key="pref-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={e => { if (e.target === e.currentTarget && onClose) onClose() }}
      >
        <motion.div
          key="pref-panel"
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="relative w-full max-w-[560px] max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-[#E6DFD5]"
          onClick={e => e.stopPropagation()}
        >
          {/* Gold top hairline */}
          <div className="h-[3px] shrink-0 bg-gradient-to-r from-[#C9952A] via-[#E0AA46] to-[#C9952A]" />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 shrink-0 border-b border-[#F0ECE6]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C9952A] mb-1">
                  {isFirstVisit ? 'Welcome' : 'My Style'}
                </p>
                <h2 className="font-display text-[19px] text-[#1C1A17] font-semibold leading-snug">
                  {isFirstVisit ? 'Personalise Your Looks' : 'Update Preferences'}
                </h2>
                <p className="text-[12px] text-[#6B6460] mt-1 leading-relaxed">
                  {isFirstVisit
                    ? 'See every garment on a model that matches your body type and skin tone.'
                    : 'Your try-on model updates instantly across all products.'}
                </p>
              </div>
              {onClose && !isFirstVisit && (
                <button onClick={onClose}
                  className="shrink-0 p-1.5 text-[#B0A89E] hover:text-[#1C1A17] transition-colors rounded-lg hover:bg-[#F8F6F2]">
                  <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-5">

            {/* Gender */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B0A89E] mb-2.5 block">
                I Shop For
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['female', 'male'] as Gender[]).map(g => (
                  <button key={g}
                    onClick={() => { set('gender', g); set('bodyType', g === 'female' ? 'HG' : 'INV') }}
                    className={`py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                      prefs.gender === g
                        ? 'bg-[#1C1A17] border-[#1C1A17] text-white'
                        : 'bg-white border-[#E6DFD5] text-[#6B6460] hover:border-[#1C1A17]/40 hover:text-[#1C1A17]'
                    }`}
                  >
                    {g === 'female' ? 'Women' : 'Men'}
                  </button>
                ))}
              </div>
            </div>

            {/* Body type — PARALLEL HORIZONTAL LINEUP */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B0A89E] mb-2.5 block">
                Body Type
              </label>
              {/* All body types in one row — no scroll */}
              <div className="flex gap-2">
                {bodyTypes.map(bt => {
                  const src = modelPreviewSrc(prefs.gender, bt.id, prefs.skinTone)
                  const isSelected = prefs.bodyType === bt.id
                  return (
                    <button
                      key={bt.id}
                      onClick={() => set('bodyType', bt.id as BodyType)}
                      className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-all duration-200 text-left ${
                        isSelected ? 'border-[#C9952A] shadow-md shadow-[#C9952A]/15' : 'border-[#E6DFD5] hover:border-[#C9952A]/40'
                      }`}
                    >
                      {/* Model image — 2:3 portrait */}
                      <div className="bg-[#F0ECE6]" style={{ aspectRatio: '2/3' }}>
                        <img
                          src={src}
                          alt={bt.label}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                      {/* Label */}
                      <div className={`px-1.5 py-1.5 transition-colors ${isSelected ? 'bg-[#C9952A]' : 'bg-white'}`}>
                        <p className={`text-[11px] font-semibold leading-tight ${isSelected ? 'text-white' : 'text-[#1C1A17]'}`}>
                          {bt.label}
                        </p>
                      </div>
                      {/* Selected tick */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-[#C9952A]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-[#B0A89E] mt-2">
                {bodyTypes.find(b => b.id === prefs.bodyType)?.desc}
              </p>
            </div>

            {/* Skin tone */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B0A89E] mb-2.5 block">
                Skin Tone
              </label>
              <div className="flex gap-2">
                {SKIN_TONES.map(st => (
                  <button key={st.id}
                    onClick={() => set('skinTone', st.id as SkinTone)}
                    className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      prefs.skinTone === st.id
                        ? 'border-[#C9952A] bg-[#FBF6ED]'
                        : 'border-[#E6DFD5] bg-white hover:border-[#C9952A]/30'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full ring-2 ring-offset-2 transition-all ${
                        prefs.skinTone === st.id ? 'ring-[#C9952A] ring-offset-[#FBF6ED]' : 'ring-transparent ring-offset-white'
                      }`}
                      style={{ backgroundColor: st.hex }}
                    />
                    <span className={`text-[11px] font-medium ${prefs.skinTone === st.id ? 'text-[#C9952A]' : 'text-[#6B6460]'}`}>
                      {st.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 shrink-0 border-t border-[#F0ECE6] bg-[#FAFAF8]">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-[#1C1A17] hover:bg-[#2C2A26] text-white text-[13px] font-semibold rounded-xl transition-colors tracking-wide"
            >
              {isFirstVisit ? 'Show My Personalised Looks →' : 'Save Preferences'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
