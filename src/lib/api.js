const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const fetchSummary = async () => {
  const res = await fetch(`${API_BASE_URL}/transactions/summary`, { cache: 'no-store' });
  const data = await res.json();
  return data.summary;
};

export const fetchTransactions = async (filters) => {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters?.type && filters.type !== 'all') params.append('type', filters.type);

  const res = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`, { cache: 'no-store' });
  const data = await res.json();
  return data.data;
};

export const createTransaction = async (txData) => {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txData),
  });
  const data = await res.json();
  return data.data;
};

export const deleteTransaction = async (id) => {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
};

export const fetchBudgets = async () => {
  const res = await fetch(`${API_BASE_URL}/budgets`, { cache: 'no-store' });
  const data = await res.json();
  return data.data;
};

export const saveBudget = async (category, monthlyLimit) => {
  const res = await fetch(`${API_BASE_URL}/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, monthlyLimit }),
  });
  const data = await res.json();
  return data.data;
};

export const fetchAutoInsights = async () => {
  const res = await fetch(`${API_BASE_URL}/ai/insights`, { cache: 'no-store' });
  const data = await res.json();
  return data.data;
};

export const sendAIChatQuery = async (prompt) => {
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return await res.json();
};

export const fetchMonthlyReport = async (month) => {
  const params = month ? `?month=${month}` : '';
  const res = await fetch(`${API_BASE_URL}/reports/monthly${params}`, { cache: 'no-store' });
  const data = await res.json();
  return data.report;
};
