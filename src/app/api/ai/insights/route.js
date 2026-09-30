import { NextResponse } from 'next/server';
import { AIService } from '@/lib/aiService';

export async function GET() {
  try {
    const insights = await AIService.generateAutoInsights();
    return NextResponse.json({ success: true, count: insights.length, data: insights });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
