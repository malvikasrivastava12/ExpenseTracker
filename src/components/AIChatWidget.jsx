'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { sendAIChatQuery } from '@/lib/api';

export const AIChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi! I am your **AI Financial Advisor**. Ask me anything about your money, budget allocations, or spending trends!\n\nTry asking:\n- *\"Where am I overspending?\"*\n- *\"Suggest budget for next month\"*",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Where am I overspending?',
    'Suggest budget for next month',
    'How can I save ₹3,000 more this month?',
  ];

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
        text: res.reply,
        suggestedBudgets: res.suggestedBudgets,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I ran into an issue analyzing your data. Please check your backend connection.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-indigo-500/20 p-6 flex flex-col h-[550px] bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Financial Advisor AI
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-xs text-slate-400">Personalized spending diagnosis & budget advice</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-600/30 border border-purple-500/30 text-purple-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none font-sans'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            </div>
            <span>Analyzing your spending habits...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-[11px] font-semibold text-indigo-300 whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>👉</span> {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="pt-3 border-t border-white/10 shrink-0">
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
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
