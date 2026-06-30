/**
 * Combined service library: Hora, Vastu, Mantras, Lal Kitab, Raj Yoga, Mangal Dosh
 * Lightweight, pure-data + small computations.
 */

// ============================================================================
// 1. HORA MUHURAT (Planetary Hour)
// ============================================================================
//
// Each day is divided into 24 horas (planetary hours).
// The first hora of each day is ruled by the planet that governs the day:
//   Sunday=Sun, Monday=Moon, Tuesday=Mars, Wednesday=Mercury,
//   Thursday=Jupiter, Friday=Venus, Saturday=Saturn.
// Subsequent horas follow the sequence: Sat → Jupiter → Mars → Sun → Venus → Mercury → Moon → Sat...
// ============================================================================

const HORA_SEQUENCE = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
const DAY_LORD: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
};

const HORA_NATURE: Record<string, { nature: string; favors: string[]; avoid: string[] }> = {
  Sun: {
    nature: 'Authoritative, bold',
    favors: ['Government work', 'Leadership decisions', 'Health matters', 'Father-related work'],
    avoid: ['Emotional discussions', 'Romance'],
  },
  Moon: {
    nature: 'Calm, emotional, fluid',
    favors: ['Travel', 'Mother-related work', 'Water-related activities', 'Emotional healing'],
    avoid: ['Confrontations', 'Aggressive negotiations'],
  },
  Mars: {
    nature: 'Bold, fiery, combative',
    favors: ['Sports', 'Surgery', 'Property purchase', 'Litigation initiation'],
    avoid: ['Marriage talks', 'Diplomacy', 'Healing rituals'],
  },
  Mercury: {
    nature: 'Intellectual, communicative',
    favors: ['Education', 'Writing', 'Trade', 'Communication', 'Travel for business'],
    avoid: ['Heavy physical labor', 'Surgery'],
  },
  Jupiter: {
    nature: 'Auspicious, wise',
    favors: ['Marriage', 'Religious ceremonies', 'Education start', 'Property registration', 'Spiritual work'],
    avoid: ['Almost nothing — Jupiter hora is universally good'],
  },
  Venus: {
    nature: 'Loving, artistic',
    favors: ['Marriage', 'Romance', 'Art', 'Music', 'Buying jewelry', 'Cosmetics, beauty'],
    avoid: ['Surgery', 'Funerals', 'Confrontation'],
  },
  Saturn: {
    nature: 'Slow, serious, disciplined',
    favors: ['Long-term planning', 'Construction', 'Iron/heavy material purchase', 'Funeral rites'],
    avoid: ['Joyous events', 'Marriage', 'New business launch'],
  },
};

export interface HoraResult {
  currentHora: string;
  horaNumber: number;
  startTime: string;
  endTime: string;
  nature: string;
  favors: string[];
  avoid: string[];
  upcomingHoras: Array<{ time: string; planet: string; nature: string }>;
}

export function calculateHora(asOfTime?: Date): HoraResult {
  const now = asOfTime || new Date();
  const dayIdx = now.getDay();

  // Approximate sunrise at 6:00 AM IST (simplified)
  const sunrise = new Date(now);
  sunrise.setHours(6, 0, 0, 0);

  // Hours since sunrise
  let hoursSinceSunrise = (now.getTime() - sunrise.getTime()) / (1000 * 60 * 60);
  if (hoursSinceSunrise < 0) hoursSinceSunrise += 24;

  const horaNumber = Math.floor(hoursSinceSunrise) + 1;
  // Day lord = first hora
  const dayLord = DAY_LORD[dayIdx];
  const startIdx = HORA_SEQUENCE.indexOf(dayLord);
  const currentHoraPlanet = HORA_SEQUENCE[(startIdx + horaNumber - 1) % 7];

  const startTime = formatTime(Math.floor(hoursSinceSunrise) + 6, 0);
  const endTime = formatTime(Math.floor(hoursSinceSunrise) + 7, 0);

  const meta = HORA_NATURE[currentHoraPlanet];

  // Next 5 horas
  const upcomingHoras = [];
  for (let i = 1; i <= 5; i++) {
    const futureHoraIdx = horaNumber + i - 1;
    const planet = HORA_SEQUENCE[(startIdx + futureHoraIdx) % 7];
    const futureTime = formatTime(Math.floor(hoursSinceSunrise) + 6 + i, 0);
    upcomingHoras.push({
      time: futureTime,
      planet,
      nature: HORA_NATURE[planet].nature,
    });
  }

  return {
    currentHora: currentHoraPlanet,
    horaNumber,
    startTime,
    endTime,
    nature: meta.nature,
    favors: meta.favors,
    avoid: meta.avoid,
    upcomingHoras,
  };
}

