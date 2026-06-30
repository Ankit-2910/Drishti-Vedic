/**
 * DRISHTI VEDIC — Complete Numerology Engine
 * 
 * Combines Vedic (Indian) + Chaldean numerology systems.
 * Pure JavaScript math — NO API calls, NO external dependencies.
 * Free, instant, deterministic.
 * 
 * Calculations included:
 *  1. Mulank (Driver Number / Birth Number)
 *  2. Bhagyank (Destiny / Life Path Number) [Jamank in Hindi]
 *  3. Naamank (Name Number) — Chaldean system
 *  4. Soul Number (Heart's Desire — vowels)
 *  5. Personality Number (Outer image — consonants)
 *  6. Kua Number (Feng Shui — East/West direction group)
 *  7. Lo Shu Grid (3x3 magic square — strengths/weaknesses + 6 Arrows)
 *  8. Personal Year Number
 *  9. Personal Day Number
 * 10. Karmic Debt Detection (13, 14, 16, 19)
 * 11. Master Number Detection (11, 22, 33)
 * 12. Compatibility Matrix (Mulank-Bhagyank between two people)
 * 
 * Author: Shivanchal Consultants (Ankit Dubey, Bhopal)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface NumerologyInput {
  fullName: string;
  date: string; // YYYY-MM-DD
  gender: 'male' | 'female';
}

export interface NumerologyReport {
  // Core numbers
  mulank: number;
  bhagyank: number;
  naamank: number;
  soulNumber: number;
  personalityNumber: number;
  
  // Special detections
  isMasterMulank: boolean;
  isMasterBhagyank: boolean;
  karmicDebts: number[]; // [13, 14, 16, 19] if encountered
  masterNumbers: number[]; // [11, 22, 33] if encountered (unreduced)
  
  // Feng Shui
  kua: number;
  kuaGroup: 'East' | 'West';
  luckyDirections: string[];
  unluckyDirections: string[];
  
  // Lo Shu Grid
  loShuGrid: LoShuGrid;
  
  // Time-based
  personalYear: number;
  personalDay: number;
  personalMonth: number;
  
  // Insights
  personalityTraits: string[];
  strengths: string[];
  weaknesses: string[];
  career: string[];
  
  // Lucky attributes
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDays: string[];
  luckyGemstone: string;
  rulingPlanet: string;
  deity: string;
  
  // Compatibility hints
  compatibleNumbers: number[];
  neutralNumbers: number[];
  challengingNumbers: number[];
  
  // Avoid
  avoidNumbers: number[];
  avoidColors: string[];
  avoidDays: string[];
}

export interface LoShuGrid {
  grid: number[][]; // 3x3 with counts
  presentNumbers: number[];
  missingNumbers: number[];
  arrows: {
    strengths: string[]; // 'Spiritual', 'Intellect', 'Will', etc.
    weaknesses: string[];
  };
  interpretation: string;
}

export interface CompatibilityResult {
  mulankMatch: { score: number; verdict: string };
  bhagyankMatch: { score: number; verdict: string };
  naamankMatch: { score: number; verdict: string };
  kuaMatch: { compatible: boolean; verdict: string };
  loShuGridSynergy: { score: number; complementary: number[] };
  overallNumerologyScore: number; // out of 25
  verdict: string;
}

// ============================================================================
// CHALDEAN NUMEROLOGY TABLE
// (Note: Chaldean has NO 9 in alphabet — 9 is sacred/divine)
// ============================================================================

const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

// ============================================================================
// UTILITY: Reduce a number to single digit (1-9), preserving master numbers
// ============================================================================

function reduceToSingleDigit(num: number, preserveMasters = false): number {
  if (preserveMasters && (num === 11 || num === 22 || num === 33)) {
    return num;
  }
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
    if (preserveMasters && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
  }
  return num;
}

function sumDigits(num: number): number {
  return String(num).split('').reduce((s, d) => s + parseInt(d, 10), 0);
}

// ============================================================================
// 1. MULANK (Driver / Birth Number)
// ============================================================================

export function calculateMulank(birthDate: string): number {
  const day = parseInt(birthDate.split('-')[2], 10);
  return reduceToSingleDigit(day);
}

// ============================================================================
// 2. BHAGYANK (Destiny / Life Path / Jamank)
// ============================================================================

export function calculateBhagyank(birthDate: string, preserveMaster = true): number {
  const [year, month, day] = birthDate.split('-').map((s) => parseInt(s, 10));
  const total = sumDigits(year) + sumDigits(month) + sumDigits(day);
  return reduceToSingleDigit(total, preserveMaster);
}

// ============================================================================
// 3. NAAMANK (Name Number — Chaldean)
// ============================================================================

export function calculateNaamank(fullName: string): number {
  const cleaned = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const total = cleaned.split('').reduce((sum, ch) => {
    return sum + (CHALDEAN_MAP[ch] || 0);
  }, 0);
  return reduceToSingleDigit(total);
}

// ============================================================================
// 4 & 5. SOUL NUMBER (vowels) + PERSONALITY NUMBER (consonants)
// ============================================================================

export function calculateSoulNumber(fullName: string): number {
  const cleaned = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const total = cleaned.split('').reduce((sum, ch) => {
    return VOWELS.includes(ch) ? sum + (CHALDEAN_MAP[ch] || 0) : sum;
  }, 0);
  return reduceToSingleDigit(total);
}

export function calculatePersonalityNumber(fullName: string): number {
  const cleaned = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const total = cleaned.split('').reduce((sum, ch) => {
    return !VOWELS.includes(ch) ? sum + (CHALDEAN_MAP[ch] || 0) : sum;
  }, 0);
  return reduceToSingleDigit(total);
}

// ============================================================================
// 6. KUA NUMBER (Feng Shui — East/West direction group)
// ============================================================================

export function calculateKuaNumber(birthDate: string, gender: 'male' | 'female'): {
  kua: number;
  group: 'East' | 'West';
  luckyDirections: string[];
  unluckyDirections: string[];
} {
  const year = parseInt(birthDate.split('-')[0], 10);
  const lastTwoDigits = year % 100;
  const yearSum = reduceToSingleDigit(lastTwoDigits);

  let kua: number;
  
  if (year < 2000) {
    if (gender === 'male') {
      kua = 10 - yearSum;
      if (kua < 1) kua += 9;
    } else {
      kua = yearSum + 5;
      if (kua > 9) kua -= 9;
    }
  } else {
    // For years 2000+
    if (gender === 'male') {
      kua = 9 - yearSum;
      if (kua < 1) kua += 9;
    } else {
      kua = yearSum + 6;
      if (kua > 9) kua -= 9;
    }
  }
  
  // Kua 5 substitution: men become 2, women become 8
  if (kua === 5) {
    kua = gender === 'male' ? 2 : 8;
  }
  
  const eastGroup = [1, 3, 4, 9];
  const westGroup = [2, 6, 7, 8];
  const group: 'East' | 'West' = eastGroup.includes(kua) ? 'East' : 'West';
  
  // Lucky/unlucky directions by Kua
  const KUA_DIRECTIONS: Record<number, { lucky: string[]; unlucky: string[] }> = {
    1: { lucky: ['SE', 'E', 'S', 'N'], unlucky: ['W', 'NE', 'NW', 'SW'] },
    2: { lucky: ['NE', 'W', 'NW', 'SW'], unlucky: ['N', 'S', 'E', 'SE'] },
    3: { lucky: ['S', 'N', 'SE', 'E'], unlucky: ['SW', 'NW', 'NE', 'W'] },
    4: { lucky: ['N', 'S', 'E', 'SE'], unlucky: ['NW', 'SW', 'W', 'NE'] },
    6: { lucky: ['W', 'NE', 'SW', 'NW'], unlucky: ['SE', 'E', 'N', 'S'] },
    7: { lucky: ['NW', 'SW', 'NE', 'W'], unlucky: ['E', 'SE', 'S', 'N'] },
    8: { lucky: ['SW', 'NW', 'W', 'NE'], unlucky: ['S', 'N', 'SE', 'E'] },
    9: { lucky: ['E', 'SE', 'N', 'S'], unlucky: ['NE', 'W', 'SW', 'NW'] },
  };
  
  const dirs = KUA_DIRECTIONS[kua] || KUA_DIRECTIONS[1];
  
  return {
    kua,
    group,
    luckyDirections: dirs.lucky,
    unluckyDirections: dirs.unlucky,
  };
}

// ============================================================================
// 7. LO SHU GRID (3x3 magic square + 6 Arrows analysis)
// 
// Lo Shu Grid positions (Saturn-based, traditional Vedic):
//    4 | 9 | 2
//    --|---|--
//    3 | 5 | 7
//    --|---|--
//    8 | 1 | 6
// ============================================================================

const GRID_POSITIONS: Record<number, [number, number]> = {
  1: [2, 1], // bottom-middle
  2: [0, 2], // top-right
  3: [1, 0], // middle-left
  4: [0, 0], // top-left
  5: [1, 1], // center
  6: [2, 2], // bottom-right
  7: [1, 2], // middle-right
  8: [2, 0], // bottom-left
  9: [0, 1], // top-middle
};

export function calculateLoShuGrid(
  birthDate: string,
  mulank: number,
  bhagyank: number
): LoShuGrid {
  // Initialize 3x3 grid with zero counts
  const grid: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  
  // Counts of each number 1-9
  const counts: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };
  
  // Add all digits from birthdate (DD MM YYYY)
  const cleanDate = birthDate.replace(/-/g, '');
  for (const ch of cleanDate) {
    const digit = parseInt(ch, 10);
    if (digit >= 1 && digit <= 9) {
      counts[digit]++;
    }
  }
  
  // Add Mulank and Bhagyank (key Vedic addition)
  counts[mulank]++;
  counts[bhagyank]++;
  
  // Place counts on grid based on positions
  for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    const [row, col] = GRID_POSITIONS[num];
    grid[row][col] = counts[num];
  }
  
  // Determine present and missing numbers
  const presentNumbers = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([num, _]) => parseInt(num, 10))
    .sort((a, b) => a - b);
  
  const missingNumbers = Object.entries(counts)
    .filter(([_, count]) => count === 0)
    .map(([num, _]) => parseInt(num, 10))
    .sort((a, b) => a - b);
  
  // 6 Arrows Analysis
  // Vertical lines (top to bottom)
  // - Spiritual: 1-5-9 (bottom-middle, center, top-middle)
  // - Will/Practical: 3-5-7 (middle row)
  // Horizontal lines (left to right)
  // - Planning: 4-5-6 (left col positions)
  // - Emotional/Family: 2-5-8 (right col? Let's check positions)
  // Actually let me recheck. In Lo Shu Grid:
  // 4-9-2 is top row, 3-5-7 is middle row, 8-1-6 is bottom row
  // Vertical: 4-3-8 (left col), 9-5-1 (middle col), 2-7-6 (right col)
  // Diagonal: 4-5-6 and 2-5-8
  
  // Traditional Vedic arrows (these refer to the SUM PATTERNS through the magic square,
  // which always sums to 15 in any direction):
  const ARROWS = {
    // STRENGTH ARROWS (when all 3 numbers in line are present)
    'Spiritual Arrow (Determination)': [4, 9, 2], // top row
    'Mental Arrow (Intellect)': [3, 5, 7], // middle row
    'Practical Arrow (Action)': [8, 1, 6], // bottom row
    'Planner Arrow (Thinker)': [4, 3, 8], // left column
    'Will Arrow (Memory)': [9, 5, 1], // middle column
    'Emotional Arrow (Sensitivity)': [2, 7, 6], // right column
    'Prosperity Arrow': [4, 5, 6], // top-left to bottom-right diagonal
    'Compassion Arrow': [2, 5, 8], // top-right to bottom-left diagonal
  };
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  for (const [arrowName, numbers] of Object.entries(ARROWS)) {
    const allPresent = numbers.every((n) => counts[n] > 0);
    const allMissing = numbers.every((n) => counts[n] === 0);
    
    if (allPresent) {
      strengths.push(arrowName);
    } else if (allMissing) {
      weaknesses.push(arrowName.replace(/Arrow/, 'Arrow (Missing)'));
    }
  }
  
  // Build interpretation
  let interpretation = '';
  if (strengths.length > 0) {
    interpretation += `Strong in: ${strengths.join(', ')}. `;
  }
  if (weaknesses.length > 0) {
    interpretation += `Areas to develop: ${weaknesses.join(', ')}. `;
  }
  if (missingNumbers.length > 0) {
    interpretation += `Missing numbers (life lessons): ${missingNumbers.join(', ')}.`;
  }
  
  return {
    grid,
    presentNumbers,
    missingNumbers,
    arrows: { strengths, weaknesses },
    interpretation: interpretation.trim(),
  };
}

// ============================================================================
// 8 & 9. PERSONAL YEAR + PERSONAL DAY
// ============================================================================

export function calculatePersonalYear(birthDate: string, targetYear: number): number {
  const [_, month, day] = birthDate.split('-').map((s) => parseInt(s, 10));
  const total = sumDigits(targetYear) + sumDigits(month) + sumDigits(day);
  return reduceToSingleDigit(total);
}

export function calculatePersonalDay(birthDate: string, targetDate: string): number {
  const [_, month, day] = birthDate.split('-').map((s) => parseInt(s, 10));
  const [ty, tm, td] = targetDate.split('-').map((s) => parseInt(s, 10));
  const total = sumDigits(ty) + sumDigits(tm) + sumDigits(td) + sumDigits(month) + sumDigits(day);
  return reduceToSingleDigit(total);
}

export function calculatePersonalMonth(personalYear: number, currentMonth: number): number {
  return reduceToSingleDigit(personalYear + currentMonth);
}

// ============================================================================
// 10 & 11. KARMIC DEBT & MASTER NUMBERS detection
// ============================================================================

const KARMIC_DEBTS = [13, 14, 16, 19];
const MASTER_NUMBERS = [11, 22, 33];

export function detectKarmicDebts(birthDate: string, fullName: string): number[] {
  const debts = new Set<number>();
  
  const [year, month, day] = birthDate.split('-').map((s) => parseInt(s, 10));
  const totalRaw = sumDigits(year) + sumDigits(month) + sumDigits(day);
  
  // Check intermediate sum
  if (KARMIC_DEBTS.includes(totalRaw)) debts.add(totalRaw);
  
  // Check name number raw
  const cleaned = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const nameRaw = cleaned.split('').reduce((s, ch) => s + (CHALDEAN_MAP[ch] || 0), 0);
  let temp = nameRaw;
  while (temp > 9) {
    if (KARMIC_DEBTS.includes(temp)) debts.add(temp);
    temp = sumDigits(temp);
  }
  
  return Array.from(debts).sort((a, b) => a - b);
}

export function detectMasterNumbers(birthDate: string): number[] {
  const masters = new Set<number>();
  
  const [year, month, day] = birthDate.split('-').map((s) => parseInt(s, 10));
  
  // Check day
  if (MASTER_NUMBERS.includes(day)) masters.add(day);
  
  // Check sum of full date (Bhagyank without reduction)
  const totalRaw = sumDigits(year) + sumDigits(month) + sumDigits(day);
  if (MASTER_NUMBERS.includes(totalRaw)) masters.add(totalRaw);
  
  return Array.from(masters).sort((a, b) => a - b);
}

// ============================================================================
// NUMBER METADATA — Traits, Lucky Attributes, Compatibility
// ============================================================================

interface NumberMetadata {
  rulingPlanet: string;
  deity: string;
  personalityTraits: string[];
  strengths: string[];
  weaknesses: string[];
  career: string[];
  luckyColors: string[];
  luckyDays: string[];
  luckyGemstone: string;
  compatibleNumbers: number[];
  neutralNumbers: number[];
  challengingNumbers: number[];
  avoidColors: string[];
  avoidDays: string[];
}

const NUMBER_META: Record<number, NumberMetadata> = {
  1: {
    rulingPlanet: 'Sun (Surya)',
    deity: 'Lord Surya / Lord Shiva',
    personalityTraits: ['Leader', 'Independent', 'Original', 'Ambitious', 'Self-confident'],
    strengths: ['Natural authority', 'Pioneer spirit', 'Creative initiative', 'Strong willpower'],
    weaknesses: ['Stubbornness', 'Ego issues', 'Impatience', 'Domineering tendencies'],
    career: ['Entrepreneurship', 'Politics', 'Leadership roles', 'Innovation', 'Self-employment'],
    luckyColors: ['Gold', 'Orange', 'Royal Yellow'],
    luckyDays: ['Sunday', 'Monday'],
    luckyGemstone: 'Ruby (Manik)',
    compatibleNumbers: [1, 2, 4, 7],
    neutralNumbers: [3, 5, 6],
    challengingNumbers: [8, 9],
    avoidColors: ['Black', 'Dark Blue'],
    avoidDays: ['Saturday'],
  },
  2: {
    rulingPlanet: 'Moon (Chandra)',
    deity: 'Goddess Lakshmi / Lord Chandra',
    personalityTraits: ['Diplomatic', 'Cooperative', 'Sensitive', 'Intuitive', 'Peaceful'],
    strengths: ['Excellent mediator', 'Strong empathy', 'Patient', 'Loyal partner'],
    weaknesses: ['Indecisive', 'Over-sensitive', 'Mood swings', 'Dependency issues'],
    career: ['Counseling', 'Diplomacy', 'Healing arts', 'Hospitality', 'Teaching'],
    luckyColors: ['White', 'Silver', 'Cream', 'Light Green'],
    luckyDays: ['Monday', 'Friday'],
    luckyGemstone: 'Pearl (Moti)',
    compatibleNumbers: [1, 2, 7, 9],
    neutralNumbers: [3, 4, 6],
    challengingNumbers: [5, 8],
    avoidColors: ['Red', 'Black'],
    avoidDays: ['Tuesday'],
  },
  3: {
    rulingPlanet: 'Jupiter (Brihaspati / Guru)',
    deity: 'Lord Brahma / Lord Ganesh',
    personalityTraits: ['Optimistic', 'Expressive', 'Creative', 'Sociable', 'Wise'],
    strengths: ['Great communicator', 'Teacher at heart', 'Optimistic outlook', 'Spiritually inclined'],
    weaknesses: ['Scattered focus', 'Over-talkative', 'Exaggeration', 'Pride'],
    career: ['Teaching', 'Writing', 'Law', 'Religion', 'Advisory roles', 'Finance'],
    luckyColors: ['Yellow', 'Gold', 'Orange'],
    luckyDays: ['Thursday', 'Friday'],
    luckyGemstone: 'Yellow Sapphire (Pukhraj)',
    compatibleNumbers: [3, 6, 9],
    neutralNumbers: [1, 2, 5, 7],
    challengingNumbers: [4, 8],
    avoidColors: ['Black', 'Blue'],
    avoidDays: ['Saturday'],
  },
  4: {
    rulingPlanet: 'Rahu (North Node)',
    deity: 'Goddess Durga',
    personalityTraits: ['Practical', 'Disciplined', 'Hardworking', 'Unconventional', 'Loyal'],
    strengths: ['Strong foundation builder', 'Innovative thinking', 'Reliable', 'Pragmatic'],
    weaknesses: ['Rigid', 'Stubborn', 'Sudden mood shifts', 'Prone to controversy'],
    career: ['Engineering', 'Construction', 'Research', 'Technology', 'Government'],
    luckyColors: ['Blue', 'Grey', 'Brown'],
    luckyDays: ['Sunday', 'Monday', 'Saturday'],
    luckyGemstone: 'Hessonite (Gomed)',
    compatibleNumbers: [1, 5, 7, 8],
    neutralNumbers: [2, 4, 6],
    challengingNumbers: [3, 9],
    avoidColors: ['Red'],
    avoidDays: ['Tuesday'],
  },
  5: {
    rulingPlanet: 'Mercury (Budha)',
    deity: 'Lord Vishnu / Lord Ganesh',
    personalityTraits: ['Adaptable', 'Curious', 'Restless', 'Witty', 'Energetic'],
    strengths: ['Quick learner', 'Excellent communicator', 'Versatile', 'Charming'],
    weaknesses: ['Impulsive', 'Indecisive', 'Inconsistent', 'Easily distracted'],
    career: ['Sales', 'Marketing', 'Travel', 'Journalism', 'Trading', 'Tech'],
    luckyColors: ['Green', 'White', 'Light shades'],
    luckyDays: ['Wednesday', 'Friday'],
    luckyGemstone: 'Emerald (Panna)',
    compatibleNumbers: [1, 4, 5, 6, 8],
    neutralNumbers: [3, 7, 9],
    challengingNumbers: [2],
    avoidColors: ['Red', 'Black'],
    avoidDays: ['Sunday', 'Monday'],
  },
  6: {
    rulingPlanet: 'Venus (Shukra)',
    deity: 'Goddess Lakshmi / Goddess Saraswati',
    personalityTraits: ['Loving', 'Artistic', 'Harmonious', 'Family-oriented', 'Romantic'],
    strengths: ['Beauty appreciation', 'Excellent host', 'Loyal partner', 'Nurturing nature'],
    weaknesses: ['Pleasure-seeking', 'Over-indulgent', 'Possessive', 'Materialistic'],
    career: ['Arts', 'Beauty', 'Fashion', 'Hospitality', 'Cinema', 'Luxury goods'],
    luckyColors: ['White', 'Pink', 'Light Blue', 'Pastel shades'],
    luckyDays: ['Friday', 'Wednesday'],
    luckyGemstone: 'Diamond (Heera)',
    compatibleNumbers: [3, 6, 9],
    neutralNumbers: [1, 2, 5, 8],
    challengingNumbers: [4, 7],
    avoidColors: ['Black', 'Brown'],
    avoidDays: ['Sunday'],
  },
  7: {
    rulingPlanet: 'Ketu (South Node)',
    deity: 'Lord Ganesh / Lord Shiva',
    personalityTraits: ['Mystical', 'Analytical', 'Introspective', 'Spiritual', 'Solitary'],
    strengths: ['Deep thinker', 'Research-oriented', 'Spiritual seeker', 'Independent'],
    weaknesses: ['Aloof', 'Pessimistic', 'Secretive', 'Difficult relationships'],
    career: ['Spirituality', 'Research', 'Philosophy', 'Astrology', 'Psychology', 'Writing'],
    luckyColors: ['Light Grey', 'Light Yellow', 'White'],
    luckyDays: ['Monday', 'Sunday'],
    luckyGemstone: "Cat's Eye (Lehsunia)",
    compatibleNumbers: [1, 2, 4, 7],
    neutralNumbers: [3, 5, 8],
    challengingNumbers: [6, 9],
    avoidColors: ['Red', 'Dark Blue'],
    avoidDays: ['Tuesday'],
  },
  8: {
    rulingPlanet: 'Saturn (Shani)',
    deity: 'Lord Shani / Lord Hanuman',
    personalityTraits: ['Ambitious', 'Authoritative', 'Karmic', 'Patient', 'Materialistic'],
    strengths: ['Strong willpower', 'Strategic thinker', 'Achievement-oriented', 'Resilient'],
    weaknesses: ['Workaholic tendency', 'Cold demeanor', 'Late success', 'Heavy karma'],
    career: ['Business', 'Real estate', 'Mining', 'Law', 'Politics', 'Heavy industry'],
    luckyColors: ['Black', 'Blue', 'Brown', 'Dark shades'],
    luckyDays: ['Saturday', 'Sunday'],
    luckyGemstone: 'Blue Sapphire (Neelam) — wear with caution',
    compatibleNumbers: [4, 5, 8],
    neutralNumbers: [1, 6, 7],
    challengingNumbers: [2, 3, 9],
    avoidColors: ['Bright Red', 'White'],
    avoidDays: ['Tuesday'],
  },
  9: {
    rulingPlanet: 'Mars (Mangal)',
    deity: 'Lord Hanuman / Lord Kartikeya',
    personalityTraits: ['Courageous', 'Energetic', 'Compassionate', 'Idealistic', 'Determined'],
    strengths: ['Natural fighter', 'Humanitarian', 'Strong willpower', 'Passionate'],
    weaknesses: ['Aggressive', 'Impulsive', 'Argumentative', 'Restless'],
    career: ['Military', 'Sports', 'Surgery', 'Athletics', 'Activism', 'Engineering'],
    luckyColors: ['Red', 'Crimson', 'Maroon'],
    luckyDays: ['Tuesday', 'Friday'],
    luckyGemstone: 'Red Coral (Moonga)',
    compatibleNumbers: [3, 6, 9],
    neutralNumbers: [2, 5, 7],
    challengingNumbers: [1, 4, 8],
    avoidColors: ['Black'],
    avoidDays: ['Saturday'],
  },
};

// Get metadata for a number (handles master numbers by reducing)
function getMeta(num: number): NumberMetadata {
  let n = num;
  if (n === 11) n = 2;
  if (n === 22) n = 4;
  if (n === 33) n = 6;
  return NUMBER_META[n] || NUMBER_META[1];
}

// ============================================================================
// MASTER FUNCTION — Generate complete numerology report
// ============================================================================

export function generateNumerologyReport(input: NumerologyInput): NumerologyReport {
  const mulank = calculateMulank(input.date);
  const bhagyank = calculateBhagyank(input.date, true);
  const naamank = calculateNaamank(input.fullName);
  const soulNumber = calculateSoulNumber(input.fullName);
  const personalityNumber = calculatePersonalityNumber(input.fullName);
  
  const karmicDebts = detectKarmicDebts(input.date, input.fullName);
  const masterNumbers = detectMasterNumbers(input.date);
  
  const kuaData = calculateKuaNumber(input.date, input.gender);
  
  // Use reduced bhagyank for grid (in case of master number)
  const bhagyankForGrid = bhagyank > 9 ? reduceToSingleDigit(bhagyank) : bhagyank;
  const loShuGrid = calculateLoShuGrid(input.date, mulank, bhagyankForGrid);
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const personalYear = calculatePersonalYear(input.date, today.getFullYear());
  const personalDay = calculatePersonalDay(input.date, todayStr);
  const personalMonth = calculatePersonalMonth(personalYear, today.getMonth() + 1);
  
  // Use Mulank as primary identifier for traits (most influential in Vedic system)
  const meta = getMeta(mulank);
  
  // Combine lucky numbers from Mulank + Bhagyank + Naamank
  const luckyNumbers = Array.from(
    new Set([mulank, bhagyankForGrid, naamank, ...meta.compatibleNumbers])
  ).sort((a, b) => a - b);
  
  return {
    mulank,
    bhagyank,
    naamank,
    soulNumber,
    personalityNumber,
    
    isMasterMulank: MASTER_NUMBERS.includes(mulank),
    isMasterBhagyank: MASTER_NUMBERS.includes(bhagyank),
    karmicDebts,
    masterNumbers,
    
    kua: kuaData.kua,
    kuaGroup: kuaData.group,
    luckyDirections: kuaData.luckyDirections,
    unluckyDirections: kuaData.unluckyDirections,
    
    loShuGrid,
    
    personalYear,
    personalDay,
    personalMonth,
    
    personalityTraits: meta.personalityTraits,
    strengths: meta.strengths,
    weaknesses: meta.weaknesses,
    career: meta.career,
    
    luckyNumbers,
    luckyColors: meta.luckyColors,
    luckyDays: meta.luckyDays,
    luckyGemstone: meta.luckyGemstone,
    rulingPlanet: meta.rulingPlanet,
    deity: meta.deity,
    
    compatibleNumbers: meta.compatibleNumbers,
    neutralNumbers: meta.neutralNumbers,
    challengingNumbers: meta.challengingNumbers,
    
    avoidNumbers: meta.challengingNumbers,
    avoidColors: meta.avoidColors,
    avoidDays: meta.avoidDays,
  };
}

// ============================================================================
// COMPATIBILITY — Combine two numerology reports for matrimonial/partnership
// ============================================================================

function rateNumberMatch(a: number, b: number): { score: number; verdict: string } {
  // Reduce master numbers for comparison
  const reduce = (n: number) => (n > 9 ? sumDigits(n) : n);
  const x = reduce(a);
  const y = reduce(b);
  
  const metaX = getMeta(x);
  
  if (metaX.compatibleNumbers.includes(y)) return { score: 10, verdict: 'Excellent' };
  if (metaX.neutralNumbers.includes(y)) return { score: 6, verdict: 'Neutral' };
  if (metaX.challengingNumbers.includes(y)) return { score: 2, verdict: 'Challenging' };
  return { score: 5, verdict: 'Average' };
}

export function calculateNumerologyCompatibility(
  personA: NumerologyReport,
  personB: NumerologyReport
): CompatibilityResult {
  const mulankMatch = rateNumberMatch(personA.mulank, personB.mulank);
  const bhagyankMatch = rateNumberMatch(personA.bhagyank, personB.bhagyank);
  const naamankMatch = rateNumberMatch(personA.naamank, personB.naamank);
  
  const kuaMatch = {
    compatible: personA.kuaGroup === personB.kuaGroup,
    verdict:
      personA.kuaGroup === personB.kuaGroup
        ? `Both in ${personA.kuaGroup} group — direction-compatible per Feng Shui`
        : `Different groups (${personA.kuaGroup} vs ${personB.kuaGroup}) — direction harmony needs adjustment`,
  };
  
  // Lo Shu Grid synergy: count complementary fills
  // A's missing numbers that B has, and vice versa
  const aMissing = new Set(personA.loShuGrid.missingNumbers);
  const bMissing = new Set(personB.loShuGrid.missingNumbers);
  const aHas = new Set(personA.loShuGrid.presentNumbers);
  const bHas = new Set(personB.loShuGrid.presentNumbers);
  
  const aFillsB = [...bMissing].filter((n) => aHas.has(n));
  const bFillsA = [...aMissing].filter((n) => bHas.has(n));
  
  const complementary = Array.from(new Set([...aFillsB, ...bFillsA])).sort();
  const loShuSynergyScore = Math.min(15, complementary.length * 3);
  
  // Overall numerology score out of 25
  // Mulank: 10 points (most weight — primary personality)
  // Bhagyank: 7 points
  // Naamank: 5 points
  // Kua: 3 points
  // (Lo Shu synergy contributes separately to DRISHTI Score's 15-point Lo Shu component)
  let overall = 0;
  overall += mulankMatch.score; // 0-10
  overall += Math.round(bhagyankMatch.score * 0.7); // 0-7
  overall += Math.round(naamankMatch.score * 0.5); // 0-5
  overall += kuaMatch.compatible ? 3 : 1; // 1-3
  overall = Math.min(25, overall);
  
  let verdict: string;
  if (overall >= 20) verdict = 'Excellent numerological match — strong vibrational harmony';
  else if (overall >= 15) verdict = 'Good match — minor adjustments will strengthen the bond';
  else if (overall >= 10) verdict = 'Average match — work on shared values and communication';
  else verdict = 'Challenging match — requires deliberate effort and remedial guidance';
  
  return {
    mulankMatch,
    bhagyankMatch,
    naamankMatch,
    kuaMatch,
    loShuGridSynergy: {
      score: loShuSynergyScore,
      complementary,
    },
    overallNumerologyScore: overall,
    verdict,
  };
}

// ============================================================================
// QUICK ACCESS — Single-call wrapper for API routes
// ============================================================================

export function quickNumerology(
  fullName: string,
  birthDate: string,
  gender: 'male' | 'female' = 'male'
): NumerologyReport {
  return generateNumerologyReport({ fullName, date: birthDate, gender });
}
