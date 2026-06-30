/**
 * Vimshottari Dasha Calculator
 *
 * The most widely used Vedic planetary period system. The 120-year cycle is
 * divided among 9 planets. Starting Mahadasha is determined by the Moon's
 * nakshatra at birth; the balance of the first dasha depends on how far the
 * Moon had progressed through that nakshatra.
 *
 * Periods (years): Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7,
 *                  Rahu 18, Jupiter 16, Saturn 19, Mercury 17  = 120
 */

interface DashaPeriod {
  planet: string;
  planetHi: string;
  years: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface AntarDasha {
  planet: string;
  planetHi: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface DashaResult {
  birthNakshatra: string;
  startingPlanet: string;
  mahadashas: DashaPeriod[];
  currentMahadasha: DashaPeriod | null;
  currentAntardashas: AntarDasha[];
  summary: string;
  summaryHi: string;
}

const DASHA_ORDER = [
  { planet: 'Ketu', hi: 'केतु', years: 7 },
  { planet: 'Venus', hi: 'शुक्र', years: 20 },
  { planet: 'Sun', hi: 'सूर्य', years: 6 },
  { planet: 'Moon', hi: 'चंद्र', years: 10 },
  { planet: 'Mars', hi: 'मंगल', years: 7 },
  { planet: 'Rahu', hi: 'राहु', years: 18 },
  { planet: 'Jupiter', hi: 'गुरु', years: 16 },
  { planet: 'Saturn', hi: 'शनि', years: 19 },
  { planet: 'Mercury', hi: 'बुध', years: 17 },
];

// Nakshatra → starting dasha lord (index in DASHA_ORDER), cycles every 9
const NAKSHATRA_LORDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Ashwini..Ashlesha
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Magha..Jyeshtha
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Mula..Revati
];

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  const wholeYears = Math.floor(years);
  const fractionalDays = (years - wholeYears) * 365.25;
  d.setFullYear(d.getFullYear() + wholeYears);
  d.setDate(d.getDate() + Math.round(fractionalDays));
  return d;
}

function fmt(date: Date): string {
  return date.toISOString().split('T')[0];
}

function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const a = Math.floor((14 - m) / 12);
  const Y = y + 4800 - a;
  const M = m + 12 * a - 3;
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
}

export function calculateDasha(birthDate: string, birthTime: string = '12:00'): DashaResult {
  const [y, mo, d] = birthDate.split('-').map((s) => parseInt(s, 10));
  const [h, mi] = birthTime.split(':').map((s) => parseInt(s, 10));
  const birth = new Date(Date.UTC(y, mo - 1, d, h - 5, mi - 30)); // IST → UTC

  // Moon longitude approximation
  const jd = toJulianDay(birth);
  const moonLon = ((218.316 + 13.176396 * (jd - 2451545.0)) % 360 + 360) % 360;

  // Nakshatra (each = 13°20' = 13.3333°)
  const nakSize = 360 / 27;
  const nakIndex = Math.floor(moonLon / nakSize) % 27;
  const nakFraction = (moonLon % nakSize) / nakSize; // 0..1 progress through nakshatra

  const startLordIdx = NAKSHATRA_LORDS[nakIndex];
  const startLord = DASHA_ORDER[startLordIdx];

  // Balance of first dasha = remaining fraction × full period
  const elapsedInFirst = nakFraction * startLord.years;
  const balanceFirst = startLord.years - elapsedInFirst;

  // Build Mahadasha timeline
  const mahadashas: DashaPeriod[] = [];
  const now = new Date();

  // First dasha started before birth; its start = birth - elapsed
  let cursor = addYears(birth, -elapsedInFirst);

  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(startLordIdx + i) % 9];
    const start = new Date(cursor);
    const end = addYears(start, lord.years);
    const isCurrent = now >= start && now < end;
    mahadashas.push({
      planet: lord.planet,
      planetHi: lord.hi,
      years: lord.years,
      startDate: fmt(start),
      endDate: fmt(end),
      isCurrent,
    });
    cursor = end;
  }

  const currentMahadasha = mahadashas.find((m) => m.isCurrent) || null;

  // Antardashas (sub-periods) within current Mahadasha
  const currentAntardashas: AntarDasha[] = [];
  if (currentMahadasha) {
    const mdLordIdx = DASHA_ORDER.findIndex((p) => p.planet === currentMahadasha.planet);
    const mdYears = currentMahadasha.years;
    let adCursor = new Date(currentMahadasha.startDate);

    for (let i = 0; i < 9; i++) {
      const adLord = DASHA_ORDER[(mdLordIdx + i) % 9];
      // Antardasha length = (MD years × AD planet years) / 120
      const adYears = (mdYears * adLord.years) / 120;
      const start = new Date(adCursor);
      const end = addYears(start, adYears);
      const isCurrent = now >= start && now < end;
      currentAntardashas.push({
        planet: adLord.planet,
        planetHi: adLord.hi,
        startDate: fmt(start),
        endDate: fmt(end),
        isCurrent,
      });
      adCursor = end;
    }
  }

  const currentAD = currentAntardashas.find((a) => a.isCurrent);

  const summary = currentMahadasha
    ? `You are in ${currentMahadasha.planet} Mahadasha${currentAD ? ` with ${currentAD.planet} Antardasha` : ''}, running until ${currentMahadasha.endDate}. This shapes the dominant themes of your current life chapter.`
    : 'Dasha timeline computed from your Moon nakshatra.';

  const summaryHi = currentMahadasha
    ? `आप अभी ${currentMahadasha.planetHi} महादशा${currentAD ? ` में ${currentAD.planetHi} अंतर्दशा` : ''} में हैं, जो ${currentMahadasha.endDate} तक चलेगी। यह आपके वर्तमान जीवन-अध्याय के प्रमुख विषयों को आकार देती है।`
    : 'आपके चंद्र नक्षत्र से दशा समयरेखा गणना की गई।';

  return {
    birthNakshatra: NAKSHATRA_NAMES[nakIndex],
    startingPlanet: startLord.planet,
    mahadashas,
    currentMahadasha,
    currentAntardashas,
    summary,
    summaryHi,
  };
}
