'use client';

import Link from 'next/link';

interface Service {
  slug: string;
  titleHi: string;
  titleEn: string;
  emoji: string;
  gradient: string;
  description: string;
}

const VEDIC_ASTROLOGY: Service[] = [
  { slug: '/', titleHi: 'जन्म कुंडली', titleEn: 'Birth Chart', emoji: '📜', gradient: 'from-amber-500/20 to-orange-500/10', description: 'Full Vedic birth chart with planets, dashas, nakshatras' },
  { slug: '/match', titleHi: 'गुण मिलान', titleEn: 'DRISHTI Score Match', emoji: '💍', gradient: 'from-pink-500/20 to-rose-500/10', description: 'Unique 100-point compatibility (Ashtakoot + Numerology)' },
  { slug: '/sevayein/dasha', titleHi: 'दशा विश्लेषण', titleEn: 'Dasha Analysis', emoji: '🔮', gradient: 'from-indigo-500/20 to-blue-500/10', description: 'Vimshottari Mahadasha + Antardasha breakdown' },
  { slug: '/sevayein/raj-yoga', titleHi: 'राज योग', titleEn: 'Raj Yoga Detector', emoji: '👑', gradient: 'from-yellow-500/20 to-amber-500/10', description: 'Auspicious planetary combinations in your chart' },
  { slug: '/sevayein/sade-sati', titleHi: 'साढ़े साती', titleEn: 'Sade Sati Status', emoji: '🪐', gradient: 'from-purple-500/20 to-pink-500/10', description: 'Saturn 7.5-year transit phase analysis' },
  { slug: '/sevayein/mangal-dosh', titleHi: 'मंगल दोष', titleEn: 'Mangal Dosh', emoji: '🔴', gradient: 'from-red-500/20 to-orange-500/10', description: 'Mars dosha detection + remedies' },
  { slug: '/sevayein/hora', titleHi: 'होरा मुहूर्त', titleEn: 'Hora Muhurat', emoji: '⏰', gradient: 'from-emerald-500/20 to-teal-500/10', description: 'Current planetary hour — what to do, what to avoid' },
  { slug: '/sevayein/panchang', titleHi: 'दैनिक पंचांग', titleEn: 'Daily Panchang', emoji: '🌅', gradient: 'from-orange-500/20 to-amber-500/10', description: 'Today\'s Tithi, Nakshatra, Yoga, Karana, Rahu Kaal' },
];

const NUMEROLOGY_SERVICES: Service[] = [
  { slug: '/', titleHi: 'अंक ज्योतिष', titleEn: 'Numerology', emoji: '🎲', gradient: 'from-emerald-500/20 to-green-500/10', description: 'Mulank, Bhagyank, Lo Shu Grid, Kua' },
  { slug: '/sevayein/lo-shu', titleHi: 'लो शू ग्रिड', titleEn: 'Lo Shu Grid Deep-Dive', emoji: '🔢', gradient: 'from-blue-500/20 to-cyan-500/10', description: '3×3 magic square with arrows analysis' },
  { slug: '/sevayein/name-numerology', titleHi: 'नाम अंक विज्ञान', titleEn: 'Name Numerology', emoji: '🔤', gradient: 'from-pink-500/20 to-fuchsia-500/10', description: 'Chaldean name analysis + lucky variants' },
  { slug: '/sevayein/sankhya', titleHi: 'संख्या ज्योतिष', titleEn: 'Number Astrology', emoji: '📱', gradient: 'from-cyan-500/20 to-sky-500/10', description: 'Lucky numbers for phone, vehicle, address' },
];

const REMEDIES_SERVICES: Service[] = [
  { slug: '/sevayein/mantras', titleHi: 'मंत्र जाप', titleEn: 'Mantras', emoji: '🙏', gradient: 'from-amber-500/20 to-yellow-500/10', description: 'Personalized mantras by your Mulank' },
  { slug: '/sevayein/vastu', titleHi: 'वास्तु', titleEn: 'Vastu', emoji: '🧭', gradient: 'from-emerald-500/20 to-teal-500/10', description: 'Directional guidance from your Kua number' },
  { slug: '/sevayein/lal-kitab', titleHi: 'लाल किताब', titleEn: 'Lal Kitab', emoji: '📕', gradient: 'from-rose-500/20 to-red-500/10', description: 'Simple, practical planetary remedies' },
  { slug: '/sevayein/rashifal', titleHi: 'राशिफल', titleEn: 'Rashifal', emoji: '♈', gradient: 'from-blue-500/20 to-indigo-500/10', description: 'Daily horoscope by Moon sign' },
];

export default function SevayeinPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8 md:py-12">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-text-muted hover:text-gold">←</Link>
          <h1 className="font-serif text-3xl md:text-4xl">सेवाएँ <span className="text-text-muted text-2xl">· Services</span></h1>
        </div>
        <p className="text-text-muted max-w-2xl">
          Complete Vedic + Numerology toolkit. All services use your birth details (saved once, reused everywhere).
        </p>
      </header>

      {/* Vedic Astrology section */}
      <ServiceSection
        titleHi="वैदिक ज्योतिष"
        titleEn="Vedic Astrology"
        services={VEDIC_ASTROLOGY}
      />

      {/* Numerology */}
      <ServiceSection
        titleHi="अंक विज्ञान"
        titleEn="Numerology"
        services={NUMEROLOGY_SERVICES}
      />

      {/* Remedies & Guidance */}
      <ServiceSection
        titleHi="उपाय और मार्गदर्शन"
        titleEn="Remedies & Guidance"
        services={REMEDIES_SERVICES}
      />

      <footer className="text-center mt-16 text-text-faint text-xs font-mono tracking-wider uppercase">
        DRISHTI Vedic+ · 14+ Services · One Unified Profile
      </footer>
    </main>
  );
}

function ServiceSection({ titleHi, titleEn, services }: { titleHi: string; titleEn: string; services: Service[] }) {
  return (
    <section className="mb-12">
      <div className="mb-4">
        <h2 className="font-serif text-2xl">{titleHi}</h2>
        <p className="text-text-faint text-sm font-mono tracking-wider uppercase">{titleEn}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {services.map((s) => (
          <ServiceCard key={s.slug + s.titleEn} service={s} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={service.slug}
      className={`
        group relative overflow-hidden rounded-2xl p-5 border border-[rgba(245,158,11,0.15)]
        bg-gradient-to-br ${service.gradient}
        hover:border-gold transition-all hover:-translate-y-0.5
        min-h-[140px] flex flex-col justify-between
      `}
    >
      <div className="text-4xl mb-3">{service.emoji}</div>
      <div>
        <div className="font-serif text-lg leading-tight mb-0.5">{service.titleHi}</div>
        <div className="text-xs text-text-muted">{service.titleEn}</div>
        <div className="text-xs text-text-faint mt-2 leading-relaxed">{service.description}</div>
      </div>
    </Link>
  );
}
