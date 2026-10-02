'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AIChatWidget } from '@/components/AIChatWidget';
import { TransactionModal } from '@/components/TransactionModal';
import { Sparkles, Lightbulb, ShieldCheck, Zap, TrendingUp, Target } from 'lucide-react';

export default function AdvisorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="glow-blob top-10 left-10 w-96 h-96 bg-indigo-600/15" />
      <div className="glow-blob bottom-10 right-10 w-96 h-96 bg-purple-600/15" />

      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                AI Personal Finance Co-Pilot
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-outfit flex items-center gap-3">
              AI Financial <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Advisor</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Ask questions about your real spending habits, run overspending diagnoses, and generate optimized monthly budgets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main AI Chat Assistant (7 cols) */}
          <div className="lg:col-span-7">
            <AIChatWidget />
          </div>

          {/* AI Advisor Guide & Capability Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Financial Health Score Gauge Card */}
            <div className="glass-panel glass-panel-interactive rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-outfit">Financial Health Score</h3>
                    <p className="text-[11px] text-slate-400">Calculated by AI Advisor</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                  OPTIMAL (85/100)
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">Savings Target Status</span>
                  <span className="text-sm font-black text-white font-outfit">On Track (Goal: 20%+)</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-xs text-slate-400 font-semibold block">Budget Compliance</span>
                  <span className="text-sm font-black text-indigo-300 font-outfit">83% Compliant</span>
                </div>
              </div>
            </div>

            {/* Featured Capabilities List */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white font-outfit flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Featured AI Capabilities
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-2 font-black text-indigo-400 mb-1 font-outfit">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span>Overspending Detection</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ask <em>"Where am I overspending?"</em> to analyze budget cap breaches and top category cost drivers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-2 font-black text-purple-400 mb-1 font-outfit">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span>Automated Budget Allocation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ask <em>"Suggest budget for next month"</em> to get 50/30/20 category recommendations tailored to your velocity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-2 font-black text-emerald-400 mb-1 font-outfit">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Month-over-Month Variance</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Detects month-over-month variances automatically (e.g. <em>"You spent 30% more on food"</em>).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}

