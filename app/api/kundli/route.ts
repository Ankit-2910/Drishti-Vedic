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
    
    // 1) Astrological chart
    const chart = await generateKundli({
      ...body,
      latitude,
      longitude,
    });
    
    // 2) Numerology report (instant, no API)
    const numerology = quickNumerology(body.name, body.date, gender);
    
    // 3) Combined Gemini narration
    const narration = await narrate({
      ascendant: chart.ascendant,
      moonSign: chart.moonSign,
      sunSign: chart.sunSign,
      nakshatra: chart.nakshatra,
      currentDasha: chart.currentDasha,
      planets: chart.planets,
      numerology,
    });
    
    // 4) Persist (best-effort)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      persistChart(body, { ...chart, numerology, narration }).catch((err) =>
        console.error('Persist failed:', err)
      );
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
