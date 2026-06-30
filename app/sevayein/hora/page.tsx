'use client';

import { useState, useEffect } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import { calculateHora, type HoraResult } from '@/lib/services';

const PLANET_COLORS: Record<string, string> = {
  Sun: '#f59e0b', Moon: '#94a3b8', Mars: '#ef4444', Mercury: '#10b981',
  Jupiter: '#fbbf24', Venus: '#ec4899', Saturn: '#6b7280',
};

const PLANET_EMOJI: Record<string, string> = {
  Sun: '☀️', Moon: '🌙', Mars: '🔴', Mercury: '💚',
  Jupiter: '🟡', Venus: '💗', Saturn: '⚫',
};

export default function HoraPage() {
  const [result, setResult] = useState<HoraResult | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setResult(calculateHora());
    const interval = setInterval(() => {
      setNow(new Date());
      setResult(calculateHora());
    }, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <ServicePageWrapper
      titleHi="होरा मुहूर्त"
      titleEn="Hora Muhurat"
      emoji="⏰"
      description="Each day is divided into 24 planetary hours. Knowing the current Hora tells you what activities are auspicious right now."
      requireBirthDetails={false}
    >
      {() => result && (
        <>
          <div className="text-center text-sm text-text-faint mb-6 font-mono">
            Current time: {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
          </div>

          {/* Current Hora hero */}
          <div
            className="rounded-2xl p-8 mb-6 text-center border-2"
            style={{
              backgroundColor: PLANET_COLORS[result.currentHora] + '15',
              borderColor: PLANET_COLORS[result.currentHora] + '60',
            }}
          >
            <div className="text-6xl mb-4">{PLANET_EMOJI[result.currentHora]}</div>
            <div className="eyebrow mb-2" style={{ color: PLANET_COLORS[result.currentHora] }}>
              CURRENT HORA · #{result.horaNumber}
            </div>
            <div className="font-serif text-5xl mb-2" style={{ color: PLANET_COLORS[result.currentHora] }}>
              {result.currentHora}
            </div>
            <div className="text-text-muted">{result.nature}</div>
            <div className="text-sm text-text-faint mt-2 font-mono">
              {result.startTime} – {result.endTime}
            </div>
          </div>

          {/* What to do */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-6">
              <div className="eyebrow text-emerald mb-3">✓ अनुकूल · FAVORS</div>
              <ul className="space-y-2 text-sm">
                {result.favors.map((f, i) => (
                  <li key={i} className="flex gap-2"><span className="text-emerald">•</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-saffron/10 border border-saffron/30 rounded-2xl p-6">
              <div className="eyebrow text-saffron mb-3">✗ बचें · AVOID</div>
              <ul className="space-y-2 text-sm">
                {result.avoid.map((a, i) => (
                  <li key={i} className="flex gap-2"><span className="text-saffron">•</span>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Upcoming horas */}
          <div className="bg-bg-elev border border-strong rounded-2xl p-6">
            <div className="eyebrow text-gold mb-4">आगामी होराएँ · UPCOMING HORAS</div>
            <div className="space-y-2">
              {result.upcomingHoras.map((h, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-bg/50">
                  <div className="text-2xl">{PLANET_EMOJI[h.planet]}</div>
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: PLANET_COLORS[h.planet] }}>{h.planet}</div>
                    <div className="text-xs text-text-muted">{h.nature}</div>
                  </div>
                  <div className="font-mono text-sm text-text-faint">{h.time}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </ServicePageWrapper>
  );
}