function formatTime(h: number, m: number): string {
  const hh = ((h % 24) + 24) % 24;
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ============================================================================
// 2. VASTU (from Kua direction)
// ============================================================================

export interface VastuResult {
  kua: number;
  group: string;
  bestDirections: Array<{ direction: string; purpose: string; energy: string }>;
  worstDirections: Array<{ direction: string; problem: string }>;
  homeRecommendations: string[];
  workRecommendations: string[];
}

const DIRECTION_NAMES_HI: Record<string, string> = {
  N: 'उत्तर (Uttar)',
  S: 'दक्षिण (Dakshin)',
  E: 'पूर्व (Purva)',
  W: 'पश्चिम (Paschim)',
  NE: 'ईशान (Ishan)',
  NW: 'वायव्य (Vayavya)',
  SE: 'आग्नेय (Agneya)',
  SW: 'नैऋत्य (Nairutya)',
};

const KUA_VASTU: Record<number, {
  group: string;
  best: Array<{ direction: string; purpose: string; energy: string }>;
  worst: Array<{ direction: string; problem: string }>;
}> = {
  1: {
    group: 'East Group',
    best: [
      { direction: 'SE', purpose: 'Wealth (Sheng Chi)', energy: 'Prosperity, success' },
      { direction: 'E', purpose: 'Health (Tien Yi)', energy: 'Vitality, recovery' },
      { direction: 'S', purpose: 'Romance (Yen Nien)', energy: 'Relationships, longevity' },
      { direction: 'N', purpose: 'Career (Fu Wei)', energy: 'Personal growth' },
    ],
    worst: [
      { direction: 'W', problem: 'Total Loss (Chueh Ming)' },
      { direction: 'NE', problem: 'Six Killings (Liu Sha)' },
      { direction: 'NW', problem: 'Five Ghosts (Wu Kuei)' },
      { direction: 'SW', problem: 'Bad Luck (Ho Hai)' },
    ],
  },
  2: {
    group: 'West Group',
    best: [
      { direction: 'NE', purpose: 'Wealth', energy: 'Prosperity' },
      { direction: 'W', purpose: 'Health', energy: 'Vitality' },
      { direction: 'NW', purpose: 'Romance', energy: 'Relationships' },
      { direction: 'SW', purpose: 'Career', energy: 'Personal growth' },
    ],
    worst: [
      { direction: 'N', problem: 'Total Loss' },
      { direction: 'S', problem: 'Six Killings' },
      { direction: 'E', problem: 'Five Ghosts' },
      { direction: 'SE', problem: 'Bad Luck' },
    ],
  },
  3: {
    group: 'East Group',
    best: [
      { direction: 'S', purpose: 'Wealth', energy: 'Prosperity' },
      { direction: 'N', purpose: 'Health', energy: 'Vitality' },
      { direction: 'SE', purpose: 'Romance', energy: 'Relationships' },
      { direction: 'E', purpose: 'Career', energy: 'Personal growth' },
    ],
    worst: [
      { direction: 'SW', problem: 'Total Loss' },
      { direction: 'NW', problem: 'Six Killings' },
      { direction: 'NE', problem: 'Five Ghosts' },
      { direction: 'W', problem: 'Bad Luck' },
    ],
  },
  4: {
    group: 'East Group',
    best: [
      { direction: 'N', purpose: 'Wealth', energy: 'Prosperity' },
      { direction: 'S', purpose: 'Health', energy: 'Vitality' },
      { direction: 'E', purpose: 'Romance', energy: 'Relationships' },
      { direction: 'SE', purpose: 'Career', energy: 'Personal growth' },
    ],
    worst: [
      { direction: 'NW', problem: 'Total Loss' },
      { direction: 'SW', problem: 'Six Killings' },
      { direction: 'W', problem: 'Five Ghosts' },
      { direction: 'NE', problem: 'Bad Luck' },
    ],
  },
  6: {
    group: 'West Group',
    best: [
      { direction: 'W', purpose: 'Wealth', energy: 'Prosperity' },
      { direction: 'NE', purpose: 'Health', energy: 'Vitality' },
      { direction: 'SW', purpose: 'Romance', energy: 'Relationships' },
      { direction: 'NW', purpose: 'Career', energy: 'Personal growth' },
    ],
    worst: [
      { direction: 'SE', problem: 'Total Loss' },
      { direction: 'E', problem: 'Six Killings' },
      { direction: 'N', problem: 'Five Ghosts' },
      { direction: 'S', problem: 'Bad Luck' },
    ],
  },
  7: {
    group: 'West Group',
    best: [
      { direction: 'NW', purpose: 'Wealth', energy: 'Prosperity' },
      { direction: 'SW', purpose: 'Health', energy: 'Vitality' },
      { direction: 'NE', purpose: 'Romance', energy: 'Relationships' },
      { direction: 'W', purpose: 'Career', energy: 'Personal growth' },
    ],
    worst: [
      { direction: 'E', problem: 'Total Loss' },
      { direction: 'SE', problem: 'Six Killings' },
      { direction: 'S', problem: 'Five Ghosts' },
      { direction: 'N', problem: 'Bad Luck' },
    ],
  },
  8: {
    group: 'West Group',
    best: [
      { direction: 'SW', purpose: 'Wealth', energy: 'Prosperity' },
      { direction: 'NW', purpose: 'Health', energy: 'Vitality' },
      { direction: 'W', purpose: 'Romance', energy: 'Relationships' },
      { direction: 'NE', purpose: 'Career', energy: 'Personal growth' },
    ],
    worst: [
      { direction: 'S', problem: 'Total Loss' },
      { direction: 'N', problem: 'Six Killings' },
      { direction: 'SE', problem: 'Five Ghosts' },
      { direction: 'E', problem: 'Bad Luck' },
    ],
  },
  9: {
    group: 'East Group',
    best: [
      { direction: 'E', purpose: 'Wealth', energy: 'Prosperity' },
      { direction: 'SE', purpose: 'Health', energy: 'Vitality' },
      { direction: 'N', purpose: 'Romance', energy: 'Relationships' },
      { direction: 'S', purpose: 'Career', energy: 'Personal growth' },
    ],
    worst: [
      { direction: 'NE', problem: 'Total Loss' },
      { direction: 'W', problem: 'Six Killings' },
      { direction: 'SW', problem: 'Five Ghosts' },
      { direction: 'NW', problem: 'Bad Luck' },
    ],
  },
};

export function calculateVastu(kua: number): VastuResult {
  const data = KUA_VASTU[kua] || KUA_VASTU[1];

  const homeRecommendations: string[] = [];
  const bestForWealth = data.best.find((d) => d.purpose.includes('Wealth'));
  const bestForRomance = data.best.find((d) => d.purpose.includes('Romance'));
  const bestForHealth = data.best.find((d) => d.purpose.includes('Health'));

  if (bestForWealth) {
    homeRecommendations.push(`Place safe/locker in ${DIRECTION_NAMES_HI[bestForWealth.direction]} corner of home`);
  }
  if (bestForRomance) {
    homeRecommendations.push(`Master bedroom should face ${DIRECTION_NAMES_HI[bestForRomance.direction]} for relationship harmony`);
  }
  if (bestForHealth) {
    homeRecommendations.push(`Pooja room or meditation space ideal in ${DIRECTION_NAMES_HI[bestForHealth.direction]}`);
  }
  homeRecommendations.push(`Avoid sleeping with head pointing to worst direction (${data.worst[0].direction})`);

  const workRecommendations: string[] = [];
  const bestForCareer = data.best.find((d) => d.purpose.includes('Career'));
  if (bestForCareer) {
    workRecommendations.push(`Desk should face ${DIRECTION_NAMES_HI[bestForCareer.direction]} for career growth`);
  }
  if (bestForWealth) {
    workRecommendations.push(`Sit so your back is toward ${DIRECTION_NAMES_HI[bestForWealth.direction]} during important meetings`);
  }
  workRecommendations.push('Keep a small water feature in NE for wealth flow (universal Vastu rule)');

  // Translate directions to Hindi
  const best = data.best.map((d) => ({
    ...d,
    direction: DIRECTION_NAMES_HI[d.direction] || d.direction,
  }));
  const worst = data.worst.map((d) => ({
    ...d,
    direction: DIRECTION_NAMES_HI[d.direction] || d.direction,
  }));

  return {
    kua,
    group: data.group,
    bestDirections: best,
    worstDirections: worst,
    homeRecommendations,
    workRecommendations,
  };
}

// ============================================================================
// 3. MANGAL DOSH detector
// ============================================================================

export interface MangalDoshResult {
  hasManglik: boolean;
  intensity: 'None' | 'Low' | 'Medium' | 'High';
  marsHouse: number | null;
  cancellationReasons: string[];
  marriageImpact: string;
  remedies: string[];
}

// Houses where Mars causes Mangal Dosh: 1, 2, 4, 7, 8, 12
const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

export function checkMangalDosh(marsHouse: number, birthDate: string): MangalDoshResult {
  const hasManglik = MANGLIK_HOUSES.includes(marsHouse);

  let intensity: MangalDoshResult['intensity'] = 'None';
  if (hasManglik) {
    if (marsHouse === 7 || marsHouse === 8) intensity = 'High';
    else if (marsHouse === 1 || marsHouse === 4) intensity = 'Medium';
    else intensity = 'Low';
  }

  const cancellationReasons: string[] = [];
  // After age 28, Mangal Dosh weakens significantly
  const birthYear = parseInt(birthDate.split('-')[0], 10);
  const age = new Date().getFullYear() - birthYear;
  if (age >= 28) {
    cancellationReasons.push('Age 28+ — Mangal Dosh natural mitigation (classical exception)');
  }
  if (marsHouse === 1) {
    cancellationReasons.push('Mars in own sign (Aries/Scorpio) or exaltation (Capricorn) — dosh reduced');
  }

  let marriageImpact = '';
  if (!hasManglik) {
    marriageImpact = 'No Mangal Dosh — Mars is not in any of the 6 dosh-causing houses (1, 2, 4, 7, 8, 12). Marriage compatibility from this angle is clear.';
  } else if (cancellationReasons.length > 0) {
    marriageImpact = `Mangal Dosh present but mitigated due to: ${cancellationReasons.join('; ')}. Marriage to non-Manglik possible with awareness.`;
  } else {
    marriageImpact = `Mangal Dosh active (intensity: ${intensity}). Best paired with another Manglik partner — the dosh mutually cancels per classical scriptures (Phaladeepika 7.30). Marriage to non-Manglik requires remedies.`;
  }

  const remedies = hasManglik
    ? [
        'Kumbh Vivah / Vishnu Vivah ritual before marriage (most effective)',
        'Tuesday fast — eat only once after sunset, no salt',
        'Recite Hanuman Chalisa daily, 7 times on Tuesdays',
        'Donate red lentils (masoor dal), red cloth, sugar on Tuesdays',
        'Wear Red Coral (Moonga) after consultation with senior astrologer',
        'Visit Hanuman temple on Tuesdays, offer chola and sindoor',
        'Recite Mangal Beej Mantra: "Om Kram Kreem Kraum Sah Bhaumaya Namah" (108 times daily)',
      ]
    : ['No specific Mangal-related remedies needed'];

  return {
    hasManglik,
    intensity,
    marsHouse: hasManglik ? marsHouse : null,
    cancellationReasons,
    marriageImpact,
    remedies,
  };
}

// ============================================================================
// 4. MANTRAS by Mulank
// ============================================================================

export interface MantraSet {
  mulank: number;
  rulingPlanet: string;
  mantras: Array<{
    mantra: string;
    transliteration: string;
    meaning: string;
    count: number;
    bestTime: string;
  }>;
}

const MANTRAS_BY_MULANK: Record<number, MantraSet> = {
  1: {
    mulank: 1, rulingPlanet: 'Sun',
    mantras: [
      { mantra: 'ॐ सूर्याय नमः', transliteration: 'Om Suryaya Namah', meaning: 'Salutations to Lord Sun', count: 108, bestTime: 'Sunrise, Sunday' },
      { mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', transliteration: 'Om Hraam Hreem Hraum Sah Suryaya Namah', meaning: 'Sun Beej Mantra — solar empowerment', count: 7000, bestTime: 'Sundays, dawn' },
      { mantra: 'आदित्य हृदय स्तोत्र', transliteration: 'Aditya Hridaya Stotra', meaning: 'Recited by Rama before victory over Ravana', count: 1, bestTime: 'Sunday morning' },
    ],
  },
  2: {
    mulank: 2, rulingPlanet: 'Moon',
    mantras: [
      { mantra: 'ॐ चन्द्राय नमः', transliteration: 'Om Chandraya Namah', meaning: 'Salutations to Lord Moon', count: 108, bestTime: 'Monday night, full moon' },
      { mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः', transliteration: 'Om Shraam Shreem Shraum Sah Chandramase Namah', meaning: 'Moon Beej Mantra', count: 11000, bestTime: 'Mondays' },
    ],
  },
  3: {
    mulank: 3, rulingPlanet: 'Jupiter',
    mantras: [
      { mantra: 'ॐ बृहस्पतये नमः', transliteration: 'Om Brihaspataye Namah', meaning: 'Salutations to Guru Brihaspati', count: 108, bestTime: 'Thursday morning' },
      { mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', transliteration: 'Om Graam Greem Graum Sah Gurave Namah', meaning: 'Jupiter Beej Mantra', count: 19000, bestTime: 'Thursdays' },
    ],
  },
  4: {
    mulank: 4, rulingPlanet: 'Rahu',
    mantras: [
      { mantra: 'ॐ राहवे नमः', transliteration: 'Om Rahave Namah', meaning: 'Salutations to Rahu', count: 108, bestTime: 'Saturday, Sunday' },
      { mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', transliteration: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah', meaning: 'Rahu Beej Mantra', count: 18000, bestTime: 'Saturdays' },
    ],
  },
  5: {
    mulank: 5, rulingPlanet: 'Mercury',
    mantras: [
      { mantra: 'ॐ बुधाय नमः', transliteration: 'Om Budhaya Namah', meaning: 'Salutations to Mercury', count: 108, bestTime: 'Wednesday morning' },
      { mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', transliteration: 'Om Braam Breem Braum Sah Budhaya Namah', meaning: 'Mercury Beej Mantra', count: 9000, bestTime: 'Wednesdays' },
    ],
  },
  6: {
    mulank: 6, rulingPlanet: 'Venus',
    mantras: [
      { mantra: 'ॐ शुक्राय नमः', transliteration: 'Om Shukraya Namah', meaning: 'Salutations to Venus', count: 108, bestTime: 'Friday morning' },
      { mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', transliteration: 'Om Draam Dreem Draum Sah Shukraya Namah', meaning: 'Venus Beej Mantra', count: 16000, bestTime: 'Fridays' },
    ],
  },
  7: {
    mulank: 7, rulingPlanet: 'Ketu',
    mantras: [
      { mantra: 'ॐ केतवे नमः', transliteration: 'Om Ketave Namah', meaning: 'Salutations to Ketu', count: 108, bestTime: 'Tuesday, Thursday' },
      { mantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः', transliteration: 'Om Sraam Sreem Sraum Sah Ketave Namah', meaning: 'Ketu Beej Mantra', count: 17000, bestTime: 'Tuesdays' },
    ],
  },
  8: {
    mulank: 8, rulingPlanet: 'Saturn',
    mantras: [
      { mantra: 'ॐ शनैश्चराय नमः', transliteration: 'Om Shanaischaraya Namah', meaning: 'Salutations to Lord Shani', count: 108, bestTime: 'Saturday evening' },
      { mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', transliteration: 'Om Praam Preem Praum Sah Shanaischaraya Namah', meaning: 'Saturn Beej Mantra', count: 23000, bestTime: 'Saturdays' },
      { mantra: 'हनुमान चालीसा', transliteration: 'Hanuman Chalisa', meaning: 'Reduces Saturn affliction (Shani Dosh)', count: 11, bestTime: 'Saturday morning' },
    ],
  },
  9: {
    mulank: 9, rulingPlanet: 'Mars',
    mantras: [
      { mantra: 'ॐ अंगारकाय नमः', transliteration: 'Om Angarakaya Namah', meaning: 'Salutations to Mars', count: 108, bestTime: 'Tuesday morning' },
      { mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', transliteration: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah', meaning: 'Mars Beej Mantra', count: 10000, bestTime: 'Tuesdays' },
      { mantra: 'हनुमान चालीसा', transliteration: 'Hanuman Chalisa', meaning: 'Mars is ruled by Hanuman ji', count: 11, bestTime: 'Tuesday morning' },
    ],
  },
};

export function getMantras(mulank: number): MantraSet {
  // Handle master numbers
  let m = mulank;
  if (m === 11) m = 2;
  if (m === 22) m = 4;
  if (m === 33) m = 6;
  return MANTRAS_BY_MULANK[m] || MANTRAS_BY_MULANK[1];
}

// ============================================================================
// 5. LAL KITAB basic remedies
// ============================================================================

export interface LalKitabRemedy {
  planet: string;
  problem: string;
  remedy: string;
  duration: string;
  significance: string;
}

const LAL_KITAB_REMEDIES: LalKitabRemedy[] = [
  { planet: 'Sun (Surya)', problem: 'Father issues, ego, low confidence, government problems', remedy: 'Offer water to Sun at sunrise; donate wheat & jaggery on Sundays; respect father and elders', duration: '43 days', significance: 'Sun afflicted = career stagnation' },
  { planet: 'Moon (Chandra)', problem: 'Mother issues, depression, mental restlessness, fluid retention', remedy: 'Offer milk at a temple; donate rice & silver on Mondays; chant "Om Namah Shivay" daily', duration: '108 days', significance: 'Moon afflicted = emotional instability' },
  { planet: 'Mars (Mangal)', problem: 'Anger, accidents, blood issues, marital strife (Manglik Dosh)', remedy: 'Donate red lentils, red cloth, sweets on Tuesdays; Hanuman Chalisa 11 times', duration: '40 days', significance: 'Mars afflicted = aggression and conflict' },
  { planet: 'Mercury (Budha)', problem: 'Speech defects, skin issues, business losses, communication breakdown', remedy: 'Feed green vegetables to cows; donate green cloth & whole moong; chant Vishnu Sahasranama', duration: '17 days', significance: 'Mercury afflicted = communication failures' },
  { planet: 'Jupiter (Guru)', problem: 'Lack of wisdom, weight gain, gallbladder issues, late marriage', remedy: 'Offer yellow flowers to Banana tree on Thursdays; donate yellow cloth, turmeric, gram dal', duration: '40 days', significance: 'Jupiter afflicted = lack of guidance' },
  { planet: 'Venus (Shukra)', problem: 'Marital discord, eye problems, lack of luxury, romantic issues', remedy: 'Donate white cloth, sugar, perfume on Fridays; serve cows; maintain cleanliness', duration: '21 days', significance: 'Venus afflicted = relationship breakdowns' },
  { planet: 'Saturn (Shani)', problem: 'Delays, hardships, joint pain, professional setbacks (Sade Sati)', remedy: 'Offer mustard oil at Shani temple on Saturdays; donate black sesame, black cloth, iron', duration: '108 days', significance: 'Saturn afflicted = relentless struggle' },
  { planet: 'Rahu', problem: 'Confusion, sudden losses, addictions, foreign troubles', remedy: 'Donate radishes & black blanket; bathe in Ganga water; recite "Om Bhram Bhrim Bhraum Sah Rahave Namah"', duration: '40 days', significance: 'Rahu afflicted = illusion and instability' },
  { planet: 'Ketu', problem: 'Spiritual blocks, mysterious illnesses, isolation, foot problems', remedy: 'Donate variegated blanket, sesame oil; feed dogs; chant "Om Sram Srim Sraum Sah Ketave Namah"', duration: '40 days', significance: 'Ketu afflicted = unresolved past karma' },
];

export function getLalKitabRemedies(): LalKitabRemedy[] {
  return LAL_KITAB_REMEDIES;
}

// ============================================================================
// 6. RAJ YOGA detector (simplified)
// ============================================================================

export interface RajYogaResult {
  yogasFound: Array<{
    name: string;
    description: string;
    effect: string;
    strength: 'Strong' | 'Moderate' | 'Weak';
  }>;
  overallAssessment: string;
}

// Simplified detector — uses ascendant + key planet placements
// In production with Prokerala, you'd analyze actual chart
export function detectRajYogas(ascendant: string, planets: Array<{ name: string; house: number; sign: string }>): RajYogaResult {
  const yogasFound: RajYogaResult['yogasFound'] = [];

  const findPlanet = (name: string) => planets.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
  const sun = findPlanet('Sun');
  const moon = findPlanet('Moon');
  const jupiter = findPlanet('Jupiter');
  const venus = findPlanet('Venus');

  // Gajakesari Yoga: Moon and Jupiter in mutual kendra (1, 4, 7, 10)
  if (moon && jupiter) {
    const diff = Math.abs(moon.house - jupiter.house) % 12;
    if ([0, 3, 6, 9].includes(diff)) {
      yogasFound.push({
        name: 'Gajakesari Yoga',
        description: 'Moon and Jupiter in mutual kendra positions',
        effect: 'Wisdom, fame, wealth, success in academic & spiritual pursuits',
        strength: 'Strong',
      });
    }
  }

  // Budha-Aditya Yoga: Sun and Mercury in same house
  const mercury = findPlanet('Mercury');
  if (sun && mercury && sun.house === mercury.house) {
    yogasFound.push({
      name: 'Budha-Aditya Yoga',
      description: 'Sun and Mercury conjunct',
      effect: 'Intelligence, communication skills, government favor',
      strength: 'Moderate',
    });
  }

  // Lakshmi Yoga: Jupiter or Venus in kendra/trikona
  if (jupiter && [1, 4, 5, 7, 9, 10].includes(jupiter.house)) {
    yogasFound.push({
      name: 'Lakshmi Yoga (via Jupiter)',
      description: 'Jupiter in kendra or trikona',
      effect: 'Wealth, prosperity, divine grace',
      strength: 'Strong',
    });
  }
  if (venus && [1, 4, 5, 7, 9, 10].includes(venus.house)) {
    yogasFound.push({
      name: 'Lakshmi Yoga (via Venus)',
      description: 'Venus in kendra or trikona',
      effect: 'Luxury, comforts, beauty, artistic success',
      strength: 'Moderate',
    });
  }

  // Hamsa Yoga: Jupiter in own/exalted sign in kendra
  if (jupiter && [1, 4, 7, 10].includes(jupiter.house) && 
      (jupiter.sign.includes('Sagittarius') || jupiter.sign.includes('Pisces') || jupiter.sign.includes('Cancer'))) {
    yogasFound.push({
      name: 'Hamsa Yoga (Panch Mahapurusha)',
      description: 'Jupiter in own sign or exaltation, in kendra',
      effect: 'Righteousness, leadership, scholarship, longevity',
      strength: 'Strong',
    });
  }

  // Generic positive: Sun in 10th
  if (sun && sun.house === 10) {
    yogasFound.push({
      name: 'Surya in 10th',
      description: 'Sun in the 10th house of career',
      effect: 'Strong career, government work, authority positions',
      strength: 'Moderate',
    });
  }

  const overallAssessment =
    yogasFound.length >= 3
      ? 'Multiple Raj Yogas detected — exceptionally strong chart with significant potential for elevated life status, recognition, and material success.'
      : yogasFound.length === 2
      ? 'Notable Raj Yogas present — chart shows clear potential for success and recognition, especially when yoga-lords are dasha-active.'
      : yogasFound.length === 1
      ? 'One Raj Yoga detected — auspicious foundation for above-average life outcomes; results depend on overall chart strength.'
      : 'No major Raj Yogas detected in this simplified analysis. Full chart-based assessment by senior astrologer recommended for hidden yogas (parivartana, dhana, neechabhanga, etc.).';

  return { yogasFound, overallAssessment };
}
