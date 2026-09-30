import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'SpendWise AI Expense Tracker Next.js Unified App & API',
    timestamp: new Date(),
  });
}
