"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { BalanceSummary } from "@/components/BalanceSummary";
import { BudgetSummary } from "@/components/BudgetSummary";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkle } from "@phosphor-icons/react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [monthLabel, setMonthLabel] = useState("Memuat...");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
      setMonthLabel(
        new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })
      );
    });

    return () => cancelAnimationFrame(frame);
  }, []);

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

  if (!isLoaded || !isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-950 dark:border-zinc-800 dark:border-t-white" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 font-sans text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <Sparkle size={16} weight="fill" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Personal Finance</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-zinc-950 dark:text-white">
              Money Tracker
            </h1>
          </div>
          <div className="flex items-center gap-4 text-right">
            <p className="hidden text-sm font-bold uppercase tracking-widest text-zinc-400 sm:block">
              {monthLabel}
            </p>
            <ThemeToggle />
          </div>
        </header>

        {/* Summary Cards */}
        <BalanceSummary transactions={transactions} />

        {/* Action & List Section */}
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

        {/* Footer */}
        <footer className="mt-20 border-t border-zinc-200 pt-8 text-center dark:border-zinc-800">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
            Built with Taste & Discipline - 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
