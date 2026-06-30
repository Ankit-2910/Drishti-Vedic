/**
 * DRISHTI VEDIC — Unified 100-Point Compatibility Score
 * 
 * The DRISHTI Score is unique to this platform. No other Vedic service in India
 * combines astrological + numerological compatibility into a single, weighted metric.
 * 
 * BREAKDOWN:
 *   50 points → Astrology (Ashtakoot 36-guna scaled to 50)
 *   25 points → Numerology (Mulank + Bhagyank + Naamank + Kua)
 *   15 points → Lo Shu Grid mutual completion
 *   10 points → Dosha adjustments (Manglik, Nadi, Bhakoot cancellations)
 *  ───────────
 *  100 points → DRISHTI SCORE
 * 
 * The score is calibrated so that:
 *   85-100 → Exceptional match (rare, highly recommended)
 *   70-84  → Excellent match (recommended)
 *   55-69  → Good match (recommended with awareness)
 *   40-54  → Average match (requires remedies + discussion)
 *   25-39  → Challenging (consult expert pandit before proceeding)
 *   0-24   → Not recommended (significant doshas + low harmony)
 */

import {
  generateNumerologyReport,
  calculateNumerologyCompatibility,
  type NumerologyReport,
  type CompatibilityResult,
} from './numerology';

// ============================================================================
// TYPES
// ============================================================================

export interface PersonInput {
  fullName: string;
  birthDate: string;       // YYYY-MM-DD
  birthTime: string;       // HH:MM
  birthPlace: string;
  latitude: string;
  longitude: string;
  gender: 'male' | 'female';
}

export interface AshtakootScore {
  varna: { score: number; max: 1 };
  vashya: { score: number; max: 2 };
  tara: { score: number; max: 3 };
  yoni: { score: number; max: 4 };
  grahaMaitri: { score: number; max: 5 };
  gana: { score: number; max: 6 };
  bhakoot: { score: number; max: 7 };
  nadi: { score: number; max: 8 };
  total: number;     // out of 36
  max: 36;
}

export interface DoshaStatus {
  manglik: { 
    person1: boolean; 
    person2: boolean; 
    cancellation: string | null;
  };
  nadi: { 
    same: boolean; 
    cancellation: string | null;
  };
  bhakoot: { 
    affected: boolean; 
    cancellation: string | null;
  };
}

export interface DrishtiScoreResult {
  // The headline number
  drishtiScore: number;            // 0-100
  drishtiPercentage: number;       // 0-100% (same value, presented differently)
  verdict: string;
  band: 'Exceptional' | 'Excellent' | 'Good' | 'Average' | 'Challenging' | 'Not Recommended';
  bandColor: string;
  
  // Component breakdown (for transparency)
  components: {
    astrologyPoints: number;       // 0-50
    numerologyPoints: number;      // 0-25
    loShuGridPoints: number;       // 0-15
    doshaPoints: number;           // 0-10
  };
  
  // Underlying data
  astrology: {
    ashtakoot: AshtakootScore;
    doshas: DoshaStatus;
  };
  
  numerology: {
    person1: NumerologyReport;
    person2: NumerologyReport;
    compatibility: CompatibilityResult;
  };
  
  // Actionable insights
  strengths: string[];          // What's great about this match
  challenges: string[];         // Areas to be mindful of
  remedies: string[];           // Suggested remedies for challenges
  recommendations: string[];    // Concrete next-steps
  
  // Compatibility-specific guidance
  shubhMuhurta: {
    hasGoodWindow: boolean;
    suggestedMonths: string[];
    note: string;
  };
}

// ============================================================================
// ASHTAKOOT (36-Guna) COMPUTATION
// 
// In production this comes from Prokerala API. Mock version provided for
// development & demos. The mock is deterministic — same input = same output.
// ============================================================================

