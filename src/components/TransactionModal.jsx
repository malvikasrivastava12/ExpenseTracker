'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createTransaction } from '@/lib/api';

const CATEGORIES = {
  expense: ['Food & Dining', 'Housing', 'Shopping', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
};

export const TransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    setLoading(true);
    try {
      await createTransaction({
        title,
        amount: parseFloat(amount),
        type,
        category,
        date,
        notes,
      });
      // Reset & notify
      setTitle('');
      setAmount('');
      setNotes('');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Add Transaction</h2>
          <p className="text-xs text-slate-400 mt-1">Record a new income entry or expense item</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950/80 border border-white/5">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Title / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery Store, Monthly Salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Optional Notes</label>
            <input
              type="text"
              placeholder="e.g. Receipt #1042"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};
