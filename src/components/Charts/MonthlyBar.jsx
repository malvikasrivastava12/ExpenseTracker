'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const MonthlyBar = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([month, vals]) => {
    // Format month "YYYY-MM" to readable "MMM YYYY"
    const [y, m] = month.split('-');
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
    const monthLabel = date.toLocaleString('default', { month: 'short' });
    return {
      month: monthLabel,
      Income: vals.income,
      Expense: vals.expense,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500">
        <p className="text-sm font-medium">No monthly trend data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Legend formatter={(value) => <span className="text-xs font-medium text-slate-300">{value}</span>} />
          <Bar dataKey="Income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Expense" fill="#F43F5E" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
