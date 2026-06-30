/**
 * Sade Sati (साढ़े साती) Calculator
 * Saturn (Shani) takes ~30 years to traverse the 12 zodiac signs (~2.5 years per sign).
 * Sade Sati = Saturn's transit through the 12th, 1st, and 2nd sign FROM the natal Moon.
 * Total duration: 7.5 years (hence the name "Sade Sati" = seven and a half).
 *
 * Three phases:
 *   Phase 1 (Aarambh): Saturn in 12th from Moon — losses, expenses, foreign matters
 *   Phase 2 (Madhya):  Saturn in 1st from Moon — health, mental challenges, peak intensity
 *   Phase 3 (Antya):   Saturn in 2nd from Moon — wealth, family, speech issues
 */

const RASHIS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
];

// Saturn entry dates into each sign (recent + upcoming, approximate)
// Source: standard Vedic ephemeris reference data
const SATURN_TRANSITS: Array<{ sign: number; from: string; to: string }> = [
  { sign: 9, from: '2020-01-24', to: '2022-04-29' },  // Makara
  { sign: 10, from: '2022-04-29', to: '2025-03-29' }, // Kumbha
  { sign: 11, from: '2025-03-29', to: '2027-06-04' }, // Meena
  { sign: 0, from: '2027-06-04', to: '2029-08-13' },  // Mesha
  { sign: 1, from: '2029-08-13', to: '2031-10-22' },  // Vrishabha
  { sign: 2, from: '2031-10-22', to: '2033-12-30' },  // Mithuna
  { sign: 3, from: '2033-12-30', to: '2036-03-10' },  // Karka
  { sign: 4, from: '2036-03-10', to: '2038-05-19' },  // Simha
  { sign: 5, from: '2038-05-19', to: '2040-07-27' },  // Kanya
  { sign: 6, from: '2040-07-27', to: '2042-10-06' },  // Tula
  { sign: 7, from: '2042-10-06', to: '2044-12-14' },  // Vrischika
  { sign: 8, from: '2044-12-14', to: '2047-02-23' },  // Dhanu
];

export interface SadeSatiResult {
  moonSign: string;
  moonSignIndex: number;
  currentSaturnSign: string;
  currentSaturnIndex: number;
  isInSadeSati: boolean;
  isInDhaiya: boolean;  // 2.5-year Saturn variant (Kantak Shani)
  currentPhase: 'Phase 1 (Aarambh)' | 'Phase 2 (Madhya)' | 'Phase 3 (Antya)' | 'Not in Sade Sati';
  phaseDescription: string;
  startDate: string | null;
  endDate: string | null;
  remainingMonths: number;
  effects: string[];
  remedies: string[];
}

