'use client';

import { useState } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import { checkMangalDosh, type MangalDoshResult } from '@/lib/services';

export default function MangalDoshPage() {
  const [marsHouse, setMarsHouse] = useState<number>(0);
  const [result, setResult] = useState<MangalDoshResult | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ServicePageWrapper
      titleHi="मंगल दोष"
      titleEn="Mangal Dosh Detection"
      emoji="🔴"
      description="Mars in the 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna creates Mangal Dosh — affecting marriage prospects. Critical for matrimonial decisions."
    >
      {(profile) => (
        <>
          <div className="bg-bg-elev border border-strong rounded-2xl p-6 mb-6">
            <p className="text-text-muted text-sm mb-4">
              Enter your Mars house (you can find it from your birth chart) OR auto-detect from your saved profile.
            </p>
            <div className="grid md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm text-text-muted mb-2">Mars House (1–12)</label>
                <select value={marsHouse} onChange={(e) => setMarsHouse(parseInt(e.target.value, 10))} className="input">
                  <option value="0">Select Mars house</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((h) => (
                    <option key={h} value={h}>House {h}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => marsHouse > 0 && profile && setResult(checkMangalDosh(marsHouse, profile.birthDate))}
                disabled={marsHouse === 0 || !profile}
                className="btn-primary disabled:opacity-50 md:col-span-2"
              >
                Check Mangal Dosh →
              </button>
            </div>

            {profile && (
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const res = await fetch('/api/kundli', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: profile.fullName,
                        date: profile.birthDate,
                        time: profile.birthTime,
                        place: profile.birthPlace,
                        latitude: profile.latitude,
                        longitude: profile.longitude,
                      }),
                    });
                    const data = await res.json();
                    const mars = data.planets?.find((p: any) => p.name.includes('Mars'));
                    if (mars?.house) {
                      setMarsHouse(mars.house);
                      setResult(checkMangalDosh(mars.house, profile.birthDate));
                    }
                  } catch {}
                  setLoading(false);
                }}
                className="text-gold text-sm hover:underline mt-3"
              >
                {loading ? 'Detecting...' : 'Auto-detect from my birth chart →'}
              </button>
            )}
          </div>

          {result && (
            <div className="space-y-4">
              {/* Verdict hero */}
              <div className={`rounded-2xl p-6 border-2 text-center ${
                result.hasManglik ? 'bg-saffron/10 border-saffron' : 'bg-emerald/10 border-emerald'
              }`}>
                <div className="text-5xl mb-3">{result.hasManglik ? '⚠️' : '✅'}</div>
                <div className="font-serif text-3xl mb-2">
                  {result.hasManglik ? 'YES — Manglik' : 'NOT Manglik'}
                </div>
                {result.hasManglik && (
                  <div className="text-text-muted">
                    Intensity: <strong>{result.intensity}</strong>
                    {result.marsHouse && ` · Mars in House ${result.marsHouse}`}
                  </div>
                )}
              </div>

              {/* Marriage impact */}
              <div className="bg-bg-elev border border-strong rounded-2xl p-6">
                <div className="eyebrow text-gold mb-3">विवाह पर प्रभाव · MARRIAGE IMPACT</div>
                <p className="text-sm leading-relaxed">{result.marriageImpact}</p>
              </div>

              {/* Cancellations */}
              {result.cancellationReasons.length > 0 && (
                <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-6">
                  <div className="eyebrow text-emerald mb-3">✓ निरस्तीकरण · CANCELLATIONS (Reduces Dosh)</div>
                  <ul className="space-y-2 text-sm">
                    {result.cancellationReasons.map((r, i) => (
                      <li key={i} className="flex gap-2"><span className="text-emerald">→</span>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Remedies */}
              {result.remedies.length > 0 && result.hasManglik && (
                <div className="bg-indigo/10 border border-indigo/30 rounded-2xl p-6">
                  <div className="eyebrow text-indigo mb-3">उपाय · REMEDIES</div>
                  <ol className="space-y-2 text-sm">
                    {result.remedies.map((r, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-indigo font-mono">{i + 1}.</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </ServicePageWrapper>
  );
}
