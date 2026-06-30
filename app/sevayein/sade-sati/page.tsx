'use client';

import { useState, useEffect } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import { calculateSadeSati, type SadeSatiResult } from '@/lib/sade-sati';

export default function SadeSatiPage() {
  const [moonSign, setMoonSign] = useState<string>('');
  const [result, setResult] = useState<SadeSatiResult | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ServicePageWrapper
      titleHi="साढ़े साती"
      titleEn="Sade Sati Status"
      emoji="🪐"
      description="Saturn's 7.5-year transit through the 12th, 1st, and 2nd signs from your natal Moon. The most discussed Vedic period — challenging but transformative."
    >
      {(profile) => (
        <>
          <div className="bg-bg-elev border border-strong rounded-2xl p-6 mb-6">
            <p className="text-text-muted text-sm mb-4">
              Sade Sati requires your <strong>Moon sign (Rashi)</strong>. If you don't know it, we'll compute your full birth chart first.
            </p>

            <div className="grid md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm text-text-muted mb-2">Moon Sign (Rashi)</label>
                <select value={moonSign} onChange={(e) => setMoonSign(e.target.value)} className="input">
                  <option value="">Select your Moon sign</option>
                  <option value="Mesha">Mesha (Aries)</option>
                  <option value="Vrishabha">Vrishabha (Taurus)</option>
                  <option value="Mithuna">Mithuna (Gemini)</option>
                  <option value="Karka">Karka (Cancer)</option>
                  <option value="Simha">Simha (Leo)</option>
                  <option value="Kanya">Kanya (Virgo)</option>
                  <option value="Tula">Tula (Libra)</option>
                  <option value="Vrischika">Vrischika (Scorpio)</option>
                  <option value="Dhanu">Dhanu (Sagittarius)</option>
                  <option value="Makara">Makara (Capricorn)</option>
                  <option value="Kumbha">Kumbha (Aquarius)</option>
                  <option value="Meena">Meena (Pisces)</option>
                </select>
              </div>
              <button
                onClick={() => moonSign && setResult(calculateSadeSati(moonSign))}
                disabled={!moonSign}
                className="btn-primary disabled:opacity-50 md:col-span-2"
              >
                Check Sade Sati Status →
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
                        gender: profile.gender,
                      }),
                    });
                    const data = await res.json();
                    if (data.moonSign) {
                      const ms = data.moonSign.split(' ')[0]; // e.g. "Mesha (Aries)" → "Mesha"
                      setMoonSign(ms);
                      setResult(calculateSadeSati(ms));
                    }
                  } catch (e) {}
                  setLoading(false);
                }}
                className="text-gold text-sm hover:underline mt-3"
              >
                {loading ? 'Computing chart...' : 'Or auto-detect from my birth chart →'}
              </button>
            )}
          </div>

          {result && (
            <div className="space-y-4">
              {/* Status hero */}
              <div className={`rounded-2xl p-6 border-2 text-center ${
                result.isInSadeSati ? 'bg-saffron/10 border-saffron' :
                result.isInDhaiya ? 'bg-gold/10 border-gold' :
                'bg-emerald/10 border-emerald'
              }`}>
                <div className="text-5xl mb-3">
                  {result.isInSadeSati ? '🪐' : result.isInDhaiya ? '⚠️' : '✅'}
                </div>
                <div className="font-serif text-3xl mb-2">
                  {result.isInSadeSati ? 'YES — Currently in Sade Sati' :
                   result.isInDhaiya ? 'Currently in Dhaiya (Kantak Shani)' :
                   'NOT in Sade Sati'}
                </div>
                <div className="text-text-muted">{result.currentPhase}</div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card title="आपका चंद्र राशि · Your Moon Sign" value={result.moonSign} />
                <Card title="शनि वर्तमान में · Saturn Currently in" value={result.currentSaturnSign} />
                {result.startDate && <Card title="Sade Sati Start" value={result.startDate} />}
                {result.endDate && <Card title="Sade Sati End" value={result.endDate} />}
              </div>

              {result.remainingMonths > 0 && (
                <div className="bg-gradient-to-br from-saffron/10 to-gold/10 border border-saffron/30 rounded-2xl p-6 text-center">
                  <div className="eyebrow text-saffron mb-2">REMAINING</div>
                  <div className="font-serif text-5xl text-saffron">{result.remainingMonths}</div>
                  <div className="text-text-muted text-sm mt-1">months until Sade Sati completes</div>
                </div>
              )}

              <div className="bg-bg-elev border border-strong rounded-2xl p-6">
                <div className="eyebrow text-gold mb-3">PHASE DESCRIPTION</div>
                <p>{result.phaseDescription}</p>
              </div>

              {result.effects.length > 0 && (
                <div className="bg-bg-elev border border-strong rounded-2xl p-6">
                  <div className="eyebrow text-gold mb-3">अपेक्षित प्रभाव · EXPECTED EFFECTS</div>
                  <ul className="space-y-2">
                    {result.effects.map((e, i) => (
                      <li key={i} className="text-sm flex gap-2"><span className="text-gold">•</span>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.remedies.length > 0 && (
                <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-6">
                  <div className="eyebrow text-emerald mb-3">उपाय · SATURN REMEDIES</div>
                  <ol className="space-y-2">
                    {result.remedies.map((r, i) => (
                      <li key={i} className="text-sm flex gap-3">
                        <span className="text-emerald font-mono">{i + 1}.</span>
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

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-bg-elev border border-strong rounded-xl p-4">
      <div className="eyebrow text-gold mb-1">{title}</div>
      <div className="font-serif text-lg">{value}</div>
    </div>
  );
}
