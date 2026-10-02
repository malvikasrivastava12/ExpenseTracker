'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { sendAIChatQuery } from '@/lib/api';

export const AIChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 **Hi! I am your AI Financial Advisor**.\n\nI can analyze your spending speed, flag category budget breaches, and generate personalized savings strategies.\n\nAsk me anything like:\n• *\"Where am I overspending?\"*\n• *\"Suggest budget for next month\"*\n• *\"How can I save ₹5,000 this month?\"*",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Where am I overspending?',
    'Suggest budget for next month',
    'How can I save ₹5,000 more?',
    'Summarize my spending habits',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await sendAIChatQuery(textToSend);
      const aiMsg = {
        sender: 'ai',
        text: res.reply || res.message || 'I have analyzed your financial records.',
        suggestedBudgets: res.suggestedBudgets,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ I encountered an error reviewing your transactions. Please ensure the backend is connected and retry.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-indigo-500/30 p-5 sm:p-6 flex flex-col h-[560px] bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-slate-950/95 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-75 blur animate-pulse" />
            <div className="relative w-10 h-10 rounded-xl bg-slate-950 border border-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white font-outfit flex items-center gap-2">
              Financial Advisor AI
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Overspending Diagnosis & Budget AI</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors text-xs flex items-center gap-1"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white border border-indigo-400/30'
                    : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                    : 'bg-white/[0.05] border border-white/10 text-slate-200 rounded-tl-none font-sans backdrop-blur-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans leading-relaxed">
                  {msg.text}
                </div>

                {/* Suggested Budgets Card inside AI Response */}
                {msg.suggestedBudgets && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <span className="text-xs font-black text-indigo-300 uppercase tracking-wider block">
                      💡 Suggested Monthly Budget Plan:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(msg.suggestedBudgets).map(([cat, val]) => (
                        <div key={cat} className="p-2 rounded-xl bg-slate-950/60 border border-white/10 flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-bold">{cat}</span>
                          <span className="text-emerald-400 font-black">₹{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-slate-400 text-xs py-2"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <span className="font-semibold text-slate-300 animate-pulse">Analyzing income, expenses & spending patterns...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 relative z-10">
        {quickPrompts.map((promptText, i) => (
          <button
            key={i}
            onClick={() => handleSend(promptText)}
            className="px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-[11px] font-bold text-indigo-300 whitespace-nowrap transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>👉</span> {promptText}
          </button>
        ))}
      </div>

      {/* Input Box Form */}
      <div className="pt-3 border-t border-white/10 shrink-0 relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI e.g. 'Where am I overspending?'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-shimmer p-3 sm:px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold disabled:opacity-40 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

