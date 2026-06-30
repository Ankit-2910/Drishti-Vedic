/**
 * Prokerala API client — astrology computation
 * Falls back to deterministic mock data if API keys not set.
 */

const PROKERALA_BASE = 'https://api.prokerala.com';

interface BirthInput {
  date: string;
  time: string;
  latitude: string;
  longitude: string;
  name?: string;
  place?: string;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  const id = process.env.PROKERALA_CLIENT_ID;
  const secret = process.env.PROKERALA_CLIENT_SECRET;
  if (!id || !secret) throw new Error('Prokerala credentials not configured');

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const res = await fetch(`${PROKERALA_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: id,
      client_secret: secret,
    }),
  });
  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

function buildDateTimeISO(date: string, time: string): string {
  return `${date}T${time}:00+05:30`;
}

export async function generateKundli(input: BirthInput) {
  if (!process.env.PROKERALA_CLIENT_ID) {
    return mockKundli(input);
  }

  const token = await getToken();
  const datetime = buildDateTimeISO(input.date, input.time);
  const coords = `${input.latitude},${input.longitude}`;

  const url = new URL(`${PROKERALA_BASE}/v2/astrology/kundli/advanced`);
  url.searchParams.set('ayanamsa', '1');
  url.searchParams.set('coordinates', coords);
  url.searchParams.set('datetime', datetime);
  url.searchParams.set('la', 'en');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Prokerala kundli failed: ${res.status}`);
  return await res.json();
}

function mockKundli(input: BirthInput) {
  const seed = input.date.charCodeAt(0) + input.time.charCodeAt(0) + (input.name?.length || 5);
  
  const rashis = [
    'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
    'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
    'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
  ];
  
  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
  ];
  
  const ascIdx = seed % 12;
  const moonIdx = (seed + 4) % 12;
  const sunIdx = (seed + 7) % 12;
  
  return {
    ascendant: rashis[ascIdx],
    moonSign: rashis[moonIdx],
    sunSign: rashis[sunIdx],
    nakshatra: `${nakshatras[seed % 27]} (Pada ${(seed % 4) + 1})`,
    currentDasha: {
      mahadasha: ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'][seed % 9],
      antardasha: ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'][(seed + 2) % 9],
      endsOn: `${12 + (seed % 18)} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][seed % 12]} ${2027 + (seed % 5)}`,
    },
    planets: [
      { name: 'Sun (Surya)', sign: rashis[sunIdx], house: (sunIdx % 12) + 1, degree: `${(seed % 28) + 1}°${(seed * 7) % 60}'` },
      { name: 'Moon (Chandra)', sign: rashis[moonIdx], house: (moonIdx % 12) + 1, degree: `${(seed % 28) + 5}°${(seed * 3) % 60}'` },
      { name: 'Mars (Mangal)', sign: rashis[(seed + 1) % 12], house: ((seed + 1) % 12) + 1, degree: `${(seed % 28) + 10}°${(seed * 5) % 60}'` },
      { name: 'Mercury (Budha)', sign: rashis[(seed + 2) % 12], house: ((seed + 2) % 12) + 1, degree: `${(seed % 28) + 15}°${(seed * 11) % 60}'` },
      { name: 'Jupiter (Guru)', sign: rashis[(seed + 3) % 12], house: ((seed + 3) % 12) + 1, degree: `${(seed % 28) + 20}°${(seed * 13) % 60}'` },
      { name: 'Venus (Shukra)', sign: rashis[(seed + 4) % 12], house: ((seed + 4) % 12) + 1, degree: `${(seed % 28) + 8}°${(seed * 9) % 60}'` },
      { name: 'Saturn (Shani)', sign: rashis[(seed + 5) % 12], house: ((seed + 5) % 12) + 1, degree: `${(seed % 28) + 12}°${(seed * 17) % 60}'` },
      { name: 'Rahu', sign: rashis[(seed + 6) % 12], house: ((seed + 6) % 12) + 1, degree: `${(seed % 28) + 18}°${(seed * 19) % 60}'` },
      { name: 'Ketu', sign: rashis[(seed + 12) % 12], house: (((seed + 6) % 12) + 6) % 12 + 1, degree: `${(seed % 28) + 18}°${(seed * 19) % 60}'` },
    ],
    sources: ['BPHS Ch.34', 'Phaladeepika 7.12', 'Saravali 41.2'],
  };
}
