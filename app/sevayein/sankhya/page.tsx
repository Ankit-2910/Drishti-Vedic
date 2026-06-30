'use client';

import { useState } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import ShareButtons from '@/components/ShareButtons';
import { generateNumerologyReport, calculateNaamank, type NumerologyReport } from '@/lib/numerology';
import { useLang } from '@/lib/i18n';

// Reduce any string of digits to single digit
function reduceNumber(input: string): number {
  const digits = input.replace(/\D/g, '');
  if (!digits) return 0;
  let sum = digits.split('').reduce((s, d) => s + parseInt(d, 10), 0);
  while (sum > 9) sum = String(sum).split('').reduce((s, d) => s + parseInt(d, 10), 0);
  return sum;
}

export default function SankhyaPage() {
  const { lang } = useLang();
  const [report, setReport] = useState<NumerologyReport | null>(null);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<{ num: number; lucky: boolean } | null>(null);

  function checkNumber() {
    if (!report) return;
    const num = reduceNumber(testInput);
    const lucky = report.luckyNumbers.includes(num);
    setTestResult({ num, lucky });
  }

  return (
    <ServicePageWrapper
      titleHi="संख्या ज्योतिष"
      titleEn="Number Astrology"
      emoji="📱"
      description="Lucky numbers for your phone, vehicle, house, and business. Check if any number harmonizes with your personal numerology."
    >
      {(profile) => {
        if (profile && !report) {
          setReport(generateNumerologyReport({
            fullName: profile.fullName,
            date: profile.birthDate,
            gender: profile.gender,
          }));
        }

        return report ? (
          <div className="space-y-6 print-area">
            {/* Lucky numbers */}
            <div className="bg-gradient-to-br from-gold/10 to-saffron/10 border border-gold/30 rounded-2xl p-6 text-center">
              <div className="eyebrow text-gold mb-3">
                {lang === 'hi' ? 'आपके भाग्यशाली अंक' : 'YOUR LUCKY NUMBERS'}
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                {report.luckyNumbers.map((n) => (
                  <div key={n} className="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold grid place-items-center font-serif text-2xl text-gold">
                    {n}
                  </div>
                ))}
              </div>
            </div>

            {/* Number checker */}
            <div className="bg-bg-elev border border-strong rounded-2xl p-6">
              <div className="eyebrow text-gold mb-3">
                {lang === 'hi' ? 'कोई संख्या जाँचें' : 'CHECK ANY NUMBER'}
              </div>
              <p className="text-text-muted text-sm mb-4">
                {lang === 'hi'
                  ? 'फ़ोन नंबर, गाड़ी नंबर, मकान नंबर — कुछ भी डालें। हम उसका मूल अंक निकालकर बताएँगे कि वह आपके लिए शुभ है या नहीं।'
                  : 'Enter a phone number, vehicle number, house number — anything. We reduce it to its root digit and tell you if it is lucky for you.'}
              </p>
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder={lang === 'hi' ? 'जैसे: 9826012345' : 'e.g. 9826012345'}
                  className="input flex-1 min-w-[200px]"
                />
                <button onClick={checkNumber} disabled={!testInput} className="btn-primary disabled:opacity-50">
                  {lang === 'hi' ? 'जाँचें' : 'Check'} →
                </button>
              </div>

              {testResult && (
                <div className={`mt-4 rounded-xl p-5 border-2 text-center ${
                  testResult.lucky ? 'bg-emerald/10 border-emerald/40' : 'bg-saffron/10 border-saffron/40'
                }`}>
                  <div className="text-text-muted text-sm mb-1">
                    {lang === 'hi' ? 'मूल अंक' : 'Root number'}
                  </div>
                  <div className="font-serif text-5xl mb-2" style={{ color: testResult.lucky ? '#10b981' : '#ea580c' }}>
                    {testResult.num}
                  </div>
                  <div className="font-medium" style={{ color: testResult.lucky ? '#10b981' : '#ea580c' }}>
                    {testResult.lucky
                      ? (lang === 'hi' ? '✓ शुभ — यह संख्या आपके लिए अनुकूल है' : '✓ Lucky — this number favors you')
                      : (lang === 'hi' ? '○ तटस्थ — यह आपकी भाग्यशाली सूची में नहीं है' : '○ Neutral — not in your lucky set')}
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <RecommendCard
                icon="📱"
                title={lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                tip={lang === 'hi'
                  ? `ऐसा नंबर चुनें जिसके सभी अंकों का योग ${report.luckyNumbers.slice(0, 3).join(', ')} में से कोई एक हो।`
                  : `Choose a number whose digits sum to one of: ${report.luckyNumbers.slice(0, 3).join(', ')}.`}
              />
              <RecommendCard
                icon="🚗"
                title={lang === 'hi' ? 'गाड़ी नंबर' : 'Vehicle Number'}
                tip={lang === 'hi'
                  ? `रजिस्ट्रेशन नंबर का मूल अंक ${report.mulank} या ${report.luckyNumbers[1] || report.mulank} रखने का प्रयास करें।`
                  : `Aim for a registration whose root is ${report.mulank} or ${report.luckyNumbers[1] || report.mulank}.`}
              />
              <RecommendCard
                icon="🏠"
                title={lang === 'hi' ? 'मकान नंबर' : 'House Number'}
                tip={lang === 'hi'
                  ? `घर का मूल अंक ${report.luckyNumbers[0]} सबसे शुभ रहेगा; ${report.avoidNumbers.join(', ')} से बचें।`
                  : `Root ${report.luckyNumbers[0]} is most auspicious; avoid ${report.avoidNumbers.join(', ')}.`}
              />
              <RecommendCard
                icon="💼"
                title={lang === 'hi' ? 'व्यापार / ब्रांड नाम' : 'Business / Brand Name'}
                tip={lang === 'hi'
                  ? `ब्रांड नाम का नामांक ${report.luckyNumbers[0]} या ${report.luckyNumbers[2] || report.mulank} होने से सफलता बढ़ती है।`
                  : `A brand name with Naamank ${report.luckyNumbers[0]} or ${report.luckyNumbers[2] || report.mulank} amplifies success.`}
              />
            </div>

            <ShareButtons shareText={`My lucky numbers: ${report.luckyNumbers.join(', ')} (DRISHTI Vedic+)`} />
          </div>
        ) : null;
      }}
    </ServicePageWrapper>
  );
}

function RecommendCard({ icon, title, tip }: { icon: string; title: string; tip: string }) {
  return (
    <div className="bg-bg-elev border border-strong rounded-xl p-5">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-serif text-lg mb-1">{title}</div>
      <p className="text-text-muted text-sm">{tip}</p>
    </div>
  );
}
