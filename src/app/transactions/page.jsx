'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { TransactionModal } from '@/components/TransactionModal';
import { fetchTransactions, deleteTransaction } from '@/lib/api';
import {
  Search,
  PlusCircle,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Utensils,
  Home,
  ShoppingBag,
  Car,
  Zap,
  Film,
  Briefcase,
  Wallet,
  HelpCircle,
} from 'lucide-react';

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return Utensils;
  if (cat.includes('house') || cat.includes('rent') || cat.includes('housing')) return Home;
  if (cat.includes('shop')) return ShoppingBag;
  if (cat.includes('transport') || cat.includes('travel')) return Car;
  if (cat.includes('utilit') || cat.includes('bill')) return Zap;
  if (cat.includes('entertain') || cat.includes('movie')) return Film;
  if (cat.includes('salary') || cat.includes('pay')) return Briefcase;
  if (cat.includes('freelance') || cat.includes('business')) return Wallet;
  return HelpCircle;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTx, setFilteredTx] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
      setFilteredTx(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedType !== 'all') {
      result = result.filter((t) => t.type === selectedType);
    }

    setFilteredTx(result);
  }, [searchQuery, selectedCategory, selectedType, transactions]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
      loadTransactions();
    }
  };

  const handleExportCSV = () => {
    if (filteredTx.length === 0) return;
    const headers = ['Title', 'Amount', 'Type', 'Category', 'Date', 'Notes'];
    const rows = filteredTx.map((t) => [
      `"${t.title}"`,
      t.amount,
      t.type,
      `"${t.category}"`,
      new Date(t.date).toISOString().slice(0, 10),
      `"${t.notes || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = [
    'All',
    'Food & Dining',
    'Housing',
    'Shopping',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Salary',
    'Freelance',
  ];

  const totalFilteredIncome = filteredTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalFilteredExpense = filteredTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="glow-blob top-10 right-10 w-96 h-96 bg-indigo-600/15" />
      <div className="glow-blob bottom-10 left-10 w-96 h-96 bg-purple-600/15" />

      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/[0.06]">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-outfit">
              Transactions <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">History</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Search, filter, analyze, and manage your full financial transaction audit log.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-shimmer flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-indigo-200" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Metric Overview Strip for Filtered Transactions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Filtered Items</span>
            <div className="text-xl font-black text-white font-outfit mt-0.5">{filteredTx.length} items</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Filtered Income</span>
            <div className="text-xl font-black text-emerald-400 font-outfit mt-0.5">₹{totalFilteredIncome.toLocaleString()}</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Filtered Expense</span>
            <div className="text-xl font-black text-rose-400 font-outfit mt-0.5">₹{totalFilteredExpense.toLocaleString()}</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Net Filtered Flow</span>
            <div className={`text-xl font-black font-outfit mt-0.5 ${totalFilteredIncome - totalFilteredExpense >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
              ₹{(totalFilteredIncome - totalFilteredExpense).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-xl">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, category, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium"
            >
              <option value="all" className="bg-slate-900 text-white">Type: All</option>
              <option value="expense" className="bg-slate-900 text-white">Type: Expenses</option>
              <option value="income" className="bg-slate-900 text-white">Type: Income</option>
            </select>
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/[0.04] border-b border-white/10 text-[11px] uppercase text-slate-400 font-black tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredTx.map((tx) => {
                  const CategoryIcon = getCategoryIcon(tx.category);
                  const isIncome = tx.type === 'income';

                  return (
                    <tr key={tx._id} className="hover:bg-white/[0.04] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow-sm ${
                              isIncome
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                            }`}
                          >
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block group-hover:text-indigo-300 transition-colors">
                              {tx.title}
                            </span>
                            {tx.notes && <span className="text-xs text-slate-400 block">{tx.notes}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs font-semibold text-slate-300">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {new Date(tx.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                            isIncome
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-base font-outfit">
                        <span className={isIncome ? 'text-emerald-400' : 'text-slate-100'}>
                          {isIncome ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(tx._id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all active:scale-95"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredTx.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center">
                        <Search className="w-5 h-5 text-slate-500" />
                      </div>
                      <p className="text-xs font-semibold text-slate-400">No matching transactions found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadTransactions}
      />
    </div>
  );
}

