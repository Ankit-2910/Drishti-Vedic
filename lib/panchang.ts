/**
 * Daily Panchang Calculator
 * Computes the 5 elements (Panch-Anga) of Vedic calendar for any date.
 * Uses simplified mean-position algorithms — good enough for daily reference.
 * For exact muhurta, use Prokerala /panchang endpoint when API key set.
 */

export interface PanchangResult {
  date: string;          // YYYY-MM-DD
  vaar: { name: string; planet: string; nature: string };
  tithi: { number: number; name: string; paksha: 'Shukla' | 'Krishna'; deity: string };
  nakshatra: { number: number; name: string; deity: string; lord: string };
  yoga: { number: number; name: string; nature: 'Auspicious' | 'Inauspicious' | 'Mixed' };
  karana: { name: string; nature: 'Auspicious' | 'Inauspicious' };
  sunrise: string;       // approximate HH:MM
  sunset: string;
  moonPhase: string;
  rahuKaal: { start: string; end: string };
  abhijitMuhurat: { start: string; end: string };
  recommendations: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const VAARS = [
  { name: 'Ravivar (Sunday)', planet: 'Sun', nature: 'Active, leadership' },
  { name: 'Somvar (Monday)', planet: 'Moon', nature: 'Calm, devotional' },
  { name: 'Mangalvar (Tuesday)', planet: 'Mars', nature: 'Bold, fiery' },
  { name: 'Budhvar (Wednesday)', planet: 'Mercury', nature: 'Intellectual, communicative' },
  { name: 'Guruvar (Thursday)', planet: 'Jupiter', nature: 'Wise, auspicious' },
  { name: 'Shukravar (Friday)', planet: 'Venus', nature: 'Loving, artistic' },
  { name: 'Shanivar (Saturday)', planet: 'Saturn', nature: 'Disciplined, serious' },
];

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya',
];

const TITHI_DEITIES: Record<number, string> = {
  1: 'Lord Brahma', 2: 'Lord Vidhata', 3: 'Goddess Gauri',
  4: 'Lord Ganesha', 5: 'Goddess Saraswati', 6: 'Lord Kartikeya',
  7: 'Lord Surya', 8: 'Lord Shiva', 9: 'Goddess Durga',
  10: 'Lord Yama', 11: 'Lord Vishnu', 12: 'Lord Vishnu',
  13: 'Lord Kamadeva', 14: 'Lord Shiva', 15: 'Lord Chandra',
};

