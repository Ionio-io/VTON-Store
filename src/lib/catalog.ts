import catalogData from '../../catalog.json'

export type Gender = 'male' | 'female'
export type Category = 'top' | 'bottom' | 'full'
export type SkinTone = 'S3' | 'S4' | 'S5'

export type MaleBodyType   = 'INV' | 'OVL' | 'REC' | 'TRAP' | 'TRI'
export type FemaleBodyType = 'HG'  | 'REC' | 'SPO' | 'TRAP'
export type BodyType = MaleBodyType | FemaleBodyType

export interface Product {
  id: string
  slug: string
  handle: string
  gender: Gender
  name: string
  category: Category
  sku: string
  garmentImages: string[]
  tryOnModels: string[]
}

export interface UserPreferences {
  gender: Gender
  bodyType: BodyType
  skinTone: SkinTone
}

export const MALE_BODY_TYPES: { id: MaleBodyType; label: string; desc: string }[] = [
  { id: 'INV',  label: 'Inverted Triangle', desc: 'Broad shoulders, narrow waist' },
  { id: 'OVL',  label: 'Oval',              desc: 'Fuller midsection, narrow hips' },
  { id: 'REC',  label: 'Rectangle',         desc: 'Even proportions throughout' },
  { id: 'TRAP', label: 'Trapezoid',         desc: 'Slightly wider shoulders' },
  { id: 'TRI',  label: 'Triangle',          desc: 'Narrow shoulders, wider hips' },
]

export const FEMALE_BODY_TYPES: { id: FemaleBodyType; label: string; desc: string }[] = [
  { id: 'HG',   label: 'Hourglass',   desc: 'Defined waist, balanced curves' },
  { id: 'REC',  label: 'Rectangle',   desc: 'Balanced, straight silhouette' },
  { id: 'SPO',  label: 'Pear',        desc: 'Wider hips, narrower shoulders' },
  { id: 'TRAP', label: 'Trapezoid',   desc: 'Shoulders wider than hips' },
]

export const SKIN_TONES: { id: SkinTone; label: string; hex: string }[] = [
  { id: 'S3', label: 'Fair',   hex: '#F1C27D' },
  { id: 'S4', label: 'Medium', hex: '#C68642' },
  { id: 'S5', label: 'Deep',   hex: '#8D5524' },
]

export const DEFAULT_PREFS: UserPreferences = {
  gender: 'female', bodyType: 'HG', skinTone: 'S4',
}

export function getModelId(prefs: UserPreferences): string {
  const prefix = prefs.gender === 'male' ? 'M' : 'F'
  return `${prefix}-${prefs.bodyType}_${prefs.skinTone}`
}

/**
 * Always returns a model ID that matches the *product's* gender.
 * If the user's pref gender differs from the product gender,
 * we keep their skin tone but fall back to the default body type
 * for the product's gender (HG for female, INV for male).
 * This ensures a try-on file always exists.
 */
export function getEffectiveModelId(prefs: UserPreferences, productGender: Gender): string {
  if (prefs.gender === productGender) {
    // Perfect match — use exactly what the user chose
    return getModelId(prefs)
  }
  // Gender mismatch: use product gender + default body type + user's skin tone
  const prefix      = productGender === 'female' ? 'F' : 'M'
  const defaultBody = productGender === 'female' ? 'HG' : 'INV'
  return `${prefix}-${defaultBody}_${prefs.skinTone}`
}

export function getTryOnFilename(modelId: string, productSlug: string): string {
  return `${modelId}__${productSlug}.png`
}

export function getAllProducts(): Product[] {
  return catalogData as Product[]
}

export function getProduct(gender: string, slug: string): Product | undefined {
  return (catalogData as Product[]).find(p => p.gender === gender && p.slug === slug)
}

export function filterProducts(
  products: Product[],
  gender?: Gender,
  category?: Category,
  search?: string
): Product[] {
  return products.filter(p => {
    if (gender   && p.gender   !== gender)   return false
    if (category && p.category !== category) return false
    if (search) {
      const q = search.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.handle.toLowerCase().includes(q)) return false
    }
    return true
  })
}
