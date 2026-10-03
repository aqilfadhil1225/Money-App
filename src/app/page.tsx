"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { BalanceSummary } from "@/components/BalanceSummary";
import { BudgetSummary } from "@/components/BudgetSummary";
import { GoalSummary } from "../components/GoalSummary";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackupRestore } from "@/components/BackupRestore";
import {
  Bank,
  ChartPieSlice,
  PiggyBank,
  Sparkle,
  Wallet,
} from "@phosphor-icons/react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [monthLabel, setMonthLabel] = useState("Memuat...");
  const [activeTab, setActiveTab] = useState<"Overview" | "Wallet" | "Budget" | "Goals">("Overview");

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
    goals,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    replaceData,
    isLoaded,
  } = useTransactions();

  if (!isLoaded || !isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-950 dark:border-zinc-800 dark:border-t-white" />
      </div>
    );
  }

  const navItems = [
    { label: "Overview", icon: ChartPieSlice },
    { label: "Wallet", icon: Wallet },
    { label: "Budget", icon: Bank },
    { label: "Goals", icon: PiggyBank },
  ] as const;

  const overviewContent = (
    <>
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

      <GoalSummary
        goals={goals}
        onAddGoal={addGoal}
        onUpdateGoal={updateGoal}
        onDeleteGoal={deleteGoal}
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

  const walletContent = (
    <>
      <BalanceSummary transactions={transactions} />
      <div className="grid grid-cols-1 gap-8">
        <section>
          <TransactionForm onAdd={addTransaction} />
        </section>
      </div>
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

  const budgetContent = (
    <BudgetSummary
      transactions={transactions}
      budgets={budgets}
      onAddBudget={addBudget}
      onUpdateBudget={updateBudget}
      onDeleteBudget={deleteBudget}
    />
  );

  const goalContent = (
    <GoalSummary
      goals={goals}
      onAddGoal={addGoal}
      onUpdateGoal={updateGoal}
      onDeleteGoal={deleteGoal}
    />
  );

  const currentTitle = {
    Overview: "Overview",
    Wallet: "Wallet",
    Budget: "Budget",
    Goals: "Goals",
  }[activeTab];

  const currentContent = {
    Overview: overviewContent,
    Wallet: walletContent,
    Budget: budgetContent,
    Goals: goalContent,
  }[activeTab];

  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-100 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-6 sm:px-5 lg:h-[calc(100vh-3rem)] lg:min-h-0 lg:flex-row lg:items-start lg:px-6 lg:py-6">
        <aside className="w-full rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-[28px] sm:p-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72 lg:flex-shrink-0 lg:self-start lg:overflow-y-auto">
          <div className="flex min-h-full flex-col">
            <div className="mb-3 flex items-center justify-between sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-900/20 dark:bg-white dark:text-zinc-950 dark:shadow-none">
                  <Wallet size={18} weight="fill" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Finance</p>
                  <h2 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">Money App</h2>
                </div>
              </div>
              <ThemeToggle />
            </div>

            <nav aria-label="Main navigation" className="grid grid-cols-4 gap-1 sm:gap-2 lg:grid-cols-1">
              {navItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(label as typeof activeTab)}
                  aria-current={activeTab === label ? "page" : undefined}
                  className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-center text-[10px] font-semibold transition-all sm:flex-row sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-3 sm:text-left sm:text-sm lg:justify-start ${
                    activeTab === label
                      ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/20 dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                >
                  <Icon size={18} weight="fill" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="mt-3 pt-0 sm:mt-auto sm:pt-6">
              <BackupRestore
                data={{ transactions, budgets, goals }}
                onRestore={replaceData}
              />
            </div>

          </div>
        </aside>

        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-[28px] lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-7">
            <header className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-5 dark:border-zinc-800 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pb-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-zinc-400">
                <Sparkle size={15} weight="fill" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Personal Finance</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tighter text-zinc-950 dark:text-white sm:text-4xl">
                {currentTitle}
              </h1>
            </div>
            <div className="flex items-center justify-between gap-3 text-right sm:justify-end">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">
                {monthLabel}
              </p>
            </div>
          </header>

          <div className="space-y-6 sm:space-y-8">{currentContent}</div>

            <footer className="mt-12 border-t border-zinc-200 pt-8 text-center dark:border-zinc-800">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Built with Taste & Discipline - 2026
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
