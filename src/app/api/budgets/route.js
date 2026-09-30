import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';

export async function GET() {
  try {
    const budgets = await DataStore.getAllBudgets();
    const transactions = await DataStore.getAllTransactions();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const categorySpent = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (t.type === 'expense' && d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        categorySpent[t.category] = (categorySpent[t.category] || 0) + Number(t.amount);
      }
    });

    const budgetProgress = budgets.map((b) => {
      const spent = categorySpent[b.category] || 0;
      const limit = Number(b.monthlyLimit);
      const remaining = limit - spent;
      const percentage = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
      let status = 'normal';
      if (spent > limit) status = 'exceeded';
      else if (percentage >= 80) status = 'warning';

      return {
        _id: b._id,
        category: b.category,
        monthlyLimit: limit,
        spent,
        remaining,
        percentage,
        status,
      };
    });

    return NextResponse.json({ success: true, count: budgetProgress.length, data: budgetProgress });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, monthlyLimit } = body;

    if (!category || monthlyLimit === undefined) {
      return NextResponse.json(
        { success: false, message: 'Category and monthly limit are required' },
        { status: 400 }
      );
    }

    const updated = await DataStore.upsertBudget(category, monthlyLimit);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
