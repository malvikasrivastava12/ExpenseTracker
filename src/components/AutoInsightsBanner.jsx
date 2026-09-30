'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, AlertTriangle, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export const AutoInsightsBanner = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <div className="relative overflow-hidden rounded-2xl p-6 glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/50">
        {/* Glowing background accent */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  AI Spending Alert
                </span>
                <span className="text-xs text-slate-400">• Automated Insights</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {insights[0].title}
              </h3>
              <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">
                {insights[0].message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            {insights[0].stat && (
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Impact</div>
                <div className="text-sm font-extrabold text-indigo-300">{insights[0].stat}</div>
              </div>
            )}
            <Link
              href="/advisor"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
            >
              <span>Ask AI Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Secondary insights preview pills */}
        {insights.length > 1 && (
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">More insights:</span>
            {insights.slice(1, 3).map((item) => (
              <div
                key={item.id}
                className="px-3 py-1 rounded-full bg-slate-900/60 border border-white/5 text-xs text-slate-300 flex items-center gap-1.5"
              >
                {item.type === 'danger' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                {item.type === 'warning' && <TrendingUp className="w-3 h-3 text-amber-400" />}
                {item.type === 'success' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                <span className="truncate max-w-[280px]">{item.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
