'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#8B5CF6', '#F43F5E', '#64748B'];

export const CategoryDonut = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500">
        <p className="text-sm font-medium">No expense category data yet</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="glass-panel p-3 rounded-xl border border-white/10 shadow-xl bg-slate-900/90 text-xs">
          <p className="font-bold text-white">{item.name}</p>
          <p className="text-indigo-400 font-semibold mt-0.5">
            ₹{item.value.toLocaleString()} ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.3)" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs font-medium text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
