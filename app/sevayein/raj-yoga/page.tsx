'use client';

import { useState } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import { detectRajYogas, type RajYogaResult } from '@/lib/services';

export default function RajYogaPage() {
  const [result, setResult] = useState<RajYogaResult | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ServicePageWrapper
      titleHi="राज योग"
      titleEn="Raj Yoga Detector"
      emoji="👑"
      description="Auspicious planetary combinations that elevate life status. Gajakesari, Budha-Aditya, Lakshmi Yoga, Panch Mahapurusha — and more."
    >
      {(profile) => (
        <>
          {!result && profile && (
            <div className="bg-bg-elev border border-strong rounded-2xl p-6 mb-6">
              <p className="text-text-muted text-sm mb-4">
                We'll compute your birth chart and scan it for major Raj Yogas (auspicious combinations).
              </p>
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
                    if (data.planets) {
                      setResult(detectRajYogas(data.ascendant, data.planets));
                    }
                  } catch {}
                  setLoading(false);
                }}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Scanning chart for yogas...' : 'Scan My Chart for Raj Yogas →'}
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Overall */}
              <div className="bg-gradient-to-br from-gold/10 to-saffron/10 border border-gold/30 rounded-2xl p-6">
                <div className="eyebrow text-gold mb-3">समग्र मूल्यांकन · OVERALL ASSESSMENT</div>
                <p className="leading-relaxed">{result.overallAssessment}</p>
                <div className="mt-4 text-sm">
                  <span className="text-text-muted">Yogas detected: </span>
                  <span className="font-serif text-2xl text-gold">{result.yogasFound.length}</span>
                </div>
              </div>

              {/* Individual yogas */}
              {result.yogasFound.length > 0 ? (
                <div className="space-y-3">
                  {result.yogasFound.map((y, i) => (
                    <div key={i} className="bg-bg-elev border border-strong rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-serif text-2xl">{y.name}</div>
                          <div className="text-text-muted text-sm mt-1">{y.description}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          y.strength === 'Strong' ? 'bg-emerald/20 text-emerald border border-emerald/30' :
                          y.strength === 'Moderate' ? 'bg-gold/20 text-gold border border-gold/30' :
                          'bg-saffron/20 text-saffron border border-saffron/30'
                        }`}>
                          {y.strength}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-emerald font-medium">Effect: </span>
                        {y.effect}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-bg-elev border border-strong rounded-2xl p-6 text-center text-text-muted">
                  No major Raj Yogas detected by simplified scan. A senior astrologer can find hidden ones (parivartana, dhana, neechabhanga yogas).
                </div>
              )}

              <button onClick={() => setResult(null)} className="btn-ghost text-sm">← Recompute</button>
            </div>
          )}
        </>
      )}
    </ServicePageWrapper>
  );
}
