'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AIChatWidget } from '@/components/AIChatWidget';
import { TransactionModal } from '@/components/TransactionModal';
import { Sparkles, Lightbulb } from 'lucide-react';

export default function AdvisorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl flex items-center gap-3">
              AI Financial <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Advisor</span>
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Ask questions about your spending patterns, get automatic overspending diagnoses, and receive optimized budget plans.
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
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-extrabold text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Featured AI Capabilities
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="font-bold text-indigo-400 block mb-1">🔍 Overspending Detection</span>
                  Ask <em>"Where am I overspending?"</em> to analyze budget cap breaches and top category cost drivers.
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="font-bold text-purple-400 block mb-1">🎯 Automated Budget Suggestions</span>
                  Ask <em>"Suggest budget for next month"</em> to get 50/30/20 category recommendations tailored to your velocity.
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="font-bold text-emerald-400 block mb-1">⚡ Auto MoM Insights</span>
                  Detects month-over-month variances automatically (e.g. <em>"You spent 30% more on food"</em>).
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
