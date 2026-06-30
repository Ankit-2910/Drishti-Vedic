'use client';

import { useState } from 'react';
import LoShuGrid from '@/components/LoShuGrid';
import NumerologyCard from '@/components/NumerologyCard';
import ShareButtons from '@/components/ShareButtons';
import { useLang } from '@/lib/i18n';
import type { NumerologyReport } from '@/lib/numerology';

interface KundliResult {
  ascendant: string;
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  currentDasha: { mahadasha: string; antardasha: string; endsOn: string };
  planets: Array<{ name: string; sign: string; house: number; degree: string }>;
  numerology: NumerologyReport;
  narration: string;
  sources: string[];
}

export default function Home() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    place: '',
    latitude: '',
    longitude: '',
    gender: 'male' as 'male' | 'female',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KundliResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'astro' | 'numero' | 'loshu' | 'narration'>('astro');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/kundli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-saffron grid place-items-center text-bg text-2xl font-bold shadow-[0_0_32px_rgba(245,158,11,0.4)]">
            ॐ
          </span>
          <div className="text-left">
            <div className="font-serif text-3xl font-medium">DRISHTI</div>
            <div className="font-mono text-xs text-gold tracking-[0.2em] uppercase">Vedic+ · {t('home.tagline')}</div>
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
          {t('home.heroA')}{' '}
          <em className="bg-gradient-to-br from-gold-light to-saffron bg-clip-text text-transparent">
            {t('home.heroB')}
          </em>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto mb-5">
          {t('home.sub')}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="/sevayein" className="btn-ghost text-sm">सेवाएँ · {t('home.allServices')} →</a>
          <a href="/match" className="btn-ghost text-sm">गुण मिलान · DRISHTI Score →</a>
        </div>
      </header>

      {/* Form */}
      <section className="bg-bg-elev border border-strong rounded-2xl p-6 md:p-8 mb-8">
        <span className="eyebrow text-gold mb-6 block">BIRTH DETAILS</span>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name (as on birth certificate)">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="e.g. Ankit Dubey"
            />
          </Field>
          <Field label="Place of Birth">
            <input
              type="text"
              required
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
              className="input"
              placeholder="e.g. Bhopal, India"
            />
          </Field>
          <Field label="Date of Birth">
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Time of Birth (24-hour)">
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Gender (for Kua calculation)">
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value as 'male' | 'female' })}
              className="input"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
          <Field label="Coordinates (optional)" hint="Defaults to Bhopal if blank">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                className="input"
                placeholder="Lat: 23.2599"
              />
              <input
                type="text"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                className="input"
                placeholder="Lng: 77.4126"
              />
            </div>
          </Field>
          <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? 'Computing across all systems…' : 'Generate Complete DRISHTI Reading →'}
            </button>
            <button
              type="button"
              onClick={() =>
                setForm({
                  name: 'Sample User',
                  date: '1989-06-15',
                  time: '10:30',
                  place: 'Bhopal, India',
                  latitude: '23.2599',
                  longitude: '77.4126',
                  gender: 'male',
                })
              }
              className="btn-ghost"
            >
              Use sample data
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className="bg-crimson/10 border border-crimson/30 rounded-xl p-4 mb-8">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <section>
          {/* Tab nav */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[rgba(245,158,11,0.15)]">
            {[
              { id: 'astro', label: 'Astrology' },
              { id: 'numero', label: 'Numerology' },
              { id: 'loshu', label: 'Lo Shu Grid' },
              { id: 'narration', label: 'DRISHTI Reading' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
                  tab === t.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-text-muted hover:text-gold'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'astro' && <AstroTab data={result} />}
          {tab === 'numero' && <NumerologyCard report={result.numerology} />}
          {tab === 'loshu' && (
            <LoShuGrid
              grid={result.numerology.loShuGrid.grid}
              missingNumbers={result.numerology.loShuGrid.missingNumbers}
              strengths={result.numerology.loShuGrid.arrows.strengths}
              weaknesses={result.numerology.loShuGrid.arrows.weaknesses}
            />
          )}
          {tab === 'narration' && (
            <div className="bg-bg-elev border border-strong rounded-2xl p-6">
              <div className="eyebrow text-gold mb-4">DRISHTI INTEGRATED READING</div>
              <p className="font-serif text-lg leading-relaxed whitespace-pre-line">
                {result.narration}
              </p>
              <div className="mt-5 pt-4 border-t border-[rgba(245,158,11,0.12)] font-mono text-xs text-text-faint tracking-wider uppercase">
                SOURCES: {result.sources?.join(' · ') || 'BPHS · Phaladeepika · Ank Shastra'}
              </div>
              <div className="mt-5">
                <ShareButtons shareText="My complete DRISHTI Vedic+ reading (astrology + numerology)" />
              </div>
            </div>
          )}

          {/* CTA to matching */}
          <div className="mt-8 bg-gradient-to-br from-gold/10 to-saffron/10 border border-gold/30 rounded-2xl p-6 text-center">
            <div className="font-serif text-xl mb-2">Want to check compatibility with someone?</div>
            <p className="text-text-muted text-sm mb-4">
              Get the unified DRISHTI Score (out of 100) combining Ashtakoot + Numerology + Lo Shu synergy
            </p>
            <a href="/match" className="btn-primary inline-flex">
              Check Compatibility →
            </a>
          </div>
        </section>
      )}

      <footer className="text-center mt-16 text-text-faint text-xs font-mono tracking-wider uppercase">
        DRISHTI VEDIC+ · v2.0 · Built in Bhopal by Shivanchal Consultants
      </footer>
    </main>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-text-muted mb-2">{label}</span>
      {children}
      {hint && <span className="block text-xs text-text-faint mt-1">{hint}</span>}
    </label>
  );
}

function AstroTab({ data }: { data: KundliResult }) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <Stat label="Ascendant (Lagna)" value={data.ascendant} />
        <Stat label="Moon Sign (Rashi)" value={data.moonSign} />
        <Stat label="Sun Sign" value={data.sunSign} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Stat label="Nakshatra" value={data.nakshatra} />
        <div className="bg-bg-elev border border-strong rounded-xl p-5">
          <div className="eyebrow text-gold mb-2">CURRENT DASHA</div>
          <div className="font-serif text-xl">{data.currentDasha.mahadasha} / {data.currentDasha.antardasha}</div>
          <div className="text-text-muted text-sm mt-1">Ends on {data.currentDasha.endsOn}</div>
        </div>
      </div>
      <div className="bg-bg-elev border border-strong rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-surface eyebrow text-gold border-b border-[rgba(245,158,11,0.12)]">
          PLANETARY POSITIONS
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-faint text-xs uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Planet</th>
              <th className="px-5 py-3 text-left">Sign</th>
              <th className="px-5 py-3 text-left">House</th>
              <th className="px-5 py-3 text-left">Degree</th>
            </tr>
          </thead>
          <tbody>
            {data.planets.map((p, i) => (
              <tr key={i} className="border-t border-[rgba(245,158,11,0.08)]">
                <td className="px-5 py-3 font-serif text-gold-light">{p.name}</td>
                <td className="px-5 py-3">{p.sign}</td>
                <td className="px-5 py-3">{p.house}</td>
                <td className="px-5 py-3 font-mono text-text-muted">{p.degree}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-elev border border-strong rounded-xl p-5">
      <div className="eyebrow text-gold mb-2">{label}</div>
      <div className="font-serif text-xl text-text">{value}</div>
    </div>
  );
}
