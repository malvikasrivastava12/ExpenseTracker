'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const MonthlyBar = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([month, vals]) => {
    const [y, m] = month.split('-');
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
    const monthLabel = date.toLocaleString('default', { month: 'short' });
    const net = vals.income - vals.expense;
    return {
      month: monthLabel,
      Income: vals.income,
      Expense: vals.expense,
      Net: net,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-slate-500 space-y-2">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-xl">📈</span>
        </div>
        <p className="text-xs font-semibold text-slate-400">No monthly trend data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const income = payload.find((p) => p.dataKey === 'Income')?.value || 0;
      const expense = payload.find((p) => p.dataKey === 'Expense')?.value || 0;
      const net = income - expense;

      return (
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 shadow-2xl bg-slate-950/95 backdrop-blur-xl text-xs space-y-2">
          <p className="font-extrabold text-white text-sm border-b border-white/10 pb-1.5 font-outfit">
            {label} Breakdown
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
              </span>
              <span className="text-emerald-400 font-extrabold font-outfit">₹{income.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
              </span>
              <span className="text-rose-400 font-extrabold font-outfit">₹{expense.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-6">
              <span className="text-slate-300 font-bold">Net Cashflow</span>
              <span className={`font-black font-outfit ${net >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
                {net >= 0 ? '+' : ''}₹{net.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity={1} />
              <stop offset="100%" stopColor="#E11D48" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: '10px' }}
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-300 hover:text-white">{value}</span>
            )}
          />
          <Bar dataKey="Income" fill="url(#incomeGrad)" radius={[8, 8, 0, 0]} maxBarSize={32} />
          <Bar dataKey="Expense" fill="url(#expenseGrad)" radius={[8, 8, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

