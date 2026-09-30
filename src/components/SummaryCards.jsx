'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, PiggyBank, Percent } from 'lucide-react';

export const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Total Income',
      amount: `₹${(summary?.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowUpRight,
      color: 'emerald',
      gradient: 'from-emerald-500/20 to-teal-500/5',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      subtitle: 'This month income',
    },
    {
      title: 'Total Expenses',
      amount: `₹${(summary?.totalExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowDownRight,
      color: 'rose',
      gradient: 'from-rose-500/20 to-pink-500/5',
      iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      subtitle: 'This month spending',
    },
    {
      title: 'Net Savings',
      amount: `₹${(summary?.netSavings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: PiggyBank,
      color: 'indigo',
      gradient: 'from-indigo-500/20 to-purple-500/5',
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      subtitle: summary?.netSavings >= 0 ? 'Positive balance' : 'Negative balance',
    },
    {
      title: 'Savings Rate',
      amount: `${summary?.savingsRate || 0}%`,
      icon: Percent,
      color: 'cyan',
      gradient: 'from-cyan-500/20 to-blue-500/5',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      subtitle: 'Target: 20%+',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br ${card.gradient}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {card.amount}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
