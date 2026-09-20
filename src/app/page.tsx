"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { BalanceSummary } from "@/components/BalanceSummary";
import { BudgetSummary } from "@/components/BudgetSummary";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  Bell,
  ChartBar,
  House,
  PiggyBank,
  Sparkle,
  Wallet,
} from "@phosphor-icons/react";

const navigation = [
  { id: "overview", label: "Overview", icon: House },
  { id: "transactions", label: "Transactions", icon: ArrowRight },
  { id: "budgets", label: "Budgets", icon: PiggyBank },
  { id: "analytics", label: "Analytics", icon: ChartBar },
] as const;

export default function Home() {
  const [activeSection, setActiveSection] = useState<(typeof navigation)[number]["id"]>("overview");
  const {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    isLoaded,
  } = useTransactions();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const monthlySavings = income - expense;
  const budgetUsage = useMemo(() => {
    const activeBudgets = budgets.filter((budget) => budget.month === new Date().toISOString().slice(0, 7));
    const spent = activeBudgets.reduce((sum, budget) => {
      const budgetSpent = transactions
        .filter((transaction) => transaction.type === "expense")
        .filter((transaction) => transaction.category === budget.category)
        .filter((transaction) => transaction.date.startsWith(budget.month))
        .reduce((total, transaction) => total + transaction.amount, 0);

      return sum + Math.min(budgetSpent, budget.limit);
    }, 0);

    return activeBudgets.length === 0 ? 0 : Math.min((spent / activeBudgets.reduce((sum, budget) => sum + budget.limit, 0)) * 100, 100);
  }, [budgets, transactions]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-950 dark:border-zinc-800 dark:border-t-white" />
      </div>
    );
  }

  const renderSectionContent = () => {
    if (activeSection === "transactions") {
      return (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Tracker</p>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Transactions</h2>
            </div>
          </div>
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onUpdate={updateTransaction}
          />
        </section>
      );
    }

    if (activeSection === "budgets") {
      return (
        <section className="space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Planning</p>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Budgets</h2>
          </div>
          <BudgetSummary
            transactions={transactions}
            budgets={budgets}
            onAddBudget={addBudget}
            onUpdateBudget={updateBudget}
            onDeleteBudget={deleteBudget}
          />
        </section>
      );
    }

    if (activeSection === "analytics") {
      const categorySummary = Object.entries(
        transactions.reduce<Record<string, number>>((acc, transaction) => {
          if (transaction.type !== "expense") return acc;
          acc[transaction.category] = (acc[transaction.category] ?? 0) + transaction.amount;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]);

      return (
        <section className="space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Insights</p>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Analytics</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Income</p>
              <p className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(income)}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Expense</p>
              <p className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(expense)}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Savings</p>
              <p className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(monthlySavings)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-bold text-zinc-950 dark:text-white">Category spend</h3>
            <div className="space-y-4">
              {categorySummary.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No expense data yet.</p>
              ) : (
                categorySummary.map(([category, amount]) => {
                  const percent = Math.max((amount / Math.max(...categorySummary.map(([, val]) => val), 1)) * 100, 12);

                  return (
                    <div key={category}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{category}</span>
                        <span className="font-bold text-zinc-950 dark:text-white">
                          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount)}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800">
                        <div className="h-full rounded-full bg-zinc-950 dark:bg-white" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      );
    }

    return (
      <>
        <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-zinc-400">
              <Sparkle size={16} weight="fill" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Personal Finance</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-zinc-950 dark:text-white sm:text-4xl">
              Money Tracker
            </h1>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
            {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </p>
        </header>

        <BalanceSummary transactions={transactions} />

        <div className="grid grid-cols-1 gap-8">
          <section>
            <TransactionForm onAdd={addTransaction} />
          </section>
        </div>

        <BudgetSummary
          transactions={transactions}
          budgets={budgets}
          onAddBudget={addBudget}
          onUpdateBudget={updateBudget}
          onDeleteBudget={deleteBudget}
        />

        <div className="grid grid-cols-1 gap-8">
          <section>
            <TransactionList
              transactions={transactions}
              onDelete={deleteTransaction}
              onUpdate={updateTransaction}
            />
          </section>
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-6 font-sans text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="flex w-full flex-col gap-5 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-200/80 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-900/20 dark:bg-white dark:text-zinc-950 dark:shadow-none">
                <Wallet size={18} weight="fill" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Finance</p>
                <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">Money App</h2>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSection;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-zinc-950 text-white shadow-sm shadow-zinc-900/10 dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-white/10 text-white dark:bg-zinc-950/5 dark:text-zinc-950"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      <Icon size={16} weight={isActive ? "fill" : "regular"} />
                    </span>
                    {item.label}
                  </span>
                  {isActive && <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </nav>

          <div className="rounded-2xl bg-zinc-100 p-4 shadow-inner shadow-zinc-200/50 dark:bg-zinc-800/80 dark:shadow-none">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-300">
                <Bell size={16} weight="fill" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Budget</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                On track
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(monthlySavings)}
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div className="h-full rounded-full bg-zinc-950 dark:bg-white" style={{ width: `${Math.min(budgetUsage, 100)}%` }} />
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{Math.round(budgetUsage)}% of monthly plan used</p>
          </div>

        </aside>

        <div className="flex-1 rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/80 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-6 lg:p-8">
          {renderSectionContent()}

          <footer className="mt-20 border-t border-zinc-200 pt-8 text-center dark:border-zinc-800">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Built with Taste & Discipline - 2026
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
