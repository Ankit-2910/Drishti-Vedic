'use client';

import { useState, useEffect } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import { calculatePersonalDay, calculatePersonalYear } from '@/lib/numerology';

const RASHI_TRAITS: Record<string, { theme: string; today: (pd: number) => string }> = {
  Mesha: { theme: 'Fire · Mars-ruled', today: (pd) => pd <= 3 ? 'Initiative-driven day. Bold actions favored.' : pd <= 6 ? 'Channel energy into focused work. Avoid arguments.' : 'Reflective phase. Pause before reacting.' },
  Vrishabha: { theme: 'Earth · Venus-ruled', today: (pd) => pd <= 3 ? 'Build, plant, accumulate. Material focus is strong.' : pd <= 6 ? 'Harmonize relationships. Beauty, art, comfort calls.' : 'Quiet introspection on possessions and values.' },
  Mithuna: { theme: 'Air · Mercury-ruled', today: (pd) => pd <= 3 ? 'Communicate freely. New ideas land well.' : pd <= 6 ? 'Connect, write, network. Travel may emerge.' : 'Process the conversations of the past few days.' },
  Karka: { theme: 'Water · Moon-ruled', today: (pd) => pd <= 3 ? 'Home and family take priority. Nurture matters.' : pd <= 6 ? 'Emotions deep but balanced. Lean into intuition.' : 'Solitude restores. Don\'t commit emotionally yet.' },
  Simha: { theme: 'Fire · Sun-ruled', today: (pd) => pd <= 3 ? 'Visibility and leadership rise. Step into the spotlight.' : pd <= 6 ? 'Creative expression peaks. Romance is in the air.' : 'Recognition is delayed but coming. Steady the ego.' },
  Kanya: { theme: 'Earth · Mercury-ruled', today: (pd) => pd <= 3 ? 'Practical analysis serves you. Details matter today.' : pd <= 6 ? 'Service-orientation rewards you. Health focus aids.' : 'Refine and edit existing work. No new launches.' },
  Tula: { theme: 'Air · Venus-ruled', today: (pd) => pd <= 3 ? 'Diplomatic openings. Partnerships strengthen.' : pd <= 6 ? 'Beauty, art, agreements flow. Avoid one-sidedness.' : 'Restore balance to overlooked relationships.' },
  Vrischika: { theme: 'Water · Mars-ruled', today: (pd) => pd <= 3 ? 'Deep transformation underway. Trust your power.' : pd <= 6 ? 'Investigate. Discover hidden truths. Intensity peaks.' : 'Release what no longer serves you.' },
  Dhanu: { theme: 'Fire · Jupiter-ruled', today: (pd) => pd <= 3 ? 'Vision and travel expand. Pursue learning.' : pd <= 6 ? 'Teach, mentor, share wisdom. Optimism rewards.' : 'Reflect on your philosophical foundations.' },
  Makara: { theme: 'Earth · Saturn-ruled', today: (pd) => pd <= 3 ? 'Disciplined effort builds long-term wealth today.' : pd <= 6 ? 'Authority and responsibility called for. Lead.' : 'Saturn asks for patience. Endurance wins.' },
  Kumbha: { theme: 'Air · Saturn-ruled', today: (pd) => pd <= 3 ? 'Innovate. Group efforts and tech-focus thrive.' : pd <= 6 ? 'Humanitarian causes align. Friendship deepens.' : 'Detach from old systems. Plan revolutionary change.' },
  Meena: { theme: 'Water · Jupiter-ruled', today: (pd) => pd <= 3 ? 'Imagination and spiritual depth open up.' : pd <= 6 ? 'Compassion and creativity flow. Art emerges.' : 'Surrender. Trust the dream world\'s messages.' },
};

const RASHI_HI: Record<string, string> = {
  Mesha: 'मेष', Vrishabha: 'वृषभ', Mithuna: 'मिथुन', Karka: 'कर्क',
  Simha: 'सिंह', Kanya: 'कन्या', Tula: 'तुला', Vrischika: 'वृश्चिक',
  Dhanu: 'धनु', Makara: 'मकर', Kumbha: 'कुंभ', Meena: 'मीन',
};

