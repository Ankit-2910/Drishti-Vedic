'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

interface Row {
  feature: { en: string; hi: string };
  drishti: boolean | string;
  others: boolean | string;
}

const ROWS: Row[] = [
  {
    feature: { en: 'Unified 100-point compatibility score', hi: 'एकीकृत 100-अंक संगतता स्कोर' },
    drishti: 'DRISHTI Score',
    others: false,
  },
  {
    feature: { en: 'Astrology + Numerology combined', hi: 'ज्योतिष + अंक विज्ञान एक साथ' },
    drishti: true,
    others: 'Separate, never merged',
  },
  {
    feature: { en: 'Lo Shu Grid with life-area meanings', hi: 'जीवन-क्षेत्र अर्थ सहित लो शू ग्रिड' },
    drishti: true,
    others: 'Grid only, no themes',
  },
  {
    feature: { en: 'Full bilingual (English + हिन्दी)', hi: 'पूर्ण द्विभाषी (English + हिन्दी)' },
    drishti: true,
    others: 'Usually one language',
  },
  {
    feature: { en: 'OM Dhwani ambient sound', hi: 'ॐ ध्वनि परिवेश ध्वनि' },
    drishti: true,
    others: false,
  },
  {
    feature: { en: 'B2B partner dashboard for bureaus', hi: 'ब्यूरो हेतु B2B पार्टनर डैशबोर्ड' },
    drishti: true,
    others: 'Consumer-only',
  },
  {
    feature: { en: 'Print / PDF + WhatsApp share', hi: 'प्रिंट / PDF + व्हाट्सएप साझा' },
    drishti: true,
    others: 'PDF behind paywall',
  },
  {
    feature: { en: 'Numerology = real math (not AI guess)', hi: 'अंक विज्ञान = वास्तविक गणित' },
    drishti: true,
    others: 'Often generic text',
  },
  {
    feature: { en: '14+ integrated services, one profile', hi: '14+ एकीकृत सेवाएँ, एक प्रोफ़ाइल' },
    drishti: true,
    others: 'Re-enter every time',
  },
  {
    feature: { en: 'DPDP Act 2023 privacy compliance', hi: 'DPDP अधिनियम 2023 गोपनीयता अनुपालन' },
    drishti: true,
    others: 'Rarely documented',
  },
  {
    feature: { en: 'Works fully offline / mock mode for demos', hi: 'डेमो हेतु पूर्ण ऑफ़लाइन / मॉक मोड' },
    drishti: true,
    others: false,
  },
  {
    feature: { en: 'Hidden charges / surprise paywalls', hi: 'छिपे शुल्क / अप्रत्याशित पेवॉल' },
    drishti: 'None',
    others: true,
  },
];

