'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { TransactionModal } from '@/components/TransactionModal';
import { fetchTransactions, deleteTransaction } from '@/lib/api';
import { Search, PlusCircle, Trash2, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

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
        (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || (t.notes && t.notes.toLowerCase().includes(q))
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
    const rows = filteredTx.map(t => [
      `"${t.title}"`,
      t.amount,
      t.type,
      `"${t.category}"`,
      new Date(t.date).toISOString().slice(0, 10),
      `"${t.notes || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = ['All', 'Food & Dining', 'Housing', 'Shopping', 'Transportation', 'Utilities', 'Entertainment', 'Salary', 'Freelance'];

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Transactions <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">History</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Search, filter, and manage your income and expenses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-panel rounded-2xl p-4 mb-6 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, category, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all" className="bg-slate-900 text-white">Type: All</option>
              <option value="expense" className="bg-slate-900 text-white">Type: Expenses</option>
              <option value="income" className="bg-slate-900 text-white">Type: Income</option>
            </select>
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTx.map((tx) => (
                  <tr key={tx._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-white block">{tx.title}</span>
                        {tx.notes && <span className="text-xs text-slate-400">{tx.notes}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          tx.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-sm">
                      <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-white'}>
                        {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredTx.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                      No matching transactions found. Try adjusting your filters.
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