function mockAshtakoot(personA: PersonInput, personB: PersonInput): AshtakootScore {
  // Deterministic seed from inputs
  const seed = 
    personA.birthDate.charCodeAt(0) + 
    personB.birthDate.charCodeAt(0) + 
    personA.fullName.length + 
    personB.fullName.length;
  
  // Generate plausible but consistent values
  const r = (max: number, offset: number) => ((seed + offset) % (max + 1));
  
  const varna = Math.min(1, r(1, 0));
  const vashya = Math.min(2, r(2, 3));
  const tara = Math.min(3, r(3, 7));
  const yoni = Math.min(4, r(4, 11));
  const grahaMaitri = Math.min(5, r(5, 17));
  const gana = Math.min(6, r(6, 23));
  const bhakoot = Math.min(7, r(7, 31));
  const nadi = Math.min(8, r(8, 41));
  
  const total = varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi;
  
  return {
    varna: { score: varna, max: 1 },
    vashya: { score: vashya, max: 2 },
    tara: { score: tara, max: 3 },
    yoni: { score: yoni, max: 4 },
    grahaMaitri: { score: grahaMaitri, max: 5 },
    gana: { score: gana, max: 6 },
    bhakoot: { score: bhakoot, max: 7 },
    nadi: { score: nadi, max: 8 },
    total,
    max: 36,
  };
}

function mockDoshas(personA: PersonInput, personB: PersonInput): DoshaStatus {
  const seedA = personA.birthDate.charCodeAt(8) % 5;
  const seedB = personB.birthDate.charCodeAt(8) % 5;
  
  // ~20% chance of Manglik per person in mock
  const aMan = seedA === 0;
  const bMan = seedB === 0;
  
  return {
    manglik: {
      person1: aMan,
      person2: bMan,
      cancellation:
        aMan && bMan
          ? 'Both partners Manglik — dosha is mutually cancelled per BPHS Ch.80'
          : aMan || bMan
          ? null
          : 'No Manglik dosha present',
    },
    nadi: {
      same: false,
      cancellation: 'Different Nadis — no Nadi Dosha',
    },
    bhakoot: {
      affected: false,
      cancellation: 'Bhakoot Dosha not significantly active',
    },
  };
}

// ============================================================================
// DRISHTI SCORE — MAIN CALCULATION
// ============================================================================