export function calculateSadeSati(moonSign: string, asOfDate?: Date): SadeSatiResult {
  const date = asOfDate || new Date();
  const dateStr = date.toISOString().split('T')[0];

  // Parse moon sign name to index
  const moonSignIndex = RASHIS.findIndex((r) =>
    r.toLowerCase().includes(moonSign.toLowerCase().split(' ')[0])
  );

  if (moonSignIndex === -1) {
    throw new Error(`Could not parse moon sign: ${moonSign}`);
  }

  // Find current Saturn transit
  const currentTransit = SATURN_TRANSITS.find((t) => dateStr >= t.from && dateStr < t.to);
  const currentSaturnIndex = currentTransit?.sign ?? 10;
  const currentSaturnSign = RASHIS[currentSaturnIndex];

  // Sade Sati = Saturn in 12th, 1st, or 2nd from natal Moon
  const twelfth = (moonSignIndex + 11) % 12;
  const first = moonSignIndex;
  const second = (moonSignIndex + 1) % 12;

  // Dhaiya = Saturn in 4th or 8th from natal Moon (2.5-year Kantak Shani)
  const fourth = (moonSignIndex + 3) % 12;
  const eighth = (moonSignIndex + 7) % 12;

  const isInSadeSati = [twelfth, first, second].includes(currentSaturnIndex);
  const isInDhaiya = [fourth, eighth].includes(currentSaturnIndex);

  let currentPhase: SadeSatiResult['currentPhase'] = 'Not in Sade Sati';
  let phaseDescription = '';
  let effects: string[] = [];
  let remedies: string[] = [];

  if (currentSaturnIndex === twelfth) {
    currentPhase = 'Phase 1 (Aarambh)';
    phaseDescription = 'Beginning phase. Saturn in 12th house from your Moon — focus on losses, expenses, foreign matters, isolation, and spiritual lessons.';
    effects = [
      'Unexpected expenses or financial pressure',
      'Travel or relocation possibility',
      'Sleep disturbances or mental restlessness',
      'Distance from family or close friends',
      'Spiritual awakening or interest in solitude',
    ];
  } else if (currentSaturnIndex === first) {
    currentPhase = 'Phase 2 (Madhya)';
    phaseDescription = 'Middle phase. Saturn over your natal Moon — the most intense period. Physical health, mental state, and self-image are tested.';
    effects = [
      'Possible health concerns, especially fatigue and joints',
      'Mental stress, anxiety, depression episodes',
      'Workload increases — feels relentless',
      'Relationships may face strain',
      'But: this is also the phase of greatest growth and maturity',
    ];
  } else if (currentSaturnIndex === second) {
    currentPhase = 'Phase 3 (Antya)';
    phaseDescription = 'Final phase. Saturn in 2nd house from your Moon — focus on wealth, family, speech, and accumulated values.';
    effects = [
      'Financial fluctuations — may improve or strain depending on rest of chart',
      'Family responsibilities increase',
      'Speech may become harsh or restrained — be mindful',
      'Eye and teeth issues possible',
      'Sense of completion approaching as Sade Sati nears end',
    ];
  } else if (isInDhaiya) {
    currentPhase = 'Phase 2 (Madhya)';
    phaseDescription = `Currently in Dhaiya (2.5-year Kantak Shani) — Saturn in ${currentSaturnIndex === fourth ? '4th' : '8th'} from Moon. Not Sade Sati, but a related Saturn challenge.`;
    effects = currentSaturnIndex === fourth
      ? ['Home and emotional comfort tested', 'Property matters require attention', 'Mother\'s health concerns possible']
      : ['Sudden changes, transformations', 'Hidden enemies, legal issues possible', 'Health requires vigilance'];
  } else {
    phaseDescription = 'You are NOT currently in Sade Sati or Dhaiya. Saturn is in a neutral position relative to your natal Moon.';
    effects = ['No Saturn-related afflictions currently active'];
  }

  // Common Saturn remedies
  if (isInSadeSati || isInDhaiya) {
    remedies = [
      'Recite Hanuman Chalisa daily, especially on Saturdays and Tuesdays',
      'Donate black sesame seeds, mustard oil, iron, or black blanket on Saturdays',
      'Visit Shani temple on Saturdays; light a mustard oil lamp',
      'Chant "Om Shanaischaraya Namah" 108 times daily',
      'Help the elderly, disabled, or destitute regularly — Saturn loves service',
      'Wear blue or black; avoid bright red on Saturdays',
      'Maintain discipline in routine — sleep, eat, work at fixed times',
      'Consider Neelam (Blue Sapphire) only after consultation with a senior astrologer',
    ];
  }

  // Calculate remaining duration
  let startDate: string | null = null;
  let endDate: string | null = null;
  let remainingMonths = 0;

  if (isInSadeSati) {
    // Find when Sade Sati started (Saturn entered 12th from Moon)
    const sadeSatiStart = SATURN_TRANSITS.find((t) => t.sign === twelfth);
    // Find when Sade Sati ends (Saturn leaves 2nd from Moon)
    const sadeSatiEnd = SATURN_TRANSITS.find((t) => t.sign === second);

    startDate = sadeSatiStart?.from || null;
    endDate = sadeSatiEnd?.to || null;

    if (endDate) {
      const endD = new Date(endDate);
      remainingMonths = Math.max(0, Math.floor((endD.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    }
  }

  return {
    moonSign: RASHIS[moonSignIndex],
    moonSignIndex,
    currentSaturnSign,
    currentSaturnIndex,
    isInSadeSati,
    isInDhaiya,
    currentPhase,
    phaseDescription,
    startDate,
    endDate,
    remainingMonths,
    effects,
    remedies,
  };
}
