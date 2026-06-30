'use client';

import ServicePageWrapper from '@/components/ServicePageWrapper';
import { getLalKitabRemedies } from '@/lib/services';

export default function LalKitabPage() {
  const remedies = getLalKitabRemedies();

  return (
    <ServicePageWrapper
      titleHi="लाल किताब"
      titleEn="Lal Kitab Remedies"
      emoji="📕"
      description="The 'Red Book' tradition — simple, household, low-cost remedies that don't require gemstones or expensive rituals."
      requireBirthDetails={false}
    >
      {() => (
        <div className="space-y-3">
          <div className="bg-bg-elev border border-strong rounded-2xl p-6 mb-4">
            <p className="text-sm text-text-muted">
              Lal Kitab (literally "Red Book") is a 20th-century Vedic remedial tradition emphasizing practical, action-based remedies.
              Unlike classical Jyotish which prescribes expensive gemstones, Lal Kitab uses everyday items — turmeric, water, donations to specific people.
              Choose the remedies for planets that are afflicted in your chart.
            </p>
          </div>

          {remedies.map((r, i) => (
            <div key={i} className="bg-bg-elev border border-strong rounded-2xl p-6 hover:border-gold/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="font-serif text-2xl mb-1">{r.planet}</div>
                  <div className="text-text-muted text-xs uppercase tracking-wider mb-3">{r.significance}</div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-saffron text-xs uppercase tracking-wider mb-1">If afflicted →</div>
                      <p className="text-sm text-text-muted">{r.problem}</p>
                    </div>
                    <div>
                      <div className="text-emerald text-xs uppercase tracking-wider mb-1">Remedy</div>
                      <p className="text-sm">{r.remedy}</p>
                      <p className="text-text-faint text-xs mt-2 font-mono">Duration: {r.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-saffron/10 border border-saffron/30 rounded-2xl p-6 mt-6">
            <div className="eyebrow text-saffron mb-2">⚠ IMPORTANT GUIDANCE</div>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><span className="text-saffron">•</span>Don't perform remedies for ALL planets — only those afflicted in your chart</li>
              <li className="flex gap-2"><span className="text-saffron">•</span>Get a proper chart reading first (see /sevayein/dasha)</li>
              <li className="flex gap-2"><span className="text-saffron">•</span>Be consistent — don't skip days during the prescribed duration</li>
              <li className="flex gap-2"><span className="text-saffron">•</span>Results show in 40-108 days depending on the planet</li>
              <li className="flex gap-2"><span className="text-saffron">•</span>Combine with regular prayer, charity, and ethical conduct for full effect</li>
            </ul>
          </div>
        </div>
      )}
    </ServicePageWrapper>
  );
}
