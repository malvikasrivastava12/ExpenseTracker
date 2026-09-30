import './globals.css';

export const metadata = {
  title: 'SpendWise - Smart Expense Tracker & AI Advisor',
  description: 'Smart personal finance application with AI overspending alerts, budget suggestions, and monthly reporting.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-100 bg-[#0B0F17] selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
