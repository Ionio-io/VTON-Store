'use client'
import { UserPreferences, DEFAULT_PREFS } from './catalog'

const KEY = 'westside-prefs'

export function loadPreferences(): UserPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserPreferences
  } catch { return null }
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(prefs))
}

export function clearPreferences(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}

export function hasPreferences(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(KEY)
}
