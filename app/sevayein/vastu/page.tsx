'use client';

import { useState, useEffect } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import { calculateVastu, type VastuResult } from '@/lib/services';
import { calculateKuaNumber } from '@/lib/numerology';

export default function VastuPage() {
  const [vastu, setVastu] = useState<VastuResult | null>(null);
  const [kuaData, setKuaData] = useState<ReturnType<typeof calculateKuaNumber> | null>(null);

  return (
    <ServicePageWrapper
      titleHi="वास्तु"
      titleEn="Vastu Shastra"
      emoji="🧭"
      description="Direction-based science from your personal Kua number. Where to sleep, work, place safe — for prosperity and peace."
    >
      {(profile) => {
        if (profile && !vastu) {
          const k = calculateKuaNumber(profile.birthDate, profile.gender);
          setKuaData(k);
          setVastu(calculateVastu(k.kua));
        }

        return vastu && kuaData ? (
          <div className="space-y-6">
            {/* Kua hero */}
            <div className="bg-gradient-to-br from-gold/10 to-saffron/10 border border-gold/30 rounded-2xl p-6 text-center">
              <div className="eyebrow text-gold mb-2">YOUR KUA NUMBER</div>
              <div className="font-serif text-7xl text-gold">{vastu.kua}</div>
              <div className="text-text-muted mt-2 font-medium">{vastu.group}</div>
            </div>

            {/* Best directions */}
            <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-6">
              <div className="eyebrow text-emerald mb-4">✓ शुभ दिशाएँ · BEST DIRECTIONS</div>
              <div className="grid md:grid-cols-2 gap-3">
                {vastu.bestDirections.map((d, i) => (
                  <div key={i} className="bg-bg/40 rounded-xl p-4">
                    <div className="font-serif text-xl text-emerald">{d.direction}</div>
                    <div className="text-sm font-medium mt-1">{d.purpose}</div>
                    <div className="text-text-muted text-xs mt-1">{d.energy}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worst directions */}
            <div className="bg-saffron/10 border border-saffron/30 rounded-2xl p-6">
              <div className="eyebrow text-saffron mb-4">✗ अशुभ दिशाएँ · AVOID</div>
              <div className="grid md:grid-cols-2 gap-3">
                {vastu.worstDirections.map((d, i) => (
                  <div key={i} className="bg-bg/40 rounded-xl p-4">
                    <div className="font-serif text-xl text-saffron">{d.direction}</div>
                    <div className="text-sm text-text-muted mt-1">{d.problem}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home recommendations */}
            <div className="bg-bg-elev border border-strong rounded-2xl p-6">
              <div className="eyebrow text-gold mb-3">🏠 घर के लिए · HOME RECOMMENDATIONS</div>
              <ul className="space-y-2">
                {vastu.homeRecommendations.map((r, i) => (
                  <li key={i} className="text-sm flex gap-2"><span className="text-gold">•</span>{r}</li>
                ))}
              </ul>
            </div>

            {/* Work recommendations */}
            <div className="bg-bg-elev border border-strong rounded-2xl p-6">
              <div className="eyebrow text-gold mb-3">💼 कार्यस्थल · WORKPLACE</div>
              <ul className="space-y-2">
                {vastu.workRecommendations.map((r, i) => (
                  <li key={i} className="text-sm flex gap-2"><span className="text-gold">•</span>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;
      }}
    </ServicePageWrapper>
  );
}
