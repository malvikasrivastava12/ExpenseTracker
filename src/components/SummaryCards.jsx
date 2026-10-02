'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, PiggyBank, Percent, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Total Income',
      amount: `₹${(summary?.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowUpRight,
      color: 'emerald',
      gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      borderHover: 'hover:border-emerald-500/40',
      glow: 'rgba(16, 185, 129, 0.15)',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10',
      subtitle: 'Monthly Inflow',
      badge: '+Income',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Total Expenses',
      amount: `₹${(summary?.totalExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowDownRight,
      color: 'rose',
      gradient: 'from-rose-500/15 via-rose-500/5 to-transparent',
      borderHover: 'hover:border-rose-500/40',
      glow: 'rgba(244, 63, 94, 0.15)',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/10',
      subtitle: 'Monthly Outflow',
      badge: 'Outflow',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Net Savings',
      amount: `₹${(summary?.netSavings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: PiggyBank,
      color: 'indigo',
      gradient: 'from-indigo-500/15 via-purple-500/5 to-transparent',
      borderHover: 'hover:border-indigo-500/40',
      glow: 'rgba(99, 102, 241, 0.15)',
      iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 shadow-indigo-500/10',
      subtitle: summary?.netSavings >= 0 ? 'Surplus Balance' : 'Deficit Alert',
      badge: summary?.netSavings >= 0 ? 'Positive' : 'Action Req.',
      badgeColor: summary?.netSavings >= 0 ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Savings Rate',
      amount: `${summary?.savingsRate || 0}%`,
      icon: Percent,
      color: 'cyan',
      gradient: 'from-cyan-500/15 via-blue-500/5 to-transparent',
      borderHover: 'hover:border-cyan-500/40',
      glow: 'rgba(6, 182, 212, 0.15)',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10',
      subtitle: summary?.savingsRate >= 20 ? 'Optimal (Goal 20%+)' : 'Needs Attention',
      badge: summary?.savingsRate >= 20 ? 'Healthy' : 'Below Target',
      badgeColor: summary?.savingsRate >= 20 ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`glass-panel rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br ${card.gradient} transition-all duration-300 border border-white/10 ${card.borderHover} shadow-xl group`}
          >
            {/* Background Ambient Glow */}
            <div
              className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500"
              style={{ backgroundColor: card.glow }}
            />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-lg ${card.iconBg} group-hover:rotate-6 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-3xl font-black text-white tracking-tight font-outfit">
                  {card.amount}
                </h2>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {card.subtitle}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