const NAKSHATRAS = [
  { name: 'Ashwini', deity: 'Ashwini Kumars', lord: 'Ketu' },
  { name: 'Bharani', deity: 'Yama', lord: 'Venus' },
  { name: 'Krittika', deity: 'Agni', lord: 'Sun' },
  { name: 'Rohini', deity: 'Brahma', lord: 'Moon' },
  { name: 'Mrigashira', deity: 'Soma', lord: 'Mars' },
  { name: 'Ardra', deity: 'Rudra', lord: 'Rahu' },
  { name: 'Punarvasu', deity: 'Aditi', lord: 'Jupiter' },
  { name: 'Pushya', deity: 'Brihaspati', lord: 'Saturn' },
  { name: 'Ashlesha', deity: 'Nagas', lord: 'Mercury' },
  { name: 'Magha', deity: 'Pitris', lord: 'Ketu' },
  { name: 'Purva Phalguni', deity: 'Bhaga', lord: 'Venus' },
  { name: 'Uttara Phalguni', deity: 'Aryaman', lord: 'Sun' },
  { name: 'Hasta', deity: 'Savitr', lord: 'Moon' },
  { name: 'Chitra', deity: 'Tvashtar', lord: 'Mars' },
  { name: 'Swati', deity: 'Vayu', lord: 'Rahu' },
  { name: 'Vishakha', deity: 'Indra-Agni', lord: 'Jupiter' },
  { name: 'Anuradha', deity: 'Mitra', lord: 'Saturn' },
  { name: 'Jyeshtha', deity: 'Indra', lord: 'Mercury' },
  { name: 'Mula', deity: 'Nirriti', lord: 'Ketu' },
  { name: 'Purva Ashadha', deity: 'Apah', lord: 'Venus' },
  { name: 'Uttara Ashadha', deity: 'Vishvadeva', lord: 'Sun' },
  { name: 'Shravana', deity: 'Vishnu', lord: 'Moon' },
  { name: 'Dhanishta', deity: 'Vasu', lord: 'Mars' },
  { name: 'Shatabhisha', deity: 'Varuna', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', deity: 'Aja Ekapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', deity: 'Ahirbudhnya', lord: 'Saturn' },
  { name: 'Revati', deity: 'Pushan', lord: 'Mercury' },
];

const YOGAS = [
  { name: 'Vishkambha', nature: 'Inauspicious' as const },
  { name: 'Priti', nature: 'Auspicious' as const },
  { name: 'Ayushman', nature: 'Auspicious' as const },
  { name: 'Saubhagya', nature: 'Auspicious' as const },
  { name: 'Shobhana', nature: 'Auspicious' as const },
  { name: 'Atiganda', nature: 'Inauspicious' as const },
  { name: 'Sukarma', nature: 'Auspicious' as const },
  { name: 'Dhriti', nature: 'Auspicious' as const },
  { name: 'Shoola', nature: 'Inauspicious' as const },
  { name: 'Ganda', nature: 'Inauspicious' as const },
  { name: 'Vriddhi', nature: 'Auspicious' as const },
  { name: 'Dhruva', nature: 'Auspicious' as const },
  { name: 'Vyaghata', nature: 'Inauspicious' as const },
  { name: 'Harshana', nature: 'Auspicious' as const },
  { name: 'Vajra', nature: 'Mixed' as const },
  { name: 'Siddhi', nature: 'Auspicious' as const },
  { name: 'Vyatipata', nature: 'Inauspicious' as const },
  { name: 'Variyan', nature: 'Auspicious' as const },
  { name: 'Parigha', nature: 'Inauspicious' as const },
  { name: 'Shiva', nature: 'Auspicious' as const },
  { name: 'Siddha', nature: 'Auspicious' as const },
  { name: 'Sadhya', nature: 'Auspicious' as const },
  { name: 'Shubha', nature: 'Auspicious' as const },
  { name: 'Shukla', nature: 'Auspicious' as const },
  { name: 'Brahma', nature: 'Auspicious' as const },
  { name: 'Indra', nature: 'Auspicious' as const },
  { name: 'Vaidhriti', nature: 'Inauspicious' as const },
];

const KARANAS = [
  { name: 'Bava', nature: 'Auspicious' as const },
  { name: 'Balava', nature: 'Auspicious' as const },
  { name: 'Kaulava', nature: 'Auspicious' as const },
  { name: 'Taitila', nature: 'Auspicious' as const },
  { name: 'Gara', nature: 'Auspicious' as const },
  { name: 'Vanija', nature: 'Auspicious' as const },
  { name: 'Vishti (Bhadra)', nature: 'Inauspicious' as const },
];

// Rahu Kaal slots (by weekday, in approximate IST hours from sunrise)
const RAHU_KAAL_SLOTS: Record<number, string> = {
  0: '16:30-18:00', // Sunday
  1: '07:30-09:00', // Monday
  2: '15:00-16:30', // Tuesday
  3: '12:00-13:30', // Wednesday
  4: '13:30-15:00', // Thursday
  5: '10:30-12:00', // Friday
  6: '09:00-10:30', // Saturday
};

// ============================================================================
// MAIN CALCULATOR
// ============================================================================

export function calculatePanchang(dateStr?: string): PanchangResult {
  const date = dateStr ? new Date(dateStr) : new Date();
  const ymd = date.toISOString().split('T')[0];

  // Vaar (Weekday)
  const vaarIdx = date.getDay();
  const vaar = VAARS[vaarIdx];

  // Mean longitude approximations (Julian Day based)
  const jd = toJulianDay(date);
  
  // Moon mean longitude (degrees from Aries 0°)
  const moonLon = ((218.316 + 13.176396 * (jd - 2451545.0)) % 360 + 360) % 360;
  // Sun mean longitude
  const sunLon = ((280.460 + 0.9856474 * (jd - 2451545.0)) % 360 + 360) % 360;

  // Tithi = (Moon - Sun) / 12°
  let tithiAngle = ((moonLon - sunLon) % 360 + 360) % 360;
  const tithiNum = Math.floor(tithiAngle / 12) + 1;
  const tithiIdx = ((tithiNum - 1) % 15);
  const paksha: 'Shukla' | 'Krishna' = tithiNum <= 15 ? 'Shukla' : 'Krishna';
  const tithi = {
    number: tithiNum,
    name: TITHIS[tithiIdx],
    paksha,
    deity: TITHI_DEITIES[tithiIdx + 1] || 'Lord Brahma',
  };

  // Nakshatra = Moon longitude / (360/27)
  const nakIdx = Math.floor(moonLon / (360 / 27)) % 27;
  const nakshatra = {
    number: nakIdx + 1,
    name: NAKSHATRAS[nakIdx].name,
    deity: NAKSHATRAS[nakIdx].deity,
    lord: NAKSHATRAS[nakIdx].lord,
  };

  // Yoga = (Sun + Moon) / (360/27)
  const yogaSum = (sunLon + moonLon) % 360;
  const yogaIdx = Math.floor(yogaSum / (360 / 27)) % 27;
  const yoga = {
    number: yogaIdx + 1,
    name: YOGAS[yogaIdx].name,
    nature: YOGAS[yogaIdx].nature,
  };

  // Karana = half of Tithi
  const karanaIdx = Math.floor(tithiAngle / 6) % 7;
  const karana = KARANAS[karanaIdx];

  // Approximate sunrise/sunset for Bhopal (23.25°N, 77.41°E)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = -23.45 * Math.cos(((dayOfYear + 10) / 365) * 2 * Math.PI);
  const sunriseHour = 6.5 - declination / 30;
  const sunsetHour = 18.0 + declination / 30;
  const sunrise = `${String(Math.floor(sunriseHour)).padStart(2, '0')}:${String(Math.round((sunriseHour % 1) * 60)).padStart(2, '0')}`;
  const sunset = `${String(Math.floor(sunsetHour)).padStart(2, '0')}:${String(Math.round((sunsetHour % 1) * 60)).padStart(2, '0')}`;

  // Moon phase from tithi
  const moonPhase =
    tithiNum === 1 ? 'New Moon (Amavasya was yesterday)' :
    tithiNum === 15 ? 'Full Moon (Purnima)' :
    tithiNum === 30 ? 'New Moon (Amavasya)' :
    tithiNum < 15 ? `Waxing (Shukla Paksha day ${tithiNum})` :
    `Waning (Krishna Paksha day ${tithiNum - 15})`;

  // Rahu Kaal
  const rahuRange = RAHU_KAAL_SLOTS[vaarIdx].split('-');
  const rahuKaal = { start: rahuRange[0], end: rahuRange[1] };

  // Abhijit Muhurat (middle ~48 min of the day, roughly 11:48-12:36)
  const abhijitMuhurat = { start: '11:48', end: '12:36' };

  // Recommendations
  const recommendations: string[] = [];
  if (yoga.nature === 'Auspicious') {
    recommendations.push(`Yoga "${yoga.name}" is auspicious — favorable for new ventures, signing contracts, journeys`);
  } else if (yoga.nature === 'Inauspicious') {
    recommendations.push(`Yoga "${yoga.name}" is challenging — avoid major decisions, weddings, surgery`);
  }
  if (karana.nature === 'Inauspicious') {
    recommendations.push(`Karana "${karana.name}" (Bhadra) is inauspicious — avoid auspicious work during its duration`);
  }
  if (tithiNum === 4 || tithiNum === 14 || tithiNum === 9) {
    recommendations.push('Riktha Tithi — avoid auspicious events, but good for spiritual practice');
  }
  if (paksha === 'Shukla' && [11, 12, 13].includes(tithiNum)) {
    recommendations.push('Auspicious Tithi — excellent for marriage, housewarming, vehicle purchase');
  }
  recommendations.push(`Avoid Rahu Kaal (${rahuKaal.start}-${rahuKaal.end}) for new beginnings`);
  recommendations.push(`Abhijit Muhurat (${abhijitMuhurat.start}-${abhijitMuhurat.end}) is universally auspicious`);

  return {
    date: ymd,
    vaar,
    tithi,
    nakshatra,
    yoga,
    karana,
    sunrise,
    sunset,
    moonPhase,
    rahuKaal,
    abhijitMuhurat,
    recommendations,
  };
}

// ============================================================================
// HELPER: Julian Day calculation
// ============================================================================

function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  const a = Math.floor((14 - m) / 12);
  const Y = y + 4800 - a;
  const M = m + 12 * a - 3;
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
}