export default function RashifalPage() {
  const [moonSign, setMoonSign] = useState<string>('');
  const [horoscope, setHoroscope] = useState<{ today: string; personalDay: number; personalYear: number } | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ServicePageWrapper
      titleHi="राशिफल"
      titleEn="Daily Rashifal"
      emoji="♈"
      description="Today's energy by your Moon sign (Rashi), integrated with your numerological personal day cycle."
    >
      {(profile) => (
        <>
          <div className="bg-bg-elev border border-strong rounded-2xl p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm text-text-muted mb-2">Your Moon Sign</label>
                <select value={moonSign} onChange={(e) => setMoonSign(e.target.value)} className="input">
                  <option value="">Select Rashi</option>
                  {Object.keys(RASHI_TRAITS).map((r) => (
                    <option key={r} value={r}>{RASHI_HI[r]} ({r})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  if (moonSign && profile) {
                    const trait = RASHI_TRAITS[moonSign];
                    const pd = calculatePersonalDay(profile.birthDate, new Date().toISOString().split('T')[0]);
                    const py = calculatePersonalYear(profile.birthDate, new Date().getFullYear());
                    setHoroscope({ today: trait.today(pd), personalDay: pd, personalYear: py });
                  }
                }}
                disabled={!moonSign || !profile}
                className="btn-primary disabled:opacity-50 md:col-span-2"
              >
                Get Today's Rashifal →
              </button>
            </div>

            {profile && !moonSign && (
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const res = await fetch('/api/kundli', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: profile.fullName,
                        date: profile.birthDate,
                        time: profile.birthTime,
                        place: profile.birthPlace,
                        latitude: profile.latitude,
                        longitude: profile.longitude,
                      }),
                    });
                    const data = await res.json();
                    if (data.moonSign) {
                      const ms = data.moonSign.split(' ')[0];
                      setMoonSign(ms);
                      const trait = RASHI_TRAITS[ms];
                      const pd = calculatePersonalDay(profile.birthDate, new Date().toISOString().split('T')[0]);
                      const py = calculatePersonalYear(profile.birthDate, new Date().getFullYear());
                      setHoroscope({ today: trait.today(pd), personalDay: pd, personalYear: py });
                    }
                  } catch {}
                  setLoading(false);
                }}
                className="text-gold text-sm hover:underline mt-3"
              >
                {loading ? 'Detecting...' : 'Auto-detect my Moon sign →'}
              </button>
            )}
          </div>

          {horoscope && moonSign && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gold/15 to-saffron/10 border border-gold/30 rounded-2xl p-8 text-center">
                <div className="eyebrow text-gold mb-3">आज का राशिफल · TODAY · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                <div className="font-serif text-4xl mb-2">{RASHI_HI[moonSign]} · {moonSign}</div>
                <div className="text-text-muted text-sm mb-6">{RASHI_TRAITS[moonSign].theme}</div>
                <p className="font-serif text-xl leading-relaxed max-w-xl mx-auto">{horoscope.today}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-bg-elev border border-strong rounded-xl p-5 text-center">
                  <div className="eyebrow text-indigo mb-2">PERSONAL DAY</div>
                  <div className="font-serif text-5xl text-indigo">{horoscope.personalDay}</div>
                  <p className="text-text-muted text-xs mt-2">
                    {horoscope.personalDay <= 3 ? 'Building cycle' : horoscope.personalDay <= 6 ? 'Harmonising cycle' : 'Closing cycle'}
                  </p>
                </div>
                <div className="bg-bg-elev border border-strong rounded-xl p-5 text-center">
                  <div className="eyebrow text-gold mb-2">PERSONAL YEAR</div>
                  <div className="font-serif text-5xl text-gold">{horoscope.personalYear}</div>
                  <p className="text-text-muted text-xs mt-2">
                    {horoscope.personalYear <= 3 ? 'Foundation phase' : horoscope.personalYear <= 6 ? 'Mid-cycle' : 'Completion phase'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ServicePageWrapper>
  );
}