export default function WhyDrishtiPage() {
  const { lang } = useLang();

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <div className="eyebrow text-gold mb-4">{lang === 'hi' ? 'दृष्टि क्यों' : 'WHY DRISHTI'}</div>
        <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
          {lang === 'hi' ? 'हर दूसरी वेबसाइट से ' : 'Years ahead of '}
          <em className="bg-gradient-to-br from-gold-light to-saffron bg-clip-text text-transparent">
            {lang === 'hi' ? 'वर्षों आगे।' : 'every other site.'}
          </em>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          {lang === 'hi'
            ? 'DRISHTI भारत का एकमात्र मंच है जो वैदिक ज्योतिष और अंक विज्ञान को एक ही 100-अंक स्कोर में जोड़ता है।'
            : 'DRISHTI is the only platform in India that fuses Vedic Astrology and Numerology into a single 100-point score.'}
        </p>
      </header>

      {/* Comparison table */}
      <div className="bg-bg-elev border border-strong rounded-2xl overflow-hidden mb-10">
        <div className="grid grid-cols-[1.6fr_1fr_1fr] text-sm">
          {/* Header */}
          <div className="px-4 py-4 bg-surface eyebrow text-text-muted">
            {lang === 'hi' ? 'विशेषता' : 'Feature'}
          </div>
          <div className="px-4 py-4 bg-gold/15 text-center eyebrow text-gold border-x border-[rgba(245,158,11,0.15)]">
            DRISHTI
          </div>
          <div className="px-4 py-4 bg-surface text-center eyebrow text-text-faint">
            {lang === 'hi' ? 'अन्य साइटें' : 'Other Sites'}
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <RowCells key={i} row={row} lang={lang} index={i} />
          ))}
        </div>
      </div>

      {/* The moat callout */}
      <div className="bg-gradient-to-br from-gold/15 to-saffron/10 border border-gold/30 rounded-2xl p-8 text-center mb-10">
        <div className="eyebrow text-gold mb-3">{lang === 'hi' ? 'हमारी खाई (Moat)' : 'THE MOAT'}</div>
        <h2 className="font-serif text-3xl mb-4">DRISHTI Score™</h2>
        <p className="text-text-muted max-w-xl mx-auto mb-6">
          {lang === 'hi'
            ? 'कोई भी प्रतियोगी ज्योतिष + अंक विज्ञान को एक ही मीट्रिक में नहीं जोड़ता। यही हमें अद्वितीय बनाता है।'
            : 'No competitor combines astrology + numerology into one metric. That is what makes us genuinely unique.'}
        </p>
        <div className="flex justify-center gap-3 flex-wrap text-xs font-mono">
          <span className="px-3 py-1.5 bg-gold/20 border border-gold/30 rounded-full">50 {lang === 'hi' ? 'ज्योतिष' : 'Astrology'}</span>
          <span className="px-3 py-1.5 bg-indigo/20 border border-indigo/30 rounded-full">25 {lang === 'hi' ? 'अंक विज्ञान' : 'Numerology'}</span>
          <span className="px-3 py-1.5 bg-emerald/20 border border-emerald/30 rounded-full">15 {lang === 'hi' ? 'लो शू' : 'Lo Shu'}</span>
          <span className="px-3 py-1.5 bg-saffron/20 border border-saffron/30 rounded-full">10 {lang === 'hi' ? 'दोष' : 'Dosha'}</span>
        </div>
      </div>

      <div className="text-center">
        <Link href="/match" className="btn-primary">
          {lang === 'hi' ? 'अभी DRISHTI Score देखें' : 'Try the DRISHTI Score now'} →
        </Link>
      </div>

      <footer className="text-center mt-16 text-text-faint text-xs font-mono tracking-wider uppercase">
        DRISHTI Vedic+ · A Shivanchal Consultants Product
      </footer>
    </main>
  );
}

function RowCells({ row, lang, index }: { row: Row; lang: 'en' | 'hi'; index: number }) {
  const bg = index % 2 === 0 ? '' : 'bg-bg/30';
  return (
    <>
      <div className={`px-4 py-4 border-t border-[rgba(245,158,11,0.08)] ${bg}`}>
        {lang === 'hi' ? row.feature.hi : row.feature.en}
      </div>
      <div className={`px-4 py-4 border-t border-x border-[rgba(245,158,11,0.15)] text-center bg-gold/5`}>
        <Cell value={row.drishti} positive />
      </div>
      <div className={`px-4 py-4 border-t border-[rgba(245,158,11,0.08)] text-center ${bg}`}>
        <Cell value={row.others} positive={false} />
      </div>
    </>
  );
}

function Cell({ value, positive }: { value: boolean | string; positive: boolean }) {
  if (value === true) {
    return <span className={positive ? 'text-emerald text-lg' : 'text-saffron text-lg'}>{positive ? '✓' : '✗'}</span>;
  }
  if (value === false) {
    return <span className={positive ? 'text-saffron text-lg' : 'text-emerald text-lg'}>{positive ? '✗' : '✓'}</span>;
  }
  // string
  return <span className={`text-xs ${positive ? 'text-emerald font-medium' : 'text-text-faint'}`}>{value}</span>;
}
