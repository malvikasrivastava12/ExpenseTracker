import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';

export async function DELETE(request, { params }) {
  try {
    const deleted = await DataStore.deleteTransaction(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