export function calculateDrishtiScore(
  personA: PersonInput,
  personB: PersonInput
): DrishtiScoreResult {
  // ---------------------------------------------------------------------
  // 1. ASTROLOGY COMPONENT (50 points)
  // ---------------------------------------------------------------------
  const ashtakoot = mockAshtakoot(personA, personB);
  const doshas = mockDoshas(personA, personB);
  
  // Scale 36-guna to 50 points
  const astrologyPoints = Math.round((ashtakoot.total / 36) * 50);
  
  // ---------------------------------------------------------------------
  // 2. NUMEROLOGY COMPONENT (25 points)
  // ---------------------------------------------------------------------
  const numA = generateNumerologyReport({
    fullName: personA.fullName,
    date: personA.birthDate,
    gender: personA.gender,
  });
  
  const numB = generateNumerologyReport({
    fullName: personB.fullName,
    date: personB.birthDate,
    gender: personB.gender,
  });
  
  const numCompat = calculateNumerologyCompatibility(numA, numB);
  const numerologyPoints = numCompat.overallNumerologyScore; // already 0-25
  
  // ---------------------------------------------------------------------
  // 3. LO SHU GRID COMPONENT (15 points)
  // ---------------------------------------------------------------------
  // How well does each person fill the other's missing numbers?
  // numCompat.loShuGridSynergy.score is already 0-15
  const loShuGridPoints = numCompat.loShuGridSynergy.score;
  
  // ---------------------------------------------------------------------
  // 4. DOSHA ADJUSTMENTS (10 points)
  // ---------------------------------------------------------------------
  // Start at 10, deduct for unresolved doshas
  let doshaPoints = 10;
  
  // Manglik
  if (doshas.manglik.person1 !== doshas.manglik.person2 && !doshas.manglik.cancellation) {
    doshaPoints -= 5; // Asymmetric Manglik — significant
  }
  
  // Nadi
  if (doshas.nadi.same && !doshas.nadi.cancellation) {
    doshaPoints -= 3;
  }
  
  // Bhakoot
  if (doshas.bhakoot.affected && !doshas.bhakoot.cancellation) {
    doshaPoints -= 2;
  }
  
  doshaPoints = Math.max(0, doshaPoints);
  
  // ---------------------------------------------------------------------
  // 5. FINAL DRISHTI SCORE
  // ---------------------------------------------------------------------
  const drishtiScore = astrologyPoints + numerologyPoints + loShuGridPoints + doshaPoints;
  
  // ---------------------------------------------------------------------
  // 6. VERDICT BAND
  // ---------------------------------------------------------------------
  let band: DrishtiScoreResult['band'];
  let verdict: string;
  let bandColor: string;
  
  if (drishtiScore >= 85) {
    band = 'Exceptional';
    verdict = 'A rare, exceptionally aligned match. Both astrological and numerological vibrations are in deep harmony. Recommended without reservation.';
    bandColor = '#10b981'; // emerald
  } else if (drishtiScore >= 70) {
    band = 'Excellent';
    verdict = 'A strong, well-balanced match across both Vedic systems. Highly recommended for marriage with confidence.';
    bandColor = '#22c55e'; // green
  } else if (drishtiScore >= 55) {
    band = 'Good';
    verdict = 'A good match with most factors aligned. Awareness of minor differences will strengthen the bond.';
    bandColor = '#f59e0b'; // gold
  } else if (drishtiScore >= 40) {
    band = 'Average';
    verdict = 'An average match — workable but requires deliberate effort, shared values, and remedies for highlighted challenges.';
    bandColor = '#fb923c'; // orange
  } else if (drishtiScore >= 25) {
    band = 'Challenging';
    verdict = 'Significant challenges across multiple parameters. Strong recommendation to consult an experienced pandit before proceeding.';
    bandColor = '#ef4444'; // red
  } else {
    band = 'Not Recommended';
    verdict = 'Multiple factors indicate this match would face substantial difficulties. Not recommended in current configuration.';
    bandColor = '#dc2626'; // dark red
  }
  
  // ---------------------------------------------------------------------
  // 7. STRENGTHS & CHALLENGES
  // ---------------------------------------------------------------------
  const strengths: string[] = [];
  const challenges: string[] = [];
  const remedies: string[] = [];
  const recommendations: string[] = [];
  
  // Astrology strengths/challenges
  if (ashtakoot.total >= 28) {
    strengths.push(`Ashtakoot ${ashtakoot.total}/36 — strong astrological foundation`);
  } else if (ashtakoot.total < 18) {
    challenges.push(`Ashtakoot ${ashtakoot.total}/36 — below threshold for natural compatibility`);
    remedies.push('Consult a qualified pandit for chart-specific remedies (mantras, gemstones, charity)');
  }
  
  if (ashtakoot.nadi.score === ashtakoot.nadi.max) {
    strengths.push('Nadi koota perfect — strong genetic + health compatibility');
  }
  if (ashtakoot.gana.score >= 5) {
    strengths.push('Gana koota strong — nature and temperament aligned');
  }
  
  // Numerology strengths
  if (numCompat.mulankMatch.verdict === 'Excellent') {
    strengths.push(`Mulank ${numA.mulank}–${numB.mulank}: excellent personality compatibility`);
  }
  if (numCompat.bhagyankMatch.verdict === 'Excellent') {
    strengths.push(`Bhagyank ${numA.bhagyank}–${numB.bhagyank}: life paths well-aligned`);
  }
  if (numCompat.kuaMatch.compatible) {
    strengths.push(`Both in ${numA.kuaGroup} Kua group — directional Feng Shui harmony`);
  }
  
  if (numCompat.mulankMatch.verdict === 'Challenging') {
    challenges.push(`Mulank ${numA.mulank}–${numB.mulank}: personalities may clash on day-to-day matters`);
    remedies.push(`Practice ${numA.luckyColors[0]} & ${numB.luckyColors[0]} colors in shared spaces to balance energies`);
  }
  
  // Lo Shu grid insights
  if (numCompat.loShuGridSynergy.complementary.length >= 3) {
    strengths.push(
      `Lo Shu Grid synergy: you complement each other in ${numCompat.loShuGridSynergy.complementary.length} life areas (numbers ${numCompat.loShuGridSynergy.complementary.join(', ')})`
    );
  }
  
  // Manglik handling
  if (doshas.manglik.person1 && doshas.manglik.person2 && doshas.manglik.cancellation) {
    strengths.push('Both Manglik — dosha is mutually cancelled (a recognized Vedic exception)');
  } else if (doshas.manglik.person1 !== doshas.manglik.person2 && !doshas.manglik.cancellation) {
    challenges.push('Asymmetric Manglik Dosha present');
    remedies.push('Perform Kumbh Vivah or Vishnu Vivah ritual before marriage to neutralize Mars affliction');
    remedies.push('Tuesday fasting and Hanuman Chalisa recitation by both partners');
  }
  
  // Karmic debts
  if (numA.karmicDebts.length > 0) {
    challenges.push(`Person 1 carries karmic debt number(s): ${numA.karmicDebts.join(', ')}`);
    remedies.push('Karmic debt remedy: charitable donations on Mulank-corresponding days');
  }
  if (numB.karmicDebts.length > 0) {
    challenges.push(`Person 2 carries karmic debt number(s): ${numB.karmicDebts.join(', ')}`);
  }
  
  // Master numbers boost
  if (numA.masterNumbers.length > 0 || numB.masterNumbers.length > 0) {
    strengths.push(
      `Master number(s) present (${[...numA.masterNumbers, ...numB.masterNumbers].join(', ')}) — high spiritual potential in this union`
    );
  }
  
  // Recommendations
  if (drishtiScore >= 55) {
    recommendations.push('Proceed with confidence — proceed to family meetings and marriage discussions');
    recommendations.push('Choose a wedding muhurta when both Mulank days align (next available window analyzed separately)');
  } else if (drishtiScore >= 40) {
    recommendations.push('Have a detailed conversation about the highlighted challenges before committing');
    recommendations.push('Consult a senior Vedic astrologer for personalized chart reading');
    recommendations.push('Consider performing recommended remedies BEFORE marriage, not after');
  } else {
    recommendations.push('Pause and reflect — do not commit based on partial information');
    recommendations.push('Mandatory expert consultation before any decision');
    recommendations.push('Consider alternative matches if family flexibility allows');
  }
  
  // Always recommend
  recommendations.push(
    `Wear lucky gemstones: Person 1 → ${numA.luckyGemstone}, Person 2 → ${numB.luckyGemstone} (consult pandit before wearing)`
  );
  
  // ---------------------------------------------------------------------
  // 8. SHUBH MUHURTA HINT
  // ---------------------------------------------------------------------
  // Simplified mock — real version uses Panchang API
  const personalYearMatch = numA.personalYear === numB.personalYear || 
    [1, 5, 9].includes(numA.personalYear);
  
  const shubhMuhurta = {
    hasGoodWindow: personalYearMatch,
    suggestedMonths: personalYearMatch 
      ? ['Margashirsh (Nov-Dec)', 'Phalgun (Feb-Mar)', 'Vaishakh (Apr-May)'] 
      : ['Wait for next personal year cycle'],
    note: personalYearMatch
      ? 'Current personal year cycles align well for wedding ceremonies'
      : 'Current personal years not aligned — wait 6-12 months OR perform pre-wedding rituals to harmonize',
  };
  
  // ---------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------
  return {
    drishtiScore,
    drishtiPercentage: drishtiScore,
    verdict,
    band,
    bandColor,
    
    components: {
      astrologyPoints,
      numerologyPoints,
      loShuGridPoints,
      doshaPoints,
    },
    
    astrology: {
      ashtakoot,
      doshas,
    },
    
    numerology: {
      person1: numA,
      person2: numB,
      compatibility: numCompat,
    },
    
    strengths,
    challenges,
    remedies,
    recommendations,
    
    shubhMuhurta,
  };
}
