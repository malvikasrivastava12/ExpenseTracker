import './globals.css';

export const metadata = {
  title: 'SpendWise - Smart Expense Tracker & AI Advisor',
  description: 'Smart personal finance application with AI overspending alerts, budget suggestions, and monthly reporting.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="antialiased text-slate-100 bg-[#080C14] selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

