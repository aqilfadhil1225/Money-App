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
    <main className="min-h-screen bg-zinc-50 px-3 py-8 font-sans text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-zinc-400">
              <Sparkle size={16} weight="fill" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Personal Finance</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-zinc-950 dark:text-white sm:text-4xl">
              Money Tracker
            </h1>
          </div>
          <div className="flex items-center justify-between gap-3 text-right sm:justify-end">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">
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
