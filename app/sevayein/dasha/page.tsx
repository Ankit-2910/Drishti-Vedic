'use client';

import { useState } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import ShareButtons from '@/components/ShareButtons';
import { calculateDasha, type DashaResult } from '@/lib/dasha';
import { useLang } from '@/lib/i18n';

const PLANET_COLORS: Record<string, string> = {
  Ketu: '#a78bfa', Venus: '#ec4899', Sun: '#f59e0b', Moon: '#94a3b8',
  Mars: '#ef4444', Rahu: '#6b7280', Jupiter: '#fbbf24', Saturn: '#3b82f6', Mercury: '#10b981',
};

export default function DashaPage() {
  const { lang } = useLang();
  const [result, setResult] = useState<DashaResult | null>(null);

  return (
    <ServicePageWrapper
      titleHi="दशा विश्लेषण"
      titleEn="Dasha Analysis"
      emoji="🔮"
      description="Vimshottari Dasha — your life's 120-year planetary timeline. Discover which planet rules your current chapter."
    >
      {(profile) => {
        if (profile && !result) {
          setResult(calculateDasha(profile.birthDate, profile.birthTime));
        }

        return result ? (
          <div className="space-y-6 print-area">
            {/* Summary */}
            <div className="bg-gradient-to-br from-gold/10 to-saffron/10 border border-gold/30 rounded-2xl p-6">
              <div className="eyebrow text-gold mb-3">
                {lang === 'hi' ? 'वर्तमान दशा' : 'CURRENT PERIOD'}
              </div>
              <p className="font-serif text-lg leading-relaxed mb-2">{result.summary}</p>
              <p className="font-serif text-lg leading-relaxed text-gold-light">{result.summaryHi}</p>
              <div className="mt-4 text-sm text-text-muted">
                {lang === 'hi' ? 'जन्म नक्षत्र' : 'Birth Nakshatra'}: <strong>{result.birthNakshatra}</strong> ·{' '}
                {lang === 'hi' ? 'आरंभिक दशा स्वामी' : 'Starting Dasha Lord'}: <strong>{result.startingPlanet}</strong>
              </div>
            </div>

            {/* Mahadasha timeline */}
            <div className="bg-bg-elev border border-strong rounded-2xl p-6">
              <div className="eyebrow text-gold mb-4">
                महादशा समयरेखा · MAHADASHA TIMELINE (120 years)
              </div>
              <div className="space-y-2">
                {result.mahadashas.map((md, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      md.isCurrent
                        ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'border-[rgba(245,158,11,0.1)] bg-bg/40'
                    }`}
                  >
                    <div
                      className="w-3 h-12 rounded-full shrink-0"
                      style={{ backgroundColor: PLANET_COLORS[md.planet] }}
                    />
                    <div className="flex-1">
                      <div className="font-serif text-xl flex items-center gap-2">
                        {md.planet} · {md.planetHi}
                        {md.isCurrent && (
                          <span className="text-xs bg-gold text-bg px-2 py-0.5 rounded-full font-sans font-medium">
                            {lang === 'hi' ? 'वर्तमान' : 'NOW'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-text-muted">{md.years} {lang === 'hi' ? 'वर्ष' : 'years'}</div>
                    </div>
                    <div className="text-right text-sm font-mono text-text-faint">
                      <div>{md.startDate}</div>
                      <div>↓</div>
                      <div>{md.endDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Antardashas */}
            {result.currentAntardashas.length > 0 && (
              <div className="bg-bg-elev border border-strong rounded-2xl p-6">
                <div className="eyebrow text-gold mb-4">
                  अंतर्दशा · ANTARDASHA (sub-periods in current Mahadasha)
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  {result.currentAntardashas.map((ad, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        ad.isCurrent ? 'bg-gold/10 border border-gold/40' : 'bg-bg/40'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLANET_COLORS[ad.planet] }} />
                      <div className="flex-1 text-sm">
                        {ad.planet} · {ad.planetHi}
                        {ad.isCurrent && <span className="text-gold text-xs ml-2">← {lang === 'hi' ? 'अभी' : 'now'}</span>}
                      </div>
                      <div className="text-xs font-mono text-text-faint">{ad.startDate} → {ad.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ShareButtons shareText={`My current Vedic Dasha: ${result.currentMahadasha?.planet} Mahadasha (DRISHTI Vedic+)`} />
          </div>
        ) : null;
      }}
    </ServicePageWrapper>
  );
}
