'use client';

interface LoShuGridProps {
  grid: number[][];
  missingNumbers: number[];
  strengths: string[];
  weaknesses: string[];
}

// Number positions in Lo Shu Grid
const NUMBER_AT: Record<string, number> = {
  '0-0': 4, '0-1': 9, '0-2': 2,
  '1-0': 3, '1-1': 5, '1-2': 7,
  '2-0': 8, '2-1': 1, '2-2': 6,
};

// Thematic life-area meaning for each number (Vedic Lo Shu tradition)
// Matches the competitor screenshot Ankit Sir shared
const NUMBER_THEME: Record<number, { hi: string; en: string; color: string; bgClass: string }> = {
  1: { hi: 'कैरियर और सफलता', en: 'Career & Success', color: '#ea580c', bgClass: 'bg-orange-500/10' },
  2: { hi: 'विवाह और संबंध', en: 'Marriage & Relations', color: '#ec4899', bgClass: 'bg-pink-500/10' },
  3: { hi: 'स्वास्थ्य और परिवार', en: 'Health & Family', color: '#10b981', bgClass: 'bg-emerald-500/10' },
  4: { hi: 'धन और संपत्ति', en: 'Wealth & Property', color: '#a855f7', bgClass: 'bg-purple-500/10' },
  5: { hi: 'ऊर्जा और स्थिरता', en: 'Energy & Stability', color: '#f59e0b', bgClass: 'bg-amber-500/10' },
  6: { hi: 'मित्र और नई शुरुआत', en: 'Friends & New Start', color: '#06b6d4', bgClass: 'bg-cyan-500/10' },
  7: { hi: 'बच्चे और रचनात्मकता', en: 'Children & Creativity', color: '#fbbf24', bgClass: 'bg-yellow-500/10' },
  8: { hi: 'ज्ञान और अंतर्ज्ञान', en: 'Knowledge & Intuition', color: '#3b82f6', bgClass: 'bg-blue-500/10' },
  9: { hi: 'प्रतिष्ठा और प्रसिद्धि', en: 'Reputation & Fame', color: '#ef4444', bgClass: 'bg-red-500/10' },
};

export default function LoShuGrid({ grid, missingNumbers, strengths, weaknesses }: LoShuGridProps) {
  return (
    <div className="space-y-6">
      {/* Main grid */}
      <div className="bg-bg-elev border border-strong rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="eyebrow text-gold">लो शू ग्रिड · LO SHU GRID</span>
          <span className="text-xs text-text-faint">3×3 Vedic Magic Square</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Visual grid */}
          <div>
            <div className="grid grid-cols-3 gap-2 max-w-[320px] mx-auto md:mx-0">
              {grid.map((row, ri) =>
                row.map((count, ci) => {
                  const number = NUMBER_AT[`${ri}-${ci}`];
                  const theme = NUMBER_THEME[number];
                  const isPresent = count > 0;
                  const isCenter = ri === 1 && ci === 1;

                  return (
                    <div
                      key={`${ri}-${ci}`}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-xl border-2 relative overflow-hidden
                        ${isPresent
                          ? 'border-current'
                          : 'border-[rgba(245,158,11,0.12)] bg-bg/30'}
                        ${isCenter ? 'ring-2 ring-gold/30' : ''}
                        transition-all
                      `}
                      style={isPresent ? {
                        backgroundColor: theme.color + '15',
                        borderColor: theme.color + '60',
                        color: theme.color,
                      } : { color: '#6b6557' }}
                    >
                      <div className="text-4xl font-serif font-medium leading-none">
                        {number}
                      </div>
                      {count > 1 && (
                        <div className="text-xs font-mono mt-0.5 opacity-75">×{count}</div>
                      )}
                      {!isPresent && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl font-serif opacity-10">{number}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <p className="text-text-faint text-xs text-center mt-3 font-mono uppercase tracking-wider">
              Saturn-based · {missingNumbers.length} missing · {9 - missingNumbers.length} present
            </p>
          </div>

          {/* Arrows analysis */}
          <div className="space-y-4">
            {strengths.length > 0 && (
              <div>
                <div className="eyebrow text-emerald mb-2">शक्ति तीर · ARROWS OF STRENGTH</div>
                <ul className="space-y-1.5">
                  {strengths.map((s, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-emerald mt-0.5">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {weaknesses.length > 0 && (
              <div>
                <div className="eyebrow text-saffron mb-2">विकसित क्षेत्र · AREAS TO DEVELOP</div>
                <ul className="space-y-1.5">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-saffron mt-0.5">→</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {missingNumbers.length > 0 && (
              <div>
                <div className="eyebrow text-indigo mb-2">अनुपस्थित संख्याएँ · LIFE LESSONS</div>
                <div className="flex flex-wrap gap-2">
                  {missingNumbers.map((n) => {
                    const t = NUMBER_THEME[n];
                    return (
                      <span
                        key={n}
                        className="px-3 py-1 rounded-full text-xs font-medium border"
                        style={{ color: t.color, borderColor: t.color + '40', backgroundColor: t.color + '15' }}
                        title={t.en}
                      >
                        {n} · {t.hi}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thematic legend — life-area meaning per number (KEY DIFFERENTIATOR) */}
      <div className="bg-bg-elev border border-strong rounded-2xl p-6">
        <div className="eyebrow text-gold mb-1">कैसे गणना करें · NUMBER MEANINGS</div>
        <p className="text-text-muted text-sm mb-5">
          Each number governs a specific life area. Present numbers = your strengths. Missing = your karmic lessons.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const theme = NUMBER_THEME[num];
            const isPresent = !missingNumbers.includes(num);

            return (
              <div
                key={num}
                className="rounded-xl p-4 border relative overflow-hidden"
                style={{
                  backgroundColor: theme.color + (isPresent ? '15' : '08'),
                  borderColor: theme.color + (isPresent ? '40' : '15'),
                  opacity: isPresent ? 1 : 0.55,
                }}
              >
                <div
                  className="absolute -top-2 -right-2 text-6xl font-serif font-bold opacity-20"
                  style={{ color: theme.color }}
                >
                  {num}
                </div>
                <div className="relative">
                  <div
                    className="font-serif text-2xl font-medium mb-1"
                    style={{ color: theme.color }}
                  >
                    {num}
                  </div>
                  <div className="text-sm font-medium" style={{ color: theme.color }}>
                    {theme.hi}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">{theme.en}</div>
                  {isPresent && (
                    <div className="text-xs mt-2 font-mono text-emerald">✓ Present in your chart</div>
                  )}
                  {!isPresent && (
                    <div className="text-xs mt-2 font-mono text-saffron">○ Missing — lesson</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Directional meaning */}
      <div className="bg-bg-elev border border-strong rounded-2xl p-6">
        <div className="eyebrow text-gold mb-3">दिशात्मक अर्थ · DIRECTIONAL MEANING</div>
        <p className="text-text-muted text-sm">
          The Lo Shu Grid follows Saturn's energy through 8 directions. Each row, column, and diagonal sums to 15 —
          the "magic constant." Three or more numbers in any line form an <em>Arrow</em>.
          A complete arrow = inherited strength. A completely missing arrow = karmic blind-spot to consciously develop.
        </p>
      </div>
    </div>
  );
}
