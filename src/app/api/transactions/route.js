import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const type = searchParams.get('type') || undefined;

    const transactions = await DataStore.getAllTransactions({ category, type });
    return NextResponse.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, amount, type, category, date, notes } = body;

    if (!title || !amount || !type || !category) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await DataStore.addTransaction({ title, amount, type, category, date, notes });
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
