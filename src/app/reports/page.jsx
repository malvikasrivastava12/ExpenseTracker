'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { fetchMonthlyReport } from '@/lib/api';
import { TransactionModal } from '@/components/TransactionModal';
import { Printer, Sparkles, Calendar, TrendingUp, ShieldAlert, Award } from 'lucide-react';

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
    <div className="min-h-screen bg-[#080C14] text-slate-100 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="glow-blob top-10 right-10 w-96 h-96 bg-indigo-600/15 print:hidden" />
      <div className="glow-blob bottom-10 left-10 w-96 h-96 bg-purple-600/15 print:hidden" />

      <div className="print:hidden">
        <Navbar onOpenAddModal={() => setIsModalOpen(true)} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8 print:p-0 print:m-0 print:max-w-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/[0.06] print:hidden">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-outfit">
              Monthly <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Financial Reports</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comprehensive monthly statement summaries with category totals and automated AI diagnostic reviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2.5 rounded-2xl glass-input text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        {report && (
          <div className="space-y-8">
            {/* Executive Statement Header Card */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-950/60 via-purple-950/30 to-slate-900 shadow-2xl print:bg-white print:text-black print:border-black">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10 print:border-slate-300">
                <div>
                  <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                    Official Statement Period
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-outfit print:text-black">
                    {report.monthName}
                  </h2>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-right print:bg-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Recorded Volume</span>
                  <span className="text-xl font-black text-indigo-300 font-outfit print:text-indigo-900">{report.transactionCount} transactions</span>
                </div>
              </div>

              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 print:bg-slate-50 print:border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Income</span>
                  <h3 className="text-3xl font-black text-emerald-400 font-outfit mt-1">
                    ₹{report.financials.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 print:bg-slate-50 print:border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expenses</span>
                  <h3 className="text-3xl font-black text-rose-400 font-outfit mt-1">
                    ₹{report.financials.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 print:bg-slate-50 print:border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Savings</span>
                  <h3 className="text-3xl font-black text-white font-outfit mt-1 print:text-black">
                    ₹{report.financials.netSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 print:bg-slate-50 print:border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Savings Rate</span>
                  <h3 className="text-3xl font-black text-indigo-400 font-outfit mt-1">
                    {report.financials.savingsRate}%
                  </h3>
                </div>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-4 font-outfit">Category Expenditure Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(report.categoryTotals || {}).map(([cat, amt]) => (
                  <div key={cat} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between hover:bg-white/[0.06] transition-colors">
                    <span className="text-sm font-bold text-slate-200">{cat}</span>
                    <span className="text-base font-black text-white font-outfit">₹{amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Diagnosis Insights */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-indigo-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.08]">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white font-outfit">AI Diagnostic Review</h3>
                  <p className="text-xs text-slate-400">Automated financial health audit</p>
                </div>
              </div>

              <div className="space-y-4">
                {report.insights.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 text-sm text-slate-300 space-y-1">
                    <span className="font-extrabold text-white text-base block font-outfit">{item.title}</span>
                    <p className="leading-relaxed text-xs sm:text-sm text-slate-300">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="print:hidden">
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => loadReport(selectedMonth)}
        />
      </div>
    </div>
  );
}

