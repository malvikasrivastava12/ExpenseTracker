'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { fetchMonthlyReport } from '@/lib/api';
import { TransactionModal } from '@/components/TransactionModal';
import { Printer, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadReport = async (monthStr) => {
    setLoading(true);
    try {
      const data = await fetchMonthlyReport(monthStr);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(selectedMonth);
  }, [selectedMonth]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Monthly <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Financial Reports</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Comprehensive monthly summary reports with category totals and AI diagnostic review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {report && (
          <div className="space-y-8">
            {/* Summary Header Card */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-950/40 to-slate-900">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    Statement Period
                  </span>
                  <h2 className="text-3xl font-extrabold text-white mt-1">
                    {report.monthName}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-semibold block">Total Recorded Transactions</span>
                  <span className="text-xl font-bold text-indigo-300">{report.transactionCount} items</span>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-semibold text-slate-400">Total Income</span>
                  <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
                    ₹{report.financials.totalIncome.toFixed(2)}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-semibold text-slate-400">Total Expenses</span>
                  <h3 className="text-2xl font-extrabold text-rose-400 mt-1">
                    ₹{report.financials.totalExpense.toFixed(2)}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-semibold text-slate-400">Net Savings</span>
                  <h3 className="text-2xl font-extrabold text-white mt-1">
                    ₹{report.financials.netSavings.toFixed(2)}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-semibold text-slate-400">Savings Rate</span>
                  <h3 className="text-2xl font-extrabold text-indigo-400 mt-1">
                    {report.financials.savingsRate}%
                  </h3>
                </div>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-extrabold text-white mb-4">Category Expense Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(report.categoryTotals || {}).map(([cat, amt]) => (
                  <div key={cat} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-200">{cat}</span>
                    <span className="text-sm font-extrabold text-white">₹{amt.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Diagnosis Insights */}
            <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-extrabold text-white">AI Diagnostic Review</h3>
              </div>
              <div className="space-y-3">
                {report.insights.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-sm text-slate-300">
                    <span className="font-bold text-white block mb-0.5">{item.title}</span>
                    <p>{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadReport(selectedMonth)}
      />
    </div>
  );
}
