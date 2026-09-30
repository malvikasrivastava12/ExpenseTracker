'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { fetchBudgets, saveBudget } from '@/lib/api';
import { AlertTriangle, CheckCircle, Edit3 } from 'lucide-react';
import { TransactionModal } from '@/components/TransactionModal';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Category <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Budgets</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Set monthly spending caps per category and track your limit compliance in real time.
            </p>
          </div>
        </div>

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => {
            const isExceeded = b.status === 'exceeded';
            const isWarning = b.status === 'warning';

            return (
              <div
                key={b._id || b.category}
                className={`glass-panel rounded-3xl p-6 border relative overflow-hidden flex flex-col justify-between ${
                  isExceeded
                    ? 'border-rose-500/40 bg-rose-950/10'
                    : isWarning
                    ? 'border-amber-500/40 bg-amber-950/10'
                    : 'border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-extrabold text-white">{b.category}</h3>
                    {isExceeded ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Exceeded
                      </span>
                    ) : isWarning ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Near Limit
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> On Track
                      </span>
                    )}
                  </div>

                  {/* Spent vs Limit Stats */}
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-extrabold text-white">
                      ₹{b.spent.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      of ₹{b.monthlyLimit.toLocaleString()} limit
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-white/5 overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400">
                    {b.remaining >= 0 ? (
                      <span className="text-emerald-400 font-semibold">₹{b.remaining.toFixed(0)} remaining</span>
                    ) : (
                      <span className="text-rose-400 font-semibold">₹{Math.abs(b.remaining).toFixed(0)} over budget</span>
                    )}
                  </p>
                </div>

                {/* Edit Budget Limit Form */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  {editingCategory === b.category ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="New limit ₹"
                        value={editLimit}
                        onChange={(e) => setEditLimit(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleSaveBudget(b.category)}
                        className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
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
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors"
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
