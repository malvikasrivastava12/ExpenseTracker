'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import {
  ArrowRight,
  PlusCircle,
  ReceiptText,
  PieChart,
  TrendingUp,
  Sparkles,
  Utensils,
  Home,
  ShoppingBag,
  Car,
  Zap,
  Film,
  Briefcase,
  Wallet,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return Utensils;
  if (cat.includes('house') || cat.includes('rent') || cat.includes('housing')) return Home;
  if (cat.includes('shop')) return ShoppingBag;
  if (cat.includes('transport') || cat.includes('travel')) return Car;
  if (cat.includes('utilit') || cat.includes('bill')) return Zap;
  if (cat.includes('entertain') || cat.includes('movie')) return Film;
  if (cat.includes('salary') || cat.includes('pay')) return Briefcase;
  if (cat.includes('freelance') || cat.includes('business')) return Wallet;
  return HelpCircle;
};

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
    <div className="min-h-screen bg-[#080C14] relative overflow-hidden text-slate-100">
      {/* Background Ambient Glow Blobs */}
      <div className="glow-blob top-10 left-10 w-96 h-96 bg-indigo-600/20" />
      <div className="glow-blob top-96 right-10 w-96 h-96 bg-purple-600/15" />
      <div className="glow-blob bottom-10 left-1/3 w-96 h-96 bg-emerald-600/10" />

      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Financial Control Center
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-outfit">
              Financial <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Overview</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track real-life cashflow, analyze category expenditure velocity, and leverage AI diagnostic recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-shimmer flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-indigo-200" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Dynamic Auto-Insights Banner */}
        {insights.length > 0 && <AutoInsightsBanner insights={insights} />}

        {/* Summary Stats Cards */}
        {summary && <SummaryCards summary={summary} />}

        {/* Analytics Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Spending Donut */}
          <div className="glass-panel glass-panel-interactive rounded-3xl p-6 border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-lg font-black text-white font-outfit">Category Spending</h3>
                <p className="text-xs text-slate-400">Expenditure share breakdown</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            {summary && <CategoryDonut data={summary.categoryBreakdown} />}
          </div>

          {/* Monthly Trend Bar Chart */}
          <div className="glass-panel glass-panel-interactive rounded-3xl p-6 border border-white/10 lg:col-span-2 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-lg font-black text-white font-outfit">Income vs Expenses</h3>
                <p className="text-xs text-slate-400">Monthly cashflow trend comparison</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Income
                </span>
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Expense
                </span>
              </div>
            </div>
            {summary && <MonthlyBar data={summary.monthlyTrend} />}
          </div>
        </div>

        {/* Bottom Section: Recent Transactions + Embedded AI Assistant Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Transactions (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <ReceiptText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-outfit">Recent Activity</h3>
                    <p className="text-xs text-slate-400">Latest recorded income & expenses</p>
                  </div>
                </div>
                <Link
                  href="/transactions"
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentTx.map((tx) => {
                  const CategoryIcon = getCategoryIcon(tx.category);
                  const isIncome = tx.type === 'income';
                  return (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] transition-all border border-white/[0.05] hover:border-white/[0.12] group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-md transition-transform group-hover:scale-105 ${
                            isIncome
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10'
                              : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-indigo-500/10'
                          }`}
                        >
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {tx.title}
                          </h4>
                          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="font-semibold text-slate-300">{tx.category}</span>
                            <span>•</span>
                            <span>{new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-base font-black font-outfit tracking-tight ${
                            isIncome ? 'text-emerald-400' : 'text-slate-100'
                          }`}
                        >
                          {isIncome ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {tx.type}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {recentTx.length === 0 && (
                  <div className="py-14 text-center text-slate-500 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center">
                      <ReceiptText className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-xs font-semibold">No transactions recorded yet.</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Click here to add your first transaction
                    </button>
                  </div>
                )}
              </div>
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

