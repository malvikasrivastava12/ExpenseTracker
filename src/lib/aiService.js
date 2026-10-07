import { DataStore } from './store';
import OpenAI from 'openai';

export const AIService = {
  /**
   * Generates dynamic automated financial insights based on real user data
   */
  async generateAutoInsights() {
    const transactions = await DataStore.getAllTransactions();
    const budgets = await DataStore.getAllBudgets();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Current month transactions
    const currTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    // Previous month transactions
    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === prevMonthDate.getFullYear() && d.getMonth() === prevMonthDate.getMonth();
    });

    const insights = [];

    // Helper: calculate category totals
    const getCategoryTotals = (txList) => {
      const totals = {};
      let totalExpense = 0;
      let totalIncome = 0;
      txList.forEach((t) => {
        if (t.type === 'expense') {
          totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
          totalExpense += Number(t.amount);
        } else if (t.type === 'income') {
          totalIncome += Number(t.amount);
        }
      });
      return { totals, totalExpense, totalIncome };
    };

    const currData = getCategoryTotals(currTx);
    const prevData = getCategoryTotals(prevTx);

    // 1. Month-over-Month Category Variance Check
    Object.keys(currData.totals).forEach((cat) => {
      const currAmt = currData.totals[cat];
      const prevAmt = prevData.totals[cat];
      if (prevAmt && prevAmt > 0) {
        const pctDiff = Math.round(((currAmt - prevAmt) / prevAmt) * 100);
        if (pctDiff >= 15) {
          insights.push({
            id: `mom-increase-${cat}`,
            type: 'warning',
            category: cat,
            title: `MoM Spending Increase`,
            message: `You spent ${pctDiff}% more on ${cat} (₹${currAmt.toFixed(0)}) compared to last month (₹${prevAmt.toFixed(0)}).`,
            stat: `+${pctDiff}%`,
          });
        } else if (pctDiff <= -15) {
          insights.push({
            id: `mom-decrease-${cat}`,
            type: 'success',
            category: cat,
            title: `Smart Savings Detected`,
            message: `Great job! You cut ${cat} spending by ${Math.abs(pctDiff)}% compared to last month.`,
            stat: `${pctDiff}%`,
          });
        }
      }
    });

    // 2. Budget Overrun & Near-Limit Check
    budgets.forEach((b) => {
      const spent = currData.totals[b.category] || 0;
      const limit = Number(b.monthlyLimit);
      if (limit > 0) {
        const usagePct = Math.round((spent / limit) * 100);
        if (spent > limit) {
          const over = spent - limit;
          insights.push({
            id: `budget-exceeded-${b.category}`,
            type: 'danger',
            category: b.category,
            title: `Budget Exceeded`,
            message: `You have overspent your ${b.category} budget by ₹${over.toFixed(0)} (${usagePct}% of limit).`,
            stat: `${usagePct}%`,
          });
        } else if (usagePct >= 80) {
          insights.push({
            id: `budget-warning-${b.category}`,
            type: 'warning',
            category: b.category,
            title: `Near Budget Limit`,
            message: `You've used ${usagePct}% of your ₹${limit} budget for ${b.category}. ₹${(limit - spent).toFixed(0)} remaining.`,
            stat: `${usagePct}%`,
          });
        }
      }
    });

    // 3. Highest Spending Category Share
    if (currData.totalExpense > 0) {
      let topCat = '';
      let topAmt = 0;
      Object.entries(currData.totals).forEach(([cat, amt]) => {
        if (amt > topAmt) {
          topAmt = amt;
          topCat = cat;
        }
      });
      if (topCat) {
        const sharePct = Math.round((topAmt / currData.totalExpense) * 100);
        insights.push({
          id: `top-category`,
          type: 'info',
          category: topCat,
          title: `Dominant Category`,
          message: `${topCat} makes up ${sharePct}% (₹${topAmt.toFixed(0)}) of your total expenses this month.`,
          stat: `${sharePct}%`,
        });
      }
    }

    // 4. Savings Rate Insight
    if (currData.totalIncome > 0) {
      const netSavings = currData.totalIncome - currData.totalExpense;
      const savingsRate = Math.round((netSavings / currData.totalIncome) * 100);
      if (savingsRate >= 20) {
        insights.push({
          id: `savings-rate-good`,
          type: 'success',
          category: 'Savings',
          title: `Healthy Savings Rate`,
          message: `Your current savings rate is ${savingsRate}% (₹${netSavings.toFixed(0)} saved). Target is 20%+. Keep it up!`,
          stat: `${savingsRate}%`,
        });
      } else if (savingsRate < 10) {
        insights.push({
          id: `savings-rate-low`,
          type: 'warning',
          category: 'Savings',
          title: `Low Savings Alert`,
          message: `Your savings rate is only ${savingsRate}%. Consider reviewing discretionary expenses like Shopping & Dining out.`,
          stat: `${savingsRate}%`,
        });
      }
    }

    // Fallback if brand new data
    if (insights.length === 0) {
      insights.push({
        id: 'default-welcome',
        type: 'info',
        category: 'General',
        title: 'AI Advisor Active',
        message: 'Add more transactions to unlock automated monthly trends, overspending alerts, and budget suggestions!',
        stat: '100%',
      });
    }

    return insights;
  },

  /**
   * Financial Advisor AI Chat Handler (OpenAI + Fallback)
   */
  async processFinancialQuery(userPrompt) {
    const transactions = await DataStore.getAllTransactions();
    const budgets = await DataStore.getAllBudgets();
    const autoInsights = await this.generateAutoInsights();

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};

    transactions.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + amt;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

    // Check if OpenAI API Key is provided
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("[API KEY] 123", apiKey);
    if (apiKey && apiKey.trim() !== '') {
      console.log("[API KEY]", apiKey);
      try {
        console.log('[OpenAI] Sending query to OpenAI Chat Completion API...');
        const openai = new OpenAI({ apiKey });
        const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

        const categoryBreakdownText = Object.entries(categoryExpenses)
          .map(([cat, amt]) => `- ${cat}: ₹${amt.toFixed(0)}`)
          .join('\n');

        const budgetStatusText = budgets
          .map((b) => {
            const spent = categoryExpenses[b.category] || 0;
            const limit = b.monthlyLimit;
            const over = spent > limit ? spent - limit : 0;
            return `- ${b.category}: Limit ₹${limit}, Spent ₹${spent.toFixed(0)}${over > 0 ? ` (OVER BUDGET by ₹${over.toFixed(0)})` : ''}`;
          })
          .join('\n');

        const insightsText = autoInsights
          .map((i) => `- [${i.type.toUpperCase()}] ${i.title}: ${i.message}`)
          .join('\n');

        const systemPrompt = `You are SpendWise AI, an expert personal financial advisor and spending analyst AI.
You are helping the user manage their finances, budgets, and savings.
Currency is Indian Rupee (₹). ALWAYS format money figures using the '₹' symbol.

Here is the user's current LIVE financial dataset:
- Total Monthly Income: ₹${totalIncome.toFixed(2)}
- Total Monthly Expenses: ₹${totalExpense.toFixed(2)}
- Net Monthly Savings: ₹${netSavings.toFixed(2)}
- Current Savings Rate: ${savingsRate}% (Target is 20%+)

Category Expenses Breakdown:
${categoryBreakdownText || 'No expenses recorded'}

Category Budget Compliance:
${budgetStatusText || 'No budget caps set'}

Active Automated AI Insights:
${insightsText || 'None'}

Instructions:
1. Provide concise, friendly, and practical financial advice tailored specifically to the user's live data above.
2. Structure your response clearly using markdown (bolding, lists, emojis, bullet points).
3. If asking for budget recommendations or overspending analysis, provide clear actionable numbers in ₹.
4. Keep the tone professional, motivating, and clear.`;

        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
        });

        const reply = completion.choices[0]?.message?.content;
        if (reply) {
          return {
            reply,
            provider: 'openai',
            model,
            actionableInsights: autoInsights.filter((i) => i.type === 'danger' || i.type === 'warning'),
          };
        }
      } catch (error) {
        console.warn('[OpenAI Warning] OpenAI API call failed or key invalid:', error.message);
        console.warn('[OpenAI Info] Falling back to smart built-in financial analyzer.');
      }
    }

    // Built-in Smart Analyzer Fallback
    const lowerPrompt = userPrompt.toLowerCase();

    // 1. Prompt: "Where am I overspending?"
    if (
      lowerPrompt.includes('overspending') ||
      lowerPrompt.includes('where am i spending') ||
      lowerPrompt.includes('too much')
    ) {
      const overBudgets = [];
      budgets.forEach((b) => {
        const spent = categoryExpenses[b.category] || 0;
        if (spent > b.monthlyLimit) {
          overBudgets.push({
            category: b.category,
            spent,
            limit: b.monthlyLimit,
            over: spent - b.monthlyLimit,
          });
        }
      });

      const sortedCats = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1]);

      let reply = `### 📊 AI Overspending Analysis\n\n`;

      if (overBudgets.length > 0) {
        reply += `⚠️ **Over-budget Categories Detected:**\n`;
        overBudgets.forEach((item) => {
          reply += `- **${item.category}**: Spent **₹${item.spent.toFixed(0)}** against a limit of **₹${item.limit}** (₹${item.over.toFixed(0)} over budget).\n`;
        });
        reply += `\n`;
      } else {
        reply += `✅ **Budget Compliance:** None of your tracked categories have breached their budget caps yet!\n\n`;
      }

      if (sortedCats.length > 0) {
        reply += `💡 **Top Expense Drivers:**\n`;
        sortedCats.slice(0, 3).forEach(([cat, amt]) => {
          const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(0) : '0';
          reply += `- **${cat}**: ₹${amt.toFixed(0)} (${pct}% of total spending)\n`;
        });
      }

      reply += `\n**Recommendation:** Focus on curbing non-essential spending in top categories like *${sortedCats[0] ? sortedCats[0][0] : 'Shopping'}* to boost your net savings rate (currently **${savingsRate}%**).`;

      return {
        reply,
        provider: 'built-in',
        actionableInsights: autoInsights.filter((i) => i.type === 'danger' || i.type === 'warning'),
      };
    }

    // 2. Prompt: "Suggest budget for next month"
    if (
      lowerPrompt.includes('suggest budget') ||
      lowerPrompt.includes('next month budget') ||
      lowerPrompt.includes('budget plan')
    ) {
      let reply = `### 🎯 Smart AI Budget Recommendations for Next Month\n\nBased on your historical spending velocity and 50/30/20 financial rule, here is your tailored monthly allocation:\n\n`;

      const suggestedBudgets = [];
      const defaultCategories = ['Housing', 'Food & Dining', 'Utilities', 'Shopping', 'Transportation', 'Entertainment'];

      defaultCategories.forEach((cat) => {
        const pastSpent = categoryExpenses[cat] || 150;
        let suggested = pastSpent;
        if (['Food & Dining', 'Shopping', 'Entertainment'].includes(cat)) {
          suggested = Math.round(pastSpent * 0.9);
        } else {
          suggested = Math.round(pastSpent * 1.05);
        }
        suggestedBudgets.push({ category: cat, currentSpent: pastSpent, suggestedBudget: suggested });
        reply += `- **${cat}**: Suggested Limit **₹${suggested}** *(Past spend: ₹${pastSpent.toFixed(0)})*\n`;
      });

      reply += `\n✨ **Savings Target:** If you stick to this budget, you will save approximately **₹${Math.round(totalIncome * 0.25)}/month** (${25}% savings goal).`;

      return {
        reply,
        provider: 'built-in',
        suggestedBudgets,
      };
    }

    // 3. General queries
    let reply = `### 💡 AI Financial Advisor Summary\n\n`;
    reply += `Here is your current financial snapshot:\n`;
    reply += `- **Total Income:** ₹${totalIncome.toFixed(2)}\n`;
    reply += `- **Total Expenses:** ₹${totalExpense.toFixed(2)}\n`;
    reply += `- **Net Savings:** ₹${netSavings.toFixed(2)} (Savings Rate: **${savingsRate}%**)\n\n`;

    if (autoInsights.length > 0) {
      reply += `**Top Actionable Observation:**\n> "${autoInsights[0].message}"\n\n`;
    }

    reply += `Feel free to ask me:\n- *"Where am I overspending?"*\n- *"Suggest budget for next month"*`;

    return { reply, provider: 'built-in' };
  },
};
