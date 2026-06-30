'use client';

import { useState, useEffect } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import { calculatePanchang, type PanchangResult } from '@/lib/panchang';

export default function PanchangPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<PanchangResult | null>(null);

  useEffect(() => {
    setResult(calculatePanchang(date));
  }, [date]);

  return (
    <ServicePageWrapper
      titleHi="दैनिक पंचांग"
      titleEn="Daily Panchang"
      emoji="🌅"
      description="Vedic calendar's five elements (Panch-Anga) for any date — essential for selecting auspicious times."
      requireBirthDetails={false}
    >
      {() => (
        <>
          <div className="bg-bg-elev border border-strong rounded-xl p-4 mb-6 flex items-center gap-4 flex-wrap">
            <label className="text-sm text-text-muted">Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input max-w-[200px]" />
            <button onClick={() => setDate(new Date().toISOString().split('T')[0])} className="btn-ghost text-sm">Today</button>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card title="वार · Vaar (Weekday)" emoji="📅">
                  <div className="font-serif text-2xl">{result.vaar.name}</div>
                  <p className="text-text-muted text-sm mt-1">Ruled by: {result.vaar.planet}</p>
                  <p className="text-text-muted text-sm">Nature: {result.vaar.nature}</p>
                </Card>
                <Card title="तिथि · Tithi" emoji="🌙">
                  <div className="font-serif text-2xl">{result.tithi.name}</div>
                  <p className="text-text-muted text-sm mt-1">{result.tithi.paksha} Paksha · Day {result.tithi.number > 15 ? result.tithi.number - 15 : result.tithi.number}</p>
                  <p className="text-text-muted text-sm">Deity: {result.tithi.deity}</p>
                </Card>
                <Card title="नक्षत्र · Nakshatra" emoji="⭐">
                  <div className="font-serif text-2xl">{result.nakshatra.name}</div>
                  <p className="text-text-muted text-sm mt-1">Deity: {result.nakshatra.deity}</p>
                  <p className="text-text-muted text-sm">Ruling planet: {result.nakshatra.lord}</p>
                </Card>
                <Card title="योग · Yoga" emoji="🕉️">
                  <div className="font-serif text-2xl">{result.yoga.name}</div>
                  <p className={`text-sm mt-1 font-medium ${
                    result.yoga.nature === 'Auspicious' ? 'text-emerald' :
                    result.yoga.nature === 'Inauspicious' ? 'text-saffron' : 'text-gold'
                  }`}>{result.yoga.nature}</p>
                </Card>
                <Card title="करण · Karana" emoji="⚡">
                  <div className="font-serif text-2xl">{result.karana.name}</div>
                  <p className={`text-sm mt-1 font-medium ${result.karana.nature === 'Auspicious' ? 'text-emerald' : 'text-saffron'}`}>
                    {result.karana.nature}
                  </p>
                </Card>
                <Card title="चंद्र अवस्था · Moon Phase" emoji="🌗">
                  <div className="font-serif text-xl">{result.moonPhase}</div>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <Card title="Sunrise · सूर्योदय" emoji="🌅">
                  <div className="font-serif text-2xl">{result.sunrise}</div>
                </Card>
                <Card title="Sunset · सूर्यास्त" emoji="🌇">
                  <div className="font-serif text-2xl">{result.sunset}</div>
                </Card>
                <Card title="राहु काल · Rahu Kaal" emoji="⚠️" color="saffron">
                  <div className="font-serif text-xl text-saffron">{result.rahuKaal.start}–{result.rahuKaal.end}</div>
                  <p className="text-text-muted text-xs mt-1">Avoid new starts during this time</p>
                </Card>
              </div>

              <Card title="अभिजित मुहूर्त · Abhijit Muhurat" emoji="✨" color="emerald">
                <div className="font-serif text-xl text-emerald">{result.abhijitMuhurat.start}–{result.abhijitMuhurat.end}</div>
                <p className="text-text-muted text-sm mt-1">Universally auspicious — good for any important work</p>
              </Card>

              {result.recommendations.length > 0 && (
                <div className="bg-bg-elev border border-strong rounded-2xl p-6">
                  <div className="eyebrow text-gold mb-3">सूचनाएँ · RECOMMENDATIONS</div>
                  <ul className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="text-sm flex gap-2"><span className="text-gold">→</span><span>{r}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </ServicePageWrapper>
  );
}

function Card({ title, emoji, children, color }: { title: string; emoji: string; children: React.ReactNode; color?: string }) {
  return (
    <div className={`bg-bg-elev border ${color === 'saffron' ? 'border-saffron/40' : color === 'emerald' ? 'border-emerald/40' : 'border-strong'} rounded-xl p-5`}>
      <div className="flex items-center gap-2 mb-2 eyebrow text-gold">
        <span className="text-xl">{emoji}</span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
