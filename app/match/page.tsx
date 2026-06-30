'use client';

import { useState } from 'react';
import DrishtiScoreCard from '@/components/DrishtiScoreCard';
import type { DrishtiScoreResult } from '@/lib/drishti-score';

interface PersonForm {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: string;
  longitude: string;
  gender: 'male' | 'female';
}

const emptyPerson: PersonForm = {
  fullName: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
  latitude: '',
  longitude: '',
  gender: 'male',
};

export default function MatchPage() {
  const [person1, setPerson1] = useState<PersonForm>({ ...emptyPerson, gender: 'male' });
  const [person2, setPerson2] = useState<PersonForm>({ ...emptyPerson, gender: 'female' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DrishtiScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/drishti-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person1, person2 }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compute match');
    } finally {
      setLoading(false);
    }
  }

  function fillSampleData() {
    setPerson1({
      fullName: 'Arjun Kumar',
      birthDate: '1989-06-15',
      birthTime: '10:30',
      birthPlace: 'Bhopal, India',
      latitude: '23.2599',
      longitude: '77.4126',
      gender: 'male',
    });
    setPerson2({
      fullName: 'Priya Sharma',
      birthDate: '1991-11-22',
      birthTime: '14:45',
      birthPlace: 'Indore, India',
      latitude: '22.7196',
      longitude: '75.8577',
      gender: 'female',
    });
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <a href="/" className="font-serif text-xl text-text-muted hover:text-gold">DRISHTI</a>
          <span className="text-text-faint">/</span>
          <span className="font-serif text-xl">Compatibility</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
          The{' '}
          <em className="bg-gradient-to-br from-gold-light to-saffron bg-clip-text text-transparent">
            DRISHTI Score
          </em>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          The only 100-point compatibility metric that combines Vedic Astrology (Ashtakoot 36-guna) with Vedic Numerology (Mulank, Bhagyank, Lo Shu Grid synergy).
        </p>
        <div className="inline-flex items-center gap-4 mt-4 font-mono text-xs text-text-faint tracking-wider uppercase">
          <span>50 pts Astrology</span>
          <span>·</span>
          <span>25 pts Numerology</span>
          <span>·</span>
          <span>15 pts Lo Shu Grid</span>
          <span>·</span>
          <span>10 pts Doshas</span>
        </div>
      </header>

      {/* Forms */}
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <PersonForm
            title="Person 1"
            data={person1}
            onChange={setPerson1}
            accentColor="text-indigo"
          />
          <PersonForm
            title="Person 2"
            data={person2}
            onChange={setPerson2}
            accentColor="text-gold"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Computing DRISHTI Score…' : 'Calculate Compatibility →'}
          </button>
          <button type="button" onClick={fillSampleData} className="btn-ghost">
            Use sample data
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-crimson/10 border border-crimson/30 rounded-xl p-4 mb-8">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <section id="result">
          <DrishtiScoreCard result={result} />
        </section>
      )}

      <footer className="text-center mt-16 text-text-faint text-xs font-mono tracking-wider uppercase">
        DRISHTI VEDIC+ · Unified Compatibility · v2.0
      </footer>
    </main>
  );
}

function PersonForm({
  title,
  data,
  onChange,
  accentColor,
}: {
  title: string;
  data: PersonForm;
  onChange: (p: PersonForm) => void;
  accentColor: string;
}) {
  return (
    <div className="bg-bg-elev border border-strong rounded-2xl p-6">
      <div className={`eyebrow mb-4 ${accentColor}`}>{title.toUpperCase()}</div>
      <div className="grid gap-3">
        <input
          type="text"
          required
          placeholder="Full name"
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          className="input"
        />
        <input
          type="date"
          required
          value={data.birthDate}
          onChange={(e) => onChange({ ...data, birthDate: e.target.value })}
          className="input"
        />
        <input
          type="time"
          required
          value={data.birthTime}
          onChange={(e) => onChange({ ...data, birthTime: e.target.value })}
          className="input"
        />
        <input
          type="text"
          placeholder="Place of birth"
          value={data.birthPlace}
          onChange={(e) => onChange({ ...data, birthPlace: e.target.value })}
          className="input"
        />
        <select
          value={data.gender}
          onChange={(e) => onChange({ ...data, gender: e.target.value as 'male' | 'female' })}
          className="input"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    </div>
  );
}
