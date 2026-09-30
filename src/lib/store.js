import { TransactionModel } from './models/Transaction';
import { BudgetModel } from './models/Budget';
import { connectDB } from './db';
import mongoose from 'mongoose';

const initialTransactions = [
  // Current Month Expenses & Income
  { title: 'Monthly Salary', amount: 4500, type: 'income', category: 'Salary', date: new Date('2026-09-01'), notes: 'Tech Corp Direct Deposit' },
  { title: 'Apartment Rent', amount: 1400, type: 'expense', category: 'Housing', date: new Date('2026-09-02'), notes: 'September Rent' },
  { title: 'Whole Foods Grocery', amount: 320, type: 'expense', category: 'Food & Dining', date: new Date('2026-09-04'), notes: 'Weekly groceries' },
  { title: 'Fine Dining Restaurant', amount: 185, type: 'expense', category: 'Food & Dining', date: new Date('2026-09-07'), notes: 'Dinner with friends' },
  { title: 'Electric & Gas Bill', amount: 120, type: 'expense', category: 'Utilities', date: new Date('2026-09-08'), notes: 'Utility bill' },
  { title: 'New Shoes & Jacket', amount: 240, type: 'expense', category: 'Shopping', date: new Date('2026-09-10'), notes: 'Fall clothes' },
  { title: 'Uber & Subway Pass', amount: 95, type: 'expense', category: 'Transportation', date: new Date('2026-09-12'), notes: 'Commute' },
  { title: 'Netflix & Spotify', amount: 35, type: 'expense', category: 'Entertainment', date: new Date('2026-09-14'), notes: 'Subscriptions' },
  { title: 'Freelance Design', amount: 800, type: 'income', category: 'Freelance', date: new Date('2026-09-15'), notes: 'Client logo design' },
  { title: 'Weekend Restaurant & Snacks', amount: 210, type: 'expense', category: 'Food & Dining', date: new Date('2026-09-16'), notes: 'Weekend dining out' },
  { title: 'Tech Gadget Purchase', amount: 180, type: 'expense', category: 'Shopping', date: new Date('2026-09-17'), notes: 'Wireless Earbuds' },

  // Previous Month (August) Expenses for MoM comparisons
  { title: 'Aug Salary', amount: 4500, type: 'income', category: 'Salary', date: new Date('2026-08-01') },
  { title: 'Aug Rent', amount: 1400, type: 'expense', category: 'Housing', date: new Date('2026-08-02') },
  { title: 'Aug Groceries', amount: 450, type: 'expense', category: 'Food & Dining', date: new Date('2026-08-08') },
  { title: 'Aug Utilities', amount: 110, type: 'expense', category: 'Utilities', date: new Date('2026-08-10') },
  { title: 'Aug Shopping', amount: 150, type: 'expense', category: 'Shopping', date: new Date('2026-08-15') },
  { title: 'Aug Gas & Transport', amount: 90, type: 'expense', category: 'Transportation', date: new Date('2026-08-18') },
];

const initialBudgets = [
  { category: 'Food & Dining', monthlyLimit: 500, period: 'monthly' },
  { category: 'Housing', monthlyLimit: 1500, period: 'monthly' },
  { category: 'Shopping', monthlyLimit: 300, period: 'monthly' },
  { category: 'Transportation', monthlyLimit: 150, period: 'monthly' },
  { category: 'Utilities', monthlyLimit: 200, period: 'monthly' },
  { category: 'Entertainment', monthlyLimit: 100, period: 'monthly' },
];

if (!global.memoryTransactions) {
  global.memoryTransactions = [...initialTransactions.map((t, i) => ({ ...t, _id: String(i + 1) }))];
}
if (!global.memoryBudgets) {
  global.memoryBudgets = [...initialBudgets.map((b, i) => ({ ...b, _id: `b${i + 1}` }))];
}

async function isDBConnected() {
  await connectDB();
  return mongoose.connection.readyState === 1;
}

export const DataStore = {
  // --- TRANSACTIONS ---
  async getAllTransactions(query = {}) {
    const connected = await isDBConnected();
    if (connected) {
      const count = await TransactionModel.countDocuments();
      if (count === 0) {
        console.log('[MongoDB Atlas] Seeding initial transactions into database...');
        await TransactionModel.insertMany(initialTransactions);
      }
      const filter = {};
      if (query.category && query.category !== 'All') filter.category = query.category;
      if (query.type && query.type !== 'all') filter.type = query.type;
      return await TransactionModel.find(filter).sort({ date: -1 });
    }
    let res = [...(global.memoryTransactions || [])];
    if (query.category && query.category !== 'All') {
      res = res.filter((t) => t.category.toLowerCase() === query.category.toLowerCase());
    }
    if (query.type && query.type !== 'all') {
      res = res.filter((t) => t.type === query.type);
    }
    return res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async addTransaction(data) {
    const connected = await isDBConnected();
    if (connected) {
      console.log('[MongoDB Atlas] Inserting transaction into database:', data);
      const tx = new TransactionModel(data);
      const saved = await tx.save();
      console.log('[MongoDB Atlas] Successfully inserted transaction ID:', saved._id);
      return saved;
    }
    console.log('[In-Memory Store] Fallback inserting transaction:', data);
    const newTx = {
      _id: Date.now().toString(),
      title: data.title,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      date: data.date ? new Date(data.date) : new Date(),
      notes: data.notes || '',
      createdAt: new Date(),
    };
    global.memoryTransactions?.unshift(newTx);
    return newTx;
  },

  async deleteTransaction(id) {
    const connected = await isDBConnected();
    if (connected) {
      return await TransactionModel.findByIdAndDelete(id);
    }
    const idx = (global.memoryTransactions || []).findIndex((t) => t._id === id);
    if (idx !== -1) {
      const removed = global.memoryTransactions[idx];
      global.memoryTransactions.splice(idx, 1);
      return removed;
    }
    return null;
  },

  // --- BUDGETS ---
  async getAllBudgets() {
    const connected = await isDBConnected();
    if (connected) {
      const count = await BudgetModel.countDocuments();
      if (count === 0) {
        console.log('[MongoDB Atlas] Seeding initial budgets into database...');
        await BudgetModel.insertMany(initialBudgets);
      }
      return await BudgetModel.find({});
    }
    return [...(global.memoryBudgets || [])];
  },

  async upsertBudget(category, monthlyLimit) {
    const connected = await isDBConnected();
    if (connected) {
      return await BudgetModel.findOneAndUpdate(
        { category },
        { category, monthlyLimit: Number(monthlyLimit) },
        { upsert: true, new: true }
      );
    }
    const idx = (global.memoryBudgets || []).findIndex(
      (b) => b.category.toLowerCase() === category.toLowerCase()
    );
    if (idx !== -1) {
      global.memoryBudgets[idx].monthlyLimit = Number(monthlyLimit);
      return global.memoryBudgets[idx];
    }
    const newB = {
      _id: Date.now().toString(),
      category,
      monthlyLimit: Number(monthlyLimit),
      period: 'monthly',
    };
    global.memoryBudgets?.push(newB);
    return newB;
  },
};
