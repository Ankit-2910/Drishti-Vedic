'use client';

import { useState } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import ShareButtons from '@/components/ShareButtons';
import MissingNumberRemedies from '@/components/MissingNumberRemedies';
import { calculateNaamank, calculateSoulNumber, calculatePersonalityNumber, calculateMulank, generateNumerologyReport } from '@/lib/numerology';
import { useLang } from '@/lib/i18n';

// Compatibility between Naamank and Mulank
const NAME_HARMONY: Record<number, { en: string; hi: string }> = {
  1: { en: 'Leadership, independence, fresh starts', hi: 'नेतृत्व, स्वतंत्रता, नई शुरुआत' },
  2: { en: 'Diplomacy, partnership, sensitivity', hi: 'कूटनीति, साझेदारी, संवेदनशीलता' },
  3: { en: 'Creativity, expression, optimism', hi: 'रचनात्मकता, अभिव्यक्ति, आशावाद' },
  4: { en: 'Stability, discipline, hard work', hi: 'स्थिरता, अनुशासन, परिश्रम' },
  5: { en: 'Freedom, adaptability, communication', hi: 'स्वतंत्रता, अनुकूलनशीलता, संवाद' },
  6: { en: 'Love, harmony, responsibility, beauty', hi: 'प्रेम, सामंजस्य, ज़िम्मेदारी, सौंदर्य' },
  7: { en: 'Spirituality, analysis, introspection', hi: 'आध्यात्म, विश्लेषण, आत्ममंथन' },
  8: { en: 'Ambition, power, material success', hi: 'महत्वाकांक्षा, शक्ति, भौतिक सफलता' },
  9: { en: 'Compassion, courage, humanitarian', hi: 'करुणा, साहस, मानवता' },
};

export default function NameNumerologyPage() {
  const { lang } = useLang();
  const [name, setName] = useState('');
  const [result, setResult] = useState<{
    naamank: number; soul: number; personality: number; mulank: number; harmonic: boolean;
  } | null>(null);

  function analyze(fullName: string, birthDate?: string) {
    const naamank = calculateNaamank(fullName);
    const soul = calculateSoulNumber(fullName);
    const personality = calculatePersonalityNumber(fullName);
    const mulank = birthDate ? calculateMulank(birthDate) : 0;
    // Name is "harmonic" with mulank if compatible
    const harmonic = mulank === 0 || [naamank, mulank].includes(naamank);
    setResult({ naamank, soul, personality, mulank, harmonic });
  }

  return (
    <ServicePageWrapper
      titleHi="नाम अंक विज्ञान"
      titleEn="Name Numerology"
      emoji="🔤"
      description="Chaldean name analysis. Your name carries a vibration that shapes how the world receives you — and whether it harmonizes with your birth number."
      requireBirthDetails={false}
    >
      {(profile) => (
        <div className="space-y-6 print-area">
          <div className="bg-bg-elev border border-strong rounded-2xl p-6">
            <label className="block text-sm text-text-muted mb-2">
              {lang === 'hi' ? 'विश्लेषण हेतु नाम' : 'Name to analyze'}
            </label>
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: Ankit Dubey' : 'e.g. Ankit Dubey'}
                className="input flex-1 min-w-[200px]"
              />
              <button
                onClick={() => name && analyze(name, profile?.birthDate)}
                disabled={!name}
                className="btn-primary disabled:opacity-50"
              >
                {lang === 'hi' ? 'विश्लेषण करें' : 'Analyze'} →
              </button>
            </div>
            {profile?.fullName && (
              <button
                onClick={() => { setName(profile.fullName); analyze(profile.fullName, profile.birthDate); }}
                className="text-gold text-sm hover:underline mt-3"
              >
                {lang === 'hi' ? `मेरा नाम उपयोग करें (${profile.fullName})` : `Use my name (${profile.fullName})`} →
              </button>
            )}
          </div>

          {result && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <NumBox label={lang === 'hi' ? 'नामांक' : 'Naamank'} sub={lang === 'hi' ? 'नाम संख्या' : 'Name Number'} value={result.naamank} />
                <NumBox label={lang === 'hi' ? 'आत्मांक' : 'Soul'} sub={lang === 'hi' ? 'स्वर' : 'Vowels'} value={result.soul} />
                <NumBox label={lang === 'hi' ? 'व्यक्तित्व' : 'Personality'} sub={lang === 'hi' ? 'व्यंजन' : 'Consonants'} value={result.personality} />
              </div>

              <div className="bg-bg-elev border border-strong rounded-2xl p-6">
                <div className="eyebrow text-gold mb-3">
                  {lang === 'hi' ? 'नामांक का अर्थ' : 'MEANING OF YOUR NAME NUMBER'} ({result.naamank})
                </div>
                <p className="font-serif text-lg">
                  {lang === 'hi' ? NAME_HARMONY[result.naamank].hi : NAME_HARMONY[result.naamank].en}
                </p>
              </div>

              {result.mulank > 0 && (
                <div className={`rounded-2xl p-6 border-2 ${
                  result.harmonic ? 'bg-emerald/10 border-emerald/40' : 'bg-saffron/10 border-saffron/40'
                }`}>
                  <div className="eyebrow mb-3" style={{ color: result.harmonic ? '#10b981' : '#ea580c' }}>
                    {lang === 'hi' ? 'नाम ↔ मूलांक सामंजस्य' : 'NAME ↔ MULANK HARMONY'}
                  </div>
                  <p className="text-sm">
                    {result.harmonic
                      ? (lang === 'hi'
                        ? `आपका नामांक (${result.naamank}) आपके मूलांक (${result.mulank}) से सामंजस्य में है — यह एक शुभ संयोग है जो आपके नाम की ऊर्जा को आपके स्वभाव के अनुरूप बनाता है।`
                        : `Your Naamank (${result.naamank}) harmonizes with your Mulank (${result.mulank}) — an auspicious alignment where your name's energy supports your core nature.`)
                      : (lang === 'hi'
                        ? `आपका नामांक (${result.naamank}) और मूलांक (${result.mulank}) भिन्न हैं। यह सामान्य है — किंतु नाम की वर्तनी में सूक्ष्म समायोजन (जैसे एक अतिरिक्त अक्षर) से अधिक सामंजस्य लाया जा सकता है। विशेषज्ञ परामर्श अनुशंसित।`
                        : `Your Naamank (${result.naamank}) and Mulank (${result.mulank}) differ. This is common — a subtle spelling adjustment (like an added letter) can bring stronger harmony. Expert consultation recommended.`)}
                  </p>
                </div>
              )}

              <ShareButtons shareText={`Name numerology for ${name}: Naamank ${result.naamank} (DRISHTI Vedic+)`} />

              {/* Missing number remedies + mantra (from birth Lo Shu grid) */}
              {profile?.birthDate && (
                <MissingNumberRemedies
                  missingNumbers={
                    generateNumerologyReport({
                      fullName: profile.fullName || name,
                      date: profile.birthDate,
                      gender: profile.gender,
                    }).loShuGrid.missingNumbers
                  }
                />
              )}
            </>
          )}
        </div>
      )}
    </ServicePageWrapper>
  );
}

function NumBox({ label, sub, value }: { label: string; sub: string; value: number }) {
  return (
    <div className="bg-bg-elev border border-strong rounded-xl p-4 text-center">
      <div className="eyebrow text-gold mb-2">{label}</div>
      <div className="font-serif text-5xl leading-none mb-1">{value}</div>
      <div className="text-xs text-text-faint">{sub}</div>
    </div>
  );
}
