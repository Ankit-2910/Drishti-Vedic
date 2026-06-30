/**
 * Lightweight profile storage in localStorage.
 * After user enters birth details once, all service pages can read them.
 */

export interface StoredProfile {
  fullName: string;
  birthDate: string;     // YYYY-MM-DD
  birthTime: string;     // HH:MM
  birthPlace: string;
  latitude: string;
  longitude: string;
  gender: 'male' | 'female';
  updatedAt: string;
}

const STORAGE_KEY = 'drishti_profile';

export function saveProfile(profile: Omit<StoredProfile, 'updatedAt'>): void {
  if (typeof window === 'undefined') return;
  try {
    const toStore: StoredProfile = { ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function loadProfile(): StoredProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProfile;
  } catch (e) {
    console.error('Failed to load profile:', e);
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function hasProfile(): boolean {
  return loadProfile() !== null;
}
