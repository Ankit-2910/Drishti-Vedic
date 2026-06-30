import { NextRequest, NextResponse } from 'next/server';
import { calculateDrishtiScore, type PersonInput } from '@/lib/drishti-score';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface DrishtiScoreRequest {
  person1: PersonInput;
  person2: PersonInput;
}

export async function POST(req: NextRequest) {
  try {
    const { person1, person2 } = (await req.json()) as DrishtiScoreRequest;
    
    if (!person1 || !person2) {
      return NextResponse.json(
        { error: 'person1 and person2 are required' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const required = ['fullName', 'birthDate', 'birthTime', 'gender'];
    for (const field of required) {
      if (!(person1 as any)[field] || !(person2 as any)[field]) {
        return NextResponse.json(
          { error: `Both persons need: ${required.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    // Default coordinates if blank
    person1.latitude = person1.latitude || '23.2599';
    person1.longitude = person1.longitude || '77.4126';
    person2.latitude = person2.latitude || '23.2599';
    person2.longitude = person2.longitude || '77.4126';
    person1.birthPlace = person1.birthPlace || 'India';
    person2.birthPlace = person2.birthPlace || 'India';
    
    const result = calculateDrishtiScore(person1, person2);
    
    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/drishti-score] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
