'use client';

import { useState } from 'react';
import ServicePageWrapper from '@/components/ServicePageWrapper';
import LoShuGrid from '@/components/LoShuGrid';
import ShareButtons from '@/components/ShareButtons';
import { generateNumerologyReport, type NumerologyReport } from '@/lib/numerology';
import { useLang } from '@/lib/i18n';

export default function LoShuPage() {
  const { lang } = useLang();
  const [report, setReport] = useState<NumerologyReport | null>(null);

  return (
    <ServicePageWrapper
      titleHi="लो शू ग्रिड"
      titleEn="Lo Shu Grid Deep-Dive"
      emoji="🔢"
      description="The 3×3 magic square from your birth date. Each cell governs a life area — present numbers are strengths, missing numbers are karmic lessons."
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
            <LoShuGrid
              grid={report.loShuGrid.grid}
              missingNumbers={report.loShuGrid.missingNumbers}
              strengths={report.loShuGrid.arrows.strengths}
              weaknesses={report.loShuGrid.arrows.weaknesses}
            />

            {/* Interpretation */}
            <div className="bg-bg-elev border border-strong rounded-2xl p-6">
              <div className="eyebrow text-gold mb-3">
                {lang === 'hi' ? 'व्याख्या' : 'INTERPRETATION'}
              </div>
              <p className="leading-relaxed">{report.loShuGrid.interpretation}</p>
            </div>

            <ShareButtons shareText="My Lo Shu Grid analysis from DRISHTI Vedic+" />
          </div>
        ) : null;
      }}
    </ServicePageWrapper>
  );
}
