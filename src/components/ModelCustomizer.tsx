'use client'
import {
  Gender, BodyType, SkinTone,
  MALE_BODY_TYPES, FEMALE_BODY_TYPES, SKIN_TONES,
  UserPreferences,
} from '@/lib/catalog'
import { savePreferences } from '@/lib/preferences'

interface Props {
  prefs: UserPreferences
  onChange: (prefs: UserPreferences) => void
  productGender?: Gender
}

export default function ModelCustomizer({ prefs, onChange, productGender }: Props) {
  function set<K extends keyof UserPreferences>(key: K, val: UserPreferences[K]) {
    const next = productGender
      ? { ...prefs, [key]: val, gender: productGender }
      : { ...prefs, [key]: val }
    savePreferences(next)
    onChange(next)
  }

  const activeGender = productGender ?? prefs.gender
  const bodyTypes    = activeGender === 'male' ? MALE_BODY_TYPES : FEMALE_BODY_TYPES

  return (
    <div className="rounded-xl border border-[#E6DFD5] bg-[#FAFAF8] p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD5]">
        <h3 className="text-[13px] font-semibold text-[#1C1A17]">Model Preview</h3>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9952A]">Customise</span>
      </div>

      {/* Body type */}
      <div>
        <label className="text-[10px] tracking-[0.2em] uppercase text-[#B0A89E] font-bold mb-2 block">
          Body Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {bodyTypes.map(bt => (
            <button key={bt.id}
              onClick={() => set('bodyType', bt.id as BodyType)}
              title={bt.desc}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all ${
                prefs.bodyType === bt.id
                  ? 'bg-[#1C1A17] border-[#1C1A17] text-white'
                  : 'bg-white border-[#E6DFD5] text-[#6B6460] hover:border-[#1C1A17]/30 hover:text-[#1C1A17]'
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skin tone */}
      <div>
        <label className="text-[10px] tracking-[0.2em] uppercase text-[#B0A89E] font-bold mb-2 block">
          Skin Tone
        </label>
        <div className="flex gap-2">
          {SKIN_TONES.map(st => (
            <button key={st.id}
              onClick={() => set('skinTone', st.id as SkinTone)}
              title={st.label}
              className={`flex flex-col items-center gap-1.5 flex-1 py-2.5 rounded-xl border-2 transition-all ${
                prefs.skinTone === st.id
                  ? 'border-[#C9952A] bg-[#FBF6ED]'
                  : 'border-[#E6DFD5] bg-white hover:border-[#C9952A]/30'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full ring-2 ring-offset-2 transition-all ${
                  prefs.skinTone === st.id ? 'ring-[#C9952A] ring-offset-[#FBF6ED]' : 'ring-transparent ring-offset-white'
                }`}
                style={{ backgroundColor: st.hex }}
              />
              <span className={`text-[10px] font-medium ${prefs.skinTone === st.id ? 'text-[#C9952A]' : 'text-[#6B6460]'}`}>
                {st.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
