'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Utensils, Home, ShoppingBag, Car, Zap, Film, Briefcase, Wallet, HelpCircle, HeartPulse, GraduationCap } from 'lucide-react';
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

  const addQuickAmount = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl bg-slate-950/95 text-slate-100 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">Add Transaction</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Record a new income entry or expense transaction</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Type Toggle Switch */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                  type === 'expense'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Expense Outflow
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                  type === 'income'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Income Inflow
              </button>
            </div>

            {/* Title / Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Transaction Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Grocery Supermarket, Monthly Salary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
              />
            </div>

            {/* Amount & Date Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-outfit font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Transaction Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                />
              </div>
            </div>

            {/* Quick Amount Add Chips */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Quick add:</span>
              {[100, 500, 1000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => addQuickAmount(val)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-extrabold text-indigo-300 transition-colors"
                >
                  +₹{val}
                </button>
              ))}
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium"
              >
                {CATEGORIES[type].map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Optional Notes / Tag</label>
              <input
                type="text"
                placeholder="e.g. Invoice #1024, Client meeting"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all disabled:opacity-40 mt-2 active:scale-95"
            >
              {loading ? 'Saving Transaction...' : 'Save Transaction'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

