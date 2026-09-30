import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';

export async function GET() {
  try {
    const transactions = await DataStore.getAllTransactions();

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryBreakdown = {};
    const monthlyTrend = {};

    transactions.forEach((t) => {
      const amt = Number(t.amount);
      const dateObj = new Date(t.date);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyTrend[monthKey]) {
        monthlyTrend[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        totalIncome += amt;
        monthlyTrend[monthKey].income += amt;
      } else {
        totalExpense += amt;
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + amt;
        monthlyTrend[monthKey].expense += amt;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Number(((netSavings / totalIncome) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate,
        categoryBreakdown,
        monthlyTrend,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
