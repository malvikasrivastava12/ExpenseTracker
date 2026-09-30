import { NextResponse } from 'next/server';
import { AIService } from '@/lib/aiService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, message: 'Prompt parameter is required' }, { status: 400 });
    }

    const response = await AIService.processFinancialQuery(prompt);
    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
