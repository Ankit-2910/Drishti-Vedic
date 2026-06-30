'use client';

import { getMissingNumberRemedies } from '@/lib/services';
import { useLang } from '@/lib/i18n';

export default function MissingNumberRemedies({ missingNumbers }: { missingNumbers: number[] }) {
  const { lang } = useLang();
  const remedies = getMissingNumberRemedies(missingNumbers);

  if (remedies.length === 0) {
    return (
      <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-6">
        <div className="eyebrow text-emerald mb-2">
          {lang === 'hi' ? 'कोई अनुपस्थित संख्या नहीं' : 'NO MISSING NUMBERS'}
        </div>
        <p className="text-sm text-text-muted">
          {lang === 'hi'
            ? 'आपके लो शू ग्रिड में सभी 9 संख्याएँ उपस्थित हैं — यह एक दुर्लभ और संतुलित विन्यास है। कोई विशेष उपाय आवश्यक नहीं।'
            : 'All 9 numbers are present in your Lo Shu Grid — a rare, balanced configuration. No specific remedies needed.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-elev border border-strong rounded-2xl p-6">
      <div className="eyebrow text-gold mb-1">
        {lang === 'hi' ? 'अनुपस्थित संख्या उपाय + मंत्र' : 'MISSING NUMBER REMEDIES + MANTRA'}
      </div>
      <p className="text-text-muted text-sm mb-5">
        {lang === 'hi'
          ? 'आपके ग्रिड में जो संख्याएँ अनुपस्थित हैं, वे जीवन के कुछ क्षेत्रों में कमज़ोरी दर्शाती हैं। नीचे हर अनुपस्थित संख्या के लिए ग्रह, उपाय और मंत्र दिए गए हैं।'
          : 'Numbers missing from your grid indicate weaker life-areas. Below is the governing planet, a practical remedy, and the mantra for each.'}
      </p>

      <div className="space-y-4">
        {remedies.map((r) => (
          <div key={r.number} className="rounded-xl border border-[rgba(245,158,11,0.15)] p-5 bg-bg/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-saffron/15 border border-saffron/40 grid place-items-center font-serif text-2xl text-saffron shrink-0">
                {r.number}
              </div>
              <div>
                <div className="font-serif text-lg leading-tight">
                  {lang === 'hi' ? r.lifeArea.hi : r.lifeArea.en}
                </div>
                <div className="text-xs text-text-faint">{r.planet}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Remedy */}
              <div>
                <div className="text-emerald text-xs uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'उपाय' : 'Remedy'}
                </div>
                <p className="text-sm">{lang === 'hi' ? r.remedy.hi : r.remedy.en}</p>
              </div>
              {/* Mantra */}
              <div>
                <div className="text-gold text-xs uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'मंत्र' : 'Mantra'}
                </div>
                <div className="font-serif text-xl text-gold-light leading-snug">{r.mantra}</div>
                <div className="font-mono text-text-muted text-xs mt-0.5">{r.transliteration}</div>
                <div className="text-text-faint text-xs mt-1">
                  {r.count}× {lang === 'hi' ? 'प्रतिदिन' : 'daily'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
