'use client';

import type { NumerologyReport } from '@/lib/numerology';
import MissingNumberRemedies from '@/components/MissingNumberRemedies';

export default function NumerologyCard({ report }: { report: NumerologyReport }) {
  return (
    <div className="space-y-6">
      {/* Core numbers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <CoreNumber label="Mulank" value={report.mulank} hint="Driver" isMaster={report.isMasterMulank} />
        <CoreNumber label="Bhagyank" value={report.bhagyank} hint="Destiny" isMaster={report.isMasterBhagyank} />
        <CoreNumber label="Naamank" value={report.naamank} hint="Name" />
        <CoreNumber label="Soul" value={report.soulNumber} hint="Heart's Desire" />
        <CoreNumber label="Kua" value={report.kua} hint={report.kuaGroup + ' group'} />
      </div>
      
      {/* Master numbers / Karmic debts */}
      {(report.masterNumbers.length > 0 || report.karmicDebts.length > 0) && (
        <div className="grid md:grid-cols-2 gap-3">
          {report.masterNumbers.length > 0 && (
            <div className="bg-emerald/10 border border-emerald/30 rounded-xl p-4">
              <div className="eyebrow text-emerald mb-2">MASTER NUMBERS PRESENT</div>
              <div className="flex gap-2">
                {report.masterNumbers.map((n) => (
                  <span key={n} className="bg-emerald/20 text-emerald font-serif text-xl px-3 py-1 rounded">{n}</span>
                ))}
              </div>
              <p className="text-text-muted text-xs mt-2">Spiritual potency — life mission is significant</p>
            </div>
          )}
          
          {report.karmicDebts.length > 0 && (
            <div className="bg-saffron/10 border border-saffron/30 rounded-xl p-4">
              <div className="eyebrow text-saffron mb-2">KARMIC DEBT</div>
              <div className="flex gap-2">
                {report.karmicDebts.map((n) => (
                  <span key={n} className="bg-saffron/20 text-saffron font-serif text-xl px-3 py-1 rounded">{n}</span>
                ))}
              </div>
              <p className="text-text-muted text-xs mt-2">Past-life patterns to consciously resolve</p>
            </div>
          )}
        </div>
      )}
      
      {/* Planet & Deity */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-bg-elev border border-strong rounded-xl p-4">
          <div className="eyebrow text-gold mb-2">RULING PLANET</div>
          <div className="font-serif text-lg">{report.rulingPlanet}</div>
        </div>
        <div className="bg-bg-elev border border-strong rounded-xl p-4">
          <div className="eyebrow text-gold mb-2">PRESIDING DEITY</div>
          <div className="font-serif text-lg">{report.deity}</div>
        </div>
      </div>
      
      {/* Personality + Strengths/Weaknesses */}
      <div className="bg-bg-elev border border-strong rounded-xl p-6">
        <div className="eyebrow text-gold mb-3">PERSONALITY SIGNATURE</div>
        <div className="flex flex-wrap gap-2 mb-5">
          {report.personalityTraits.map((trait) => (
            <span key={trait} className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-sm">
              {trait}
            </span>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="eyebrow text-emerald mb-2">STRENGTHS</div>
            <ul className="space-y-1.5 text-sm">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex gap-2"><span className="text-emerald">+</span>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow text-saffron mb-2">WATCH-OUTS</div>
            <ul className="space-y-1.5 text-sm">
              {report.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2"><span className="text-saffron">−</span>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Lucky attributes */}
      <div className="bg-bg-elev border border-strong rounded-xl p-6">
        <div className="eyebrow text-gold mb-4">LUCKY SIGNATURE</div>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <Row label="Numbers" value={report.luckyNumbers.join(', ')} />
          <Row label="Colors" value={report.luckyColors.join(', ')} />
          <Row label="Days" value={report.luckyDays.join(', ')} />
          <Row label="Gemstone" value={report.luckyGemstone} />
          <Row label="Directions (Kua)" value={report.luckyDirections.join(', ')} />
          <Row label="Career fit" value={report.career.slice(0, 3).join(', ')} />
        </div>
      </div>
      
      {/* Personal cycle */}
      <div className="bg-gradient-to-br from-indigo/10 to-gold/10 border border-indigo/30 rounded-xl p-6">
        <div className="eyebrow text-indigo mb-4">CURRENT PERSONAL CYCLE</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-serif text-3xl text-gold mb-1">{report.personalYear}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Year</div>
          </div>
          <div>
            <div className="font-serif text-3xl text-gold mb-1">{report.personalMonth}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Month</div>
          </div>
          <div>
            <div className="font-serif text-3xl text-gold mb-1">{report.personalDay}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Day</div>
          </div>
        </div>
      </div>

      {/* Missing number remedies + mantra — always shown */}
      <MissingNumberRemedies missingNumbers={report.loShuGrid.missingNumbers} />
    </div>
  );
}

function CoreNumber({ label, value, hint, isMaster }: { label: string; value: number; hint: string; isMaster?: boolean }) {
  return (
    <div className={`text-center rounded-xl p-4 border ${
      isMaster ? 'bg-emerald/10 border-emerald/40' : 'bg-bg-elev border-strong'
    }`}>
      <div className="eyebrow mb-2 text-gold">{label}</div>
      <div className="font-serif text-4xl mb-1 leading-none">
        {value}
      </div>
      <div className="text-xs text-text-faint">{hint}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-text-faint uppercase tracking-wider text-xs mb-1">{label}</div>
      <div className="text-text">{value}</div>
    </div>
  );
}
