'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { fetchBudgets, saveBudget, fetchAutoInsights } from '@/lib/api';
import {
  AlertTriangle,
  CheckCircle,
  Edit3,
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
import { TransactionModal } from '@/components/TransactionModal';

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

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiApplying, setAiApplying] = useState(false);

  const loadBudgets = async () => {
    try {
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleSaveBudget = async (category) => {
    if (!editLimit || isNaN(Number(editLimit))) return;
    await saveBudget(category, Number(editLimit));
    setEditingCategory(null);
    setEditLimit('');
    loadBudgets();
  };

  const handleAutoSuggestBudgets = async () => {
    setAiApplying(true);
    try {
      // Standard AI default allocation targets for standard categories
      const aiSuggestions = {
        'Food & Dining': 12000,
        Housing: 25000,
        Shopping: 8000,
        Transportation: 6000,
        Utilities: 5000,
        Entertainment: 4000,
      };

      for (const [category, limit] of Object.entries(aiSuggestions)) {
        await saveBudget(category, limit);
      }
      await loadBudgets();
    } catch (err) {
      console.error(err);
    } finally {
      setAiApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="glow-blob top-20 left-10 w-96 h-96 bg-indigo-600/15" />
      <div className="glow-blob bottom-20 right-10 w-96 h-96 bg-purple-600/15" />

      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/[0.06]">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-outfit">
              Category <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Budgets</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Set monthly spending caps per category and monitor your budget compliance in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAutoSuggestBudgets}
              disabled={aiApplying}
              className="btn-shimmer flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-600/25 border border-purple-400/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
              <span>{aiApplying ? 'Applying AI Budgets...' : '✨ Apply AI Smart Caps'}</span>
            </button>
          </div>
        </div>

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => {
            const isExceeded = b.status === 'exceeded';
            const isWarning = b.status === 'warning';
            const CategoryIcon = getCategoryIcon(b.category);

            return (
              <div
                key={b._id || b.category}
                className={`glass-panel glass-panel-interactive rounded-3xl p-6 border relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300 ${
                  isExceeded
                    ? 'border-rose-500/40 bg-rose-950/15'
                    : isWarning
                    ? 'border-amber-500/40 bg-amber-950/15'
                    : 'border-white/10 hover:border-indigo-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                        isExceeded ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : isWarning ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                      }`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-white font-outfit">{b.category}</h3>
                    </div>

                    {isExceeded ? (
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[11px] font-black uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
                        <AlertTriangle className="w-3.5 h-3.5" /> Exceeded
                      </span>
                    ) : isWarning ? (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-black uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                        <AlertTriangle className="w-3.5 h-3.5" /> Near Limit
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5" /> On Track
                      </span>
                    )}
                  </div>

                  {/* Spent vs Limit Stats */}
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-black text-white font-outfit">
                      ₹{b.spent.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      of ₹{b.monthlyLimit.toLocaleString()} cap
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-950 border border-white/10 overflow-hidden mb-3 relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 shadow-md ${
                        isExceeded
                          ? 'bg-gradient-to-r from-rose-600 to-red-500'
                          : isWarning
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-400'
                          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">{b.percentage.toFixed(0)}% used</span>
                    <span>
                      {b.remaining >= 0 ? (
                        <span className="text-emerald-400 font-bold">₹{b.remaining.toFixed(0)} remaining</span>
                      ) : (
                        <span className="text-rose-400 font-bold">₹{Math.abs(b.remaining).toFixed(0)} over budget</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Edit Budget Limit Form */}
                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  {editingCategory === b.category ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="New limit ₹"
                        value={editLimit}
                        onChange={(e) => setEditLimit(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                      />
                      <button
                        onClick={() => handleSaveBudget(b.category)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white transition-colors shrink-0"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingCategory(b.category);
                        setEditLimit(b.monthlyLimit.toString());
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-extrabold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Monthly Limit</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadBudgets}
      />
    </div>
  );
}

