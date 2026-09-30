import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { AIService } from '@/lib/aiService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get('month');
    const targetMonth = monthParam || new Date().toISOString().slice(0, 7);

    const [yearStr, monthStr] = targetMonth.split('-');
    const year = parseInt(yearStr, 10);
    const monthIdx = parseInt(monthStr, 10) - 1;

    const transactions = await DataStore.getAllTransactions();

    const monthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === monthIdx;
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};

    monthTx.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

    let topCategory = 'None';
    let maxCategoryAmt = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > maxCategoryAmt) {
        maxCategoryAmt = amt;
        topCategory = cat;
      }
    });

    const autoInsights = await AIService.generateAutoInsights();

    return NextResponse.json({
      success: true,
      report: {
        month: targetMonth,
        monthName: new Date(year, monthIdx, 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
        transactionCount: monthTx.length,
        financials: {
          totalIncome,
          totalExpense,
          netSavings,
          savingsRate,
          topCategory,
          topCategoryAmount: maxCategoryAmt,
        },
        categoryTotals,
        insights: autoInsights,
        transactions: monthTx,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
