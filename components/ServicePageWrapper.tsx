'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadProfile, saveProfile, type StoredProfile } from '@/lib/profile-storage';

interface Props {
  titleHi: string;
  titleEn: string;
  emoji: string;
  description: string;
  requireBirthDetails?: boolean;
  children: (profile: StoredProfile | null) => React.ReactNode;
}

export default function ServicePageWrapper({ titleHi, titleEn, emoji, description, requireBirthDetails = true, children }: Props) {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(loadProfile());
  }, []);

  if (!mounted) return null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-8 md:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4 text-sm">
          <Link href="/sevayein" className="text-text-muted hover:text-gold">← सेवाएँ</Link>
          <span className="text-text-faint">/</span>
          <span className="text-text-muted">{titleEn}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="text-5xl">{emoji}</div>
          <div>
            <h1 className="font-serif text-3xl md:text-4xl">{titleHi}</h1>
            <p className="text-text-muted text-sm mt-1">{titleEn}</p>
            <p className="text-text-muted mt-3 max-w-2xl">{description}</p>
          </div>
        </div>
      </header>

      {/* Profile bar / form */}
      {requireBirthDetails && (
        <>
          {profile && !showForm ? (
            <div className="bg-bg-elev border border-strong rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm">
                <span className="text-text-muted">Using profile:</span>{' '}
                <strong>{profile.fullName}</strong>{' '}
                <span className="text-text-faint">
                  · {profile.birthDate} · {profile.birthTime} · {profile.birthPlace || 'India'}
                </span>
              </div>
              <button onClick={() => setShowForm(true)} className="text-gold hover:underline text-sm">
                Change details
              </button>
            </div>
          ) : (
            <ProfileForm
              existing={profile}
              onSaved={(p) => {
                setProfile(p);
                setShowForm(false);
              }}
              onCancel={profile ? () => setShowForm(false) : undefined}
            />
          )}
        </>
      )}

      {/* Content */}
      {(!requireBirthDetails || profile) && (
        <div className="mt-2">
          {children(profile)}
        </div>
      )}
    </main>
  );
}

function ProfileForm({ existing, onSaved, onCancel }: { existing: StoredProfile | null; onSaved: (p: StoredProfile) => void; onCancel?: () => void }) {
  const [form, setForm] = useState({
    fullName: existing?.fullName || '',
    birthDate: existing?.birthDate || '',
    birthTime: existing?.birthTime || '',
    birthPlace: existing?.birthPlace || '',
    latitude: existing?.latitude || '23.2599',
    longitude: existing?.longitude || '77.4126',
    gender: existing?.gender || 'male' as 'male' | 'female',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(form);
    onSaved({ ...form, updatedAt: new Date().toISOString() });
  }

  function useSample() {
    setForm({
      fullName: 'Ankit Dubey',
      birthDate: '1989-06-15',
      birthTime: '10:30',
      birthPlace: 'Bhopal, India',
      latitude: '23.2599',
      longitude: '77.4126',
      gender: 'male',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-elev border border-strong rounded-2xl p-6 mb-8">
      <div className="eyebrow text-gold mb-4">{existing ? 'UPDATE' : 'ENTER'} BIRTH DETAILS</div>
      <div className="grid md:grid-cols-2 gap-3">
        <input type="text" required placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input" />
        <input type="text" placeholder="Place of birth" value={form.birthPlace} onChange={(e) => setForm({ ...form, birthPlace: e.target.value })} className="input" />
        <input type="date" required value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className="input" />
        <input type="time" required value={form.birthTime} onChange={(e) => setForm({ ...form, birthTime: e.target.value })} className="input" />
        <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as 'male' | 'female' })} className="input">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Lat" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} className="input" />
          <input type="text" placeholder="Lng" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} className="input" />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <button type="submit" className="btn-primary">Save & Continue</button>
        <button type="button" onClick={useSample} className="btn-ghost">Use sample data</button>
        {onCancel && <button type="button" onClick={onCancel} className="text-text-muted hover:text-gold ml-auto">Cancel</button>}
      </div>
    </form>
  );
}
