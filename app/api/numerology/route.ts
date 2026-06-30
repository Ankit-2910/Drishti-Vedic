import { NextRequest, NextResponse } from 'next/server';
import { quickNumerology } from '@/lib/numerology';

export const runtime = 'nodejs';
export const maxDuration = 10;

interface NumerologyRequest {
  fullName: string;
  birthDate: string;
  gender?: 'male' | 'female';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NumerologyRequest;
    
    if (!body.fullName || !body.birthDate) {
      return NextResponse.json(
        { error: 'fullName and birthDate are required' },
        { status: 400 }
      );
    }
    
    const report = quickNumerology(
      body.fullName,
      body.birthDate,
      body.gender || 'male'
    );
    
    return NextResponse.json(report);
  } catch (err) {
    console.error('[/api/numerology] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
