import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'API key is required' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });
    await openai.models.list();

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Invalid API key' },
      { status: 400 }
    );
  }
}