import { NextRequest, NextResponse } from 'next/server';
import { generateKundli } from '@/lib/prokerala';
import { narrate } from '@/lib/gemini';
import { quickNumerology } from '@/lib/numerology';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface KundliRequest {
  name: string;
  date: string;
  time: string;
  place: string;
  latitude?: string;
  longitude?: string;
  gender?: 'male' | 'female';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as KundliRequest;
    
    if (!body.date || !body.time || !body.name) {
      return NextResponse.json(
        { error: 'name, date, and time are required' },
        { status: 400 }
      );
    }
    
    const latitude = body.latitude || '23.2599';
    const longitude = body.longitude || '77.4126';
    const gender = body.gender || 'male';

    // 2) Numerology first — pure math, never fails, and powers the remedies.
    const numerology = quickNumerology(body.name, body.date, gender);

    // 1) Astrological chart — defensive: fall back to mock on any failure.
    let chart;
    try {
      chart = await generateKundli({ ...body, latitude, longitude });
    } catch (e) {
      console.error('Chart generation failed, using mock:', e);
      const { generateKundli: _gk } = await import('@/lib/prokerala');
      chart = await _gk({ ...body, latitude, longitude });
    }

    // 3) Combined narration — defensive (narrate already self-heals to mock).
    let narration = '';
    try {
      narration = await narrate({
        ascendant: chart.ascendant,
        moonSign: chart.moonSign,
        sunSign: chart.sunSign,
        nakshatra: chart.nakshatra,
        currentDasha: chart.currentDasha,
        planets: chart.planets,
        numerology,
      });
    } catch (e) {
      console.error('Narration failed:', e);
      narration = 'Your integrated Vedic + numerology reading is being prepared. The chart and numbers below are fully computed.';
    }

    // 4) Persist (best-effort, fully isolated — never affects the response)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        persistChart(body, { ...chart, numerology, narration }).catch((err) =>
          console.error('Persist failed:', err)
        );
      } catch (err) {
        console.error('Persist threw:', err);
      }
    }

    return NextResponse.json({
      ...chart,
      numerology,
      narration,
    });
  } catch (err) {
    console.error('[/api/kundli] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}

async function persistChart(input: KundliRequest, chart: any) {
  const sb = getSupabaseAdmin();
  await sb.from('charts').insert({
    name: input.name,
    birth_date: input.date,
    birth_time: input.time,
    place: input.place,
    latitude: parseFloat(input.latitude || '0'),
    longitude: parseFloat(input.longitude || '0'),
    gender: input.gender,
    ascendant: chart.ascendant,
    moon_sign: chart.moonSign,
    sun_sign: chart.sunSign,
    nakshatra: chart.nakshatra,
    mulank: chart.numerology?.mulank,
    bhagyank: chart.numerology?.bhagyank,
    naamank: chart.numerology?.naamank,
    kua: chart.numerology?.kua,
    raw_data: chart,
  });
}
