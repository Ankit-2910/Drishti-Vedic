'use client';

import type { DrishtiScoreResult } from '@/lib/drishti-score';

export default function DrishtiScoreCard({ result }: { result: DrishtiScoreResult }) {
  return (
    <div className="space-y-6">
      {/* Hero score */}
      <div 
        className="rounded-2xl p-8 border-2 text-center"
        style={{
          backgroundColor: result.bandColor + '15',
          borderColor: result.bandColor,
        }}
      >
        <div className="eyebrow mb-3" style={{ color: result.bandColor }}>DRISHTI SCORE</div>
        <div className="font-serif text-8xl font-medium leading-none mb-2" style={{ color: result.bandColor }}>
          {result.drishtiScore}
        </div>
        <div className="text-text-muted text-sm mb-4">/ 100</div>
        <div className="font-serif text-2xl mb-2" style={{ color: result.bandColor }}>
          {result.band}
        </div>
        <p className="text-text-muted max-w-xl mx-auto text-sm leading-relaxed">
          {result.verdict}
        </p>
      </div>
      
      {/* Component breakdown */}
      <div className="bg-bg-elev border border-strong rounded-2xl p-6">
        <div className="eyebrow text-gold mb-4">SCORE COMPONENTS</div>
        <div className="space-y-3">
          <ProgressBar 
            label="Astrology (Ashtakoot)" 
            value={result.components.astrologyPoints} 
            max={50} 
            color="#f59e0b"
            detail={`${result.astrology.ashtakoot.total}/36 guna scaled to 50`}
          />
          <ProgressBar 
            label="Numerology" 
            value={result.components.numerologyPoints} 
            max={25} 
            color="#818cf8"
            detail={result.numerology.compatibility.verdict}
          />
          <ProgressBar 
            label="Lo Shu Grid Synergy" 
            value={result.components.loShuGridPoints} 
            max={15} 
            color="#10b981"
            detail={`${result.numerology.compatibility.loShuGridSynergy.complementary.length} complementary numbers`}
          />
          <ProgressBar 
            label="Dosha Adjustments" 
            value={result.components.doshaPoints} 
            max={10} 
            color="#ea580c"
            detail="Manglik / Nadi / Bhakoot resolution status"
          />
        </div>
      </div>
      
      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-6">
          <div className="eyebrow text-emerald mb-3">STRENGTHS OF THIS MATCH</div>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-emerald mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Challenges */}
      {result.challenges.length > 0 && (
        <div className="bg-saffron/10 border border-saffron/30 rounded-2xl p-6">
          <div className="eyebrow text-saffron mb-3">AREAS TO BE MINDFUL OF</div>
          <ul className="space-y-2">
            {result.challenges.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-saffron mt-0.5">⚠</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Remedies */}
      {result.remedies.length > 0 && (
        <div className="bg-indigo/10 border border-indigo/30 rounded-2xl p-6">
          <div className="eyebrow text-indigo mb-3">SUGGESTED REMEDIES</div>
          <ul className="space-y-2">
            {result.remedies.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-indigo mt-0.5">▸</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Recommendations */}
      <div className="bg-bg-elev border border-strong rounded-2xl p-6">
        <div className="eyebrow text-gold mb-3">RECOMMENDED NEXT STEPS</div>
        <ol className="space-y-2.5 text-sm">
          {result.recommendations.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-gold font-mono w-6">{i + 1}.</span>
              <span>{r}</span>
            </li>
          ))}
        </ol>
      </div>
      
      {/* Shubh Muhurta */}
      <div className="bg-gradient-to-br from-gold/10 to-saffron/10 border border-gold/30 rounded-2xl p-6">
        <div className="eyebrow text-gold mb-3">SHUBH MUHURTA (Wedding Window)</div>
        <p className="text-sm mb-3">{result.shubhMuhurta.note}</p>
        {result.shubhMuhurta.hasGoodWindow && (
          <div className="flex flex-wrap gap-2">
            {result.shubhMuhurta.suggestedMonths.map((m) => (
              <span key={m} className="px-3 py-1 bg-gold/20 border border-gold/40 rounded-full text-sm">
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max, color, detail }: { label: string; value: number; max: number; color: string; detail?: string }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-mono text-xs" style={{ color }}>{value} / {max}</span>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {detail && (
        <div className="text-text-faint text-xs mt-1.5">{detail}</div>
      )}
    </div>
  );
}
