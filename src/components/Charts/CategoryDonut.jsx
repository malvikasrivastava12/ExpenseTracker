'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
  '#3B82F6', // Blue
  '#64748B', // Slate
];

export const CategoryDonut = ({ data }) => {
  const chartData = Object.entries(data || {})
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-slate-500 space-y-2">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-xl">📊</span>
        </div>
        <p className="text-xs font-semibold text-slate-400">No expense category data yet</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="glass-panel p-3.5 rounded-2xl border border-indigo-500/30 shadow-2xl bg-slate-950/90 backdrop-blur-xl text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color || '#6366F1' }}
            />
            <p className="font-extrabold text-white text-sm">{item.name}</p>
          </div>
          <div className="flex items-baseline justify-between gap-4 pt-1 border-t border-white/10">
            <span className="text-slate-400">Amount:</span>
            <span className="text-indigo-300 font-black font-outfit">
              ₹{item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-slate-400">Share:</span>
            <span className="text-emerald-400 font-bold">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 relative flex items-center justify-center">
      {/* Center Metric Display Overlay */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
          Total Spent
        </span>
        <span className="text-xl font-black text-white font-outfit tracking-tight">
          ₹{total > 100000 ? `${(total / 1000).toFixed(1)}k` : total.toLocaleString()}
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={68}
            outerRadius={96}
            paddingAngle={4}
            dataKey="value"
            stroke="rgba(8, 12, 20, 0.8)"
            strokeWidth={3}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="transition-all duration-300 hover:opacity-85"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

