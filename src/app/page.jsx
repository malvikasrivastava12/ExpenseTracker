'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SummaryCards } from '@/components/SummaryCards';
import { AutoInsightsBanner } from '@/components/AutoInsightsBanner';
import { CategoryDonut } from '@/components/Charts/CategoryDonut';
import { MonthlyBar } from '@/components/Charts/MonthlyBar';
import { TransactionModal } from '@/components/TransactionModal';
import { AIChatWidget } from '@/components/AIChatWidget';
import {
  fetchSummary,
  fetchAutoInsights,
  fetchTransactions,
} from '@/lib/api';
import { ArrowRight, PlusCircle, ReceiptText, PieChart } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [sumRes, insRes, txRes] = await Promise.all([
        fetchSummary(),
        fetchAutoInsights(),
        fetchTransactions(),
      ]);
      setSummary(sumRes);
      setInsights(insRes);
      setRecentTx(txRes.slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Financial <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Overview</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track real-life income, expenses, category spending & AI budget recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Dynamic Auto-Insights Banner */}
        {insights.length > 0 && <AutoInsightsBanner insights={insights} />}

        {/* Summary Stats Cards */}
        {summary && <SummaryCards summary={summary} />}

        {/* Analytics Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Category Spending Donut */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white">Category Spending</h3>
                <p className="text-xs text-slate-400">Expense breakdown by category</p>
              </div>
              <PieChart className="w-5 h-5 text-indigo-400" />
            </div>
            {summary && <CategoryDonut data={summary.categoryBreakdown} />}
          </div>

          {/* Monthly Trend Bar Chart */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white">Income vs Expenses</h3>
                <p className="text-xs text-slate-400">Monthly financial comparison</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
                </span>
                <span className="flex items-center gap-1 text-xs text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
                </span>
              </div>
            </div>
            {summary && <MonthlyBar data={summary.monthlyTrend} />}
          </div>
        </div>

        {/* Bottom Section: Recent Transactions + AI Assistant Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Transactions (8 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-extrabold text-white">Recent Transactions</h3>
              </div>
              <Link
                href="/transactions"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentTx.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{tx.title}</h4>
                      <p className="text-xs text-slate-400">
                        {tx.category} • {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-extrabold ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}

              {recentTx.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No transactions recorded yet. Click "Add Transaction" to start!
                </div>
              )}
            </div>
          </div>

          {/* Embedded AI Advisor Assistant (5 cols) */}
          <div className="lg:col-span-5">
            <AIChatWidget />
          </div>
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
