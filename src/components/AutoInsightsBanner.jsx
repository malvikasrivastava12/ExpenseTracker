'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, TrendingUp, CheckCircle, ArrowRight, Zap } from 'lucide-react';

export const AutoInsightsBanner = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  const mainInsight = insights[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full mb-8"
    >
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 glass-panel border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/30 to-slate-900/80 shadow-2xl">
        {/* Glowing background accent spots */}
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur animate-pulse" />
              <div className="relative w-12 h-12 rounded-2xl bg-slate-950 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-xl">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30 shadow-sm">
                  <Zap className="w-3 h-3 text-indigo-400 animate-pulse" />
                  AI Spending Diagnosis
                </span>
                <span className="text-xs text-slate-400 font-medium">• Automated Real-time Analysis</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1.5 tracking-tight font-outfit">
                {mainInsight.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl font-normal">
                {mainInsight.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            {mainInsight.stat && (
              <div className="px-4 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-right backdrop-blur-md">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Impact</div>
                <div className="text-sm font-black text-indigo-300 font-outfit">{mainInsight.stat}</div>
              </div>
            )}
            <Link
              href="/advisor"
              className="btn-shimmer flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-95"
            >
              <span>Ask AI Advisor</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </Link>
          </div>
        </div>

        {/* Secondary insights preview pills */}
        {insights.length > 1 && (
          <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <span>More recommendations:</span>
            </span>
            {insights.slice(1, 4).map((item) => (
              <div
                key={item.id}
                className="px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-white/10 text-xs text-slate-300 flex items-center gap-2 backdrop-blur-md hover:border-indigo-500/30 transition-colors"
              >
                {item.type === 'danger' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                {item.type === 'warning' && <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                {item.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                <span className="truncate max-w-[280px] font-medium">{item.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

