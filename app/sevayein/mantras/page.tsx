'use client';

import ServicePageWrapper from '@/components/ServicePageWrapper';
import { getMantras } from '@/lib/services';
import { calculateMulank } from '@/lib/numerology';

export default function MantrasPage() {
  return (
    <ServicePageWrapper
      titleHi="मंत्र जाप"
      titleEn="Personalized Mantras"
      emoji="🙏"
      description="Sacred mantras aligned with your Mulank's ruling planet. Daily recitation strengthens that planet's positive influence."
    >
      {(profile) => {
        if (!profile) return null;
        const mulank = calculateMulank(profile.birthDate);
        const mantraSet = getMantras(mulank);

        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gold/10 to-saffron/10 border border-gold/30 rounded-2xl p-6 text-center">
              <div className="eyebrow text-gold mb-2">YOUR MULANK · ANCHOR PLANET</div>
              <div className="font-serif text-6xl text-gold">{mantraSet.mulank}</div>
              <div className="font-serif text-2xl mt-2">{mantraSet.rulingPlanet}</div>
            </div>

            {mantraSet.mantras.map((m, i) => (
              <div key={i} className="bg-bg-elev border border-strong rounded-2xl p-6">
                <div className="eyebrow text-gold mb-3">मंत्र #{i + 1}</div>
                <div className="font-serif text-3xl mb-3 text-gold-light leading-snug">{m.mantra}</div>
                <div className="font-mono text-text-muted text-sm mb-3">{m.transliteration}</div>
                <p className="text-sm mb-4">{m.meaning}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-text-faint uppercase text-xs tracking-wider mr-2">Recite:</span>
                    <span className="font-medium">{m.count}× daily</span>
                  </div>
                  <div>
                    <span className="text-text-faint uppercase text-xs tracking-wider mr-2">Best time:</span>
                    <span className="font-medium">{m.bestTime}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-indigo/10 border border-indigo/30 rounded-2xl p-6">
              <div className="eyebrow text-indigo mb-3">💡 GUIDANCE</div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><span className="text-indigo">•</span>Sit facing East (or your Kua's wealth direction) on a clean asana</li>
                <li className="flex gap-2"><span className="text-indigo">•</span>Use a rudraksha or tulsi mala (108 beads) to count</li>
                <li className="flex gap-2"><span className="text-indigo">•</span>Maintain mental focus — don't rush</li>
                <li className="flex gap-2"><span className="text-indigo">•</span>For Beej mantras, complete the prescribed count within 40 days for full effect</li>
                <li className="flex gap-2"><span className="text-indigo">•</span>Bathe before chanting, wear clean (preferably white) clothes</li>
              </ul>
            </div>
          </div>
        );
      }}
    </ServicePageWrapper>
  );
}
