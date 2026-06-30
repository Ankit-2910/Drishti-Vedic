/**
 * Gemini 2.5 Flash narration — now combines Vedic chart + Numerology.
 * Uses thinkingBudget: 0 (proven fix across Triage/FinePrint/Bidsight).
 */

import type { NumerologyReport } from './numerology';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

interface NarrationInput {
  ascendant: string;
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  currentDasha: { mahadasha: string; antardasha: string; endsOn: string };
  planets: Array<{ name: string; sign: string; house: number; degree: string }>;
  numerology?: NumerologyReport;
  userQuestion?: string;
}

const SYSTEM_PROMPT = `You are DRISHTI, a classical Vedic narrator combining Jyotish (astrology) and Ank Shastra (numerology) in a single, integrated reading.

RULES:
1. NEVER invent positions, dashas, yogas, or numbers not present in the input.
2. Use BOTH astrological data AND numerological data — show how they corroborate or differ.
3. Cite at least one classical scripture per major claim. Allowed: BPHS, Phaladeepika, Saravali, Jataka Parijata, Muhurta Chintamani, Ank Shastra texts.
4. Tone: measured, learned, plain. No flowery prose. No "the stars say..." language.
5. NEVER mention you are an AI or that this is computed.
6. BILINGUAL OUTPUT — produce the reading TWICE:
   - First in English (3 short paragraphs, under 200 words total)
   - Then a line "———"
   - Then the SAME reading in natural Hindi (Devanagari, हिन्दी), under 200 words
   Structure of each: Para 1 astrological character; Para 2 numerological character (Mulank/Bhagyank/Lo Shu); Para 3 current dasha + personal year synthesis.
7. If user has asked a specific question, address it in para 3 of both languages.`;

export async function narrate(input: NarrationInput): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return mockNarration(input);
  }

  const userPrompt = buildUserPrompt(input);

  // Timeout guard: never let a slow/hanging Gemini call crash or stall the route.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(
      `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 900,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!res.ok) {
      console.error('Gemini error:', res.status);
      return mockNarration(input);
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || mockNarration(input);
  } catch (e) {
    // Network error, timeout/abort, malformed response — fall back gracefully.
    console.error('Gemini call failed, using mock narration:', e instanceof Error ? e.message : e);
    return mockNarration(input);
  } finally {
    clearTimeout(timeout);
  }
}

function buildUserPrompt(input: NarrationInput): string {
  const planets = input.planets
    .map((p) => `  ${p.name}: ${p.sign}, House ${p.house} (${p.degree})`)
    .join('\n');

  let numerologySection = '';
  if (input.numerology) {
    const n = input.numerology;
    numerologySection = `
NUMEROLOGY:
- Mulank (Driver): ${n.mulank} (ruled by ${n.rulingPlanet})
- Bhagyank (Destiny): ${n.bhagyank}
- Naamank (Name): ${n.naamank}
- Soul Number: ${n.soulNumber}
- Personality Number: ${n.personalityNumber}
- Kua Number: ${n.kua} (${n.kuaGroup} group)
- Personal Year: ${n.personalYear}
- Lo Shu Grid present: [${n.loShuGrid.presentNumbers.join(', ')}]
- Lo Shu Grid missing: [${n.loShuGrid.missingNumbers.join(', ')}]
- Lo Shu Arrows of Strength: ${n.loShuGrid.arrows.strengths.join(', ') || 'none'}
- Lo Shu Arrows of Weakness: ${n.loShuGrid.arrows.weaknesses.join(', ') || 'none'}
${n.karmicDebts.length > 0 ? `- Karmic Debt numbers: ${n.karmicDebts.join(', ')}` : ''}
${n.masterNumbers.length > 0 ? `- Master numbers present: ${n.masterNumbers.join(', ')}` : ''}
`;
  }

  return `ASTROLOGY:
- Ascendant: ${input.ascendant}
- Moon sign: ${input.moonSign}
- Sun sign: ${input.sunSign}
- Nakshatra: ${input.nakshatra}
- Current Mahadasha: ${input.currentDasha.mahadasha}
- Current Antardasha: ${input.currentDasha.antardasha}
- Antardasha ends: ${input.currentDasha.endsOn}
- Planetary positions:
${planets}
${numerologySection}
${input.userQuestion ? `\nUser question: ${input.userQuestion}` : ''}

Now write the DRISHTI narration following all rules — integrating astrology AND numerology.`;
}

function mockNarration(input: NarrationInput): string {
  const numStr = input.numerology
    ? ` The Mulank of ${input.numerology.mulank} (ruled by ${input.numerology.rulingPlanet}) reinforces this temperament — bringing the qualities of ${input.numerology.personalityTraits.slice(0, 2).join(' and ').toLowerCase()} into expression. The Bhagyank ${input.numerology.bhagyank} indicates a destiny path centred on ${input.numerology.career[0].toLowerCase()} or allied vocations (Ank Shastra principles).`
    : '';

  const personalYearStr = input.numerology
    ? ` In numerological terms, the current personal year is ${input.numerology.personalYear} — ${input.numerology.personalYear <= 3 ? 'a building cycle, suited to laying foundations rather than harvesting' : input.numerology.personalYear <= 6 ? 'a cycle of harmonising and consolidating' : 'a closing cycle, ideal for completion and reflection'}.`
    : '';

  return `With ${input.ascendant} rising and the Moon in ${input.moonSign}, the chart shows a temperament that combines outward initiative with inner reflection. The Sun's placement in ${input.sunSign} reinforces a sense of identity built through deliberate, considered action — a signature noted in BPHS Ch.34 for ascendants of this rashi.${numStr}

The ${input.currentDasha.mahadasha}–${input.currentDasha.antardasha} period currently active (ending ${input.currentDasha.endsOn}) is a transitional phase, classically associated with consolidation rather than expansion (Phaladeepika 7.12).${personalYearStr} Together, the chart and the numerological cycle point to a window for completing existing commitments and preparing the ground — not for launching new ventures of consequence.

———

${input.ascendant} लग्न और ${input.moonSign} में चंद्रमा के साथ, यह कुंडली एक ऐसा स्वभाव दर्शाती है जो बाहरी पहल और आंतरिक चिंतन का मेल है। ${input.sunSign} में सूर्य की स्थिति सोच-समझकर किए गए कर्म से बनी पहचान को सुदृढ़ करती है (बृहत् पाराशर होरा शास्त्र अध्याय 34)।${input.numerology ? ` मूलांक ${input.numerology.mulank} (${input.numerology.rulingPlanet}) इस स्वभाव को और पुष्ट करता है, तथा भाग्यांक ${input.numerology.bhagyank} जीवन-पथ की दिशा संकेत करता है।` : ''}

वर्तमान ${input.currentDasha.mahadasha}–${input.currentDasha.antardasha} दशा (${input.currentDasha.endsOn} तक) एक संक्रमणकालीन अवधि है, जो विस्तार के बजाय एकीकरण से जुड़ी है (फलदीपिका 7.12)। कुल मिलाकर, यह समय वर्तमान दायित्वों को पूर्ण करने और नींव तैयार करने का है — किसी बड़े नए उपक्रम के आरंभ का नहीं।`;
}
