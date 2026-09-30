'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, PieChart, Sparkles, FileSpreadsheet, PlusCircle } from 'lucide-react';

export const Navbar = ({ onOpenAddModal }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ReceiptText },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'AI Advisor', path: '/advisor', icon: Sparkles, badge: 'AI' },
    { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B0F17]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                spend<span className="text-indigo-400">Wise</span>
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Smart Expense Tracker
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.name}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
