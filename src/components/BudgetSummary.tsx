"use client";

import { useMemo, useState } from "react";
import { Budget, Transaction } from "@/types";
import { Plus, Wallet, WarningCircle, CheckCircle } from "@phosphor-icons/react";

interface BudgetSummaryProps {
  transactions: Transaction[];
  budgets: Budget[];
  onAddBudget: (data: { category: string; limit: number; month: string }) => void;
}

const monthKey = () => new Date().toISOString().slice(0, 7);

const categoryOptions = ["Umum", "Makan", "Transport", "Hiburan", "Tagihan", "Belanja", "Investasi"]; 

export const BudgetSummary = ({ transactions, budgets, onAddBudget }: BudgetSummaryProps) => {
  const [category, setCategory] = useState("Makan");
  const [limit, setLimit] = useState(500000);
  const [month, setMonth] = useState(monthKey());

  const currentMonth = monthKey();

  const budgetRows = useMemo(() => {
    const activeMonth = month || currentMonth;
    const expenseByCategory = transactions
      .filter((transaction) => transaction.type === "expense")
      .filter((transaction) => transaction.date.startsWith(activeMonth))
      .reduce<Record<string, number>>((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] ?? 0) + transaction.amount;
        return acc;
      }, {});

    const entries = budgets
      .filter((budget) => budget.month === activeMonth)
      .map((budget) => {
        const spent = expenseByCategory[budget.category] ?? 0;
        const remaining = budget.limit - spent;
        const progress = Math.min((spent / budget.limit) * 100, 100);

        return {
          ...budget,
          spent,
          remaining,
          progress,
        };
      });

    return entries.sort((a, b) => b.remaining - a.remaining);
  }, [budgets, currentMonth, month, transactions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!category || !limit || limit <= 0) return;

    onAddBudget({ category, limit, month: month || currentMonth });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Monthly Budget</p>
          <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">Spending plan</h3>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {new Date(month || currentMonth).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Category</label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Budget</label>
          <input
            type="number"
            value={limit}
            min={0}
            onChange={(event) => setLimit(Number(event.target.value))}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Month</label>
          <input
            type="month"
            value={month || currentMonth}
            onChange={(event) => setMonth(event.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Plus size={18} weight="bold" />
          Add
        </button>
      </form>

      <div className="space-y-3">
        {budgetRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Belum ada anggaran untuk bulan ini.
          </div>
        ) : (
          budgetRows.map((budget) => {
            const isNearLimit = budget.remaining <= budget.limit * 0.2 && budget.remaining > 0;
            const isExceeded = budget.remaining < 0;

            return (
              <div key={budget.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-zinc-950 dark:text-white">{budget.category}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatCurrency(budget.spent)} spent of {formatCurrency(budget.limit)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExceeded ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                        <WarningCircle size={12} weight="fill" />
                        Over
                      </span>
                    ) : isNearLimit ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        <WarningCircle size={12} weight="fill" />
                        Near limit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle size={12} weight="fill" />
                        On track
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${isExceeded ? "bg-rose-500" : isNearLimit ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min(budget.progress, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  <span>Remaining</span>
                  <span className={isExceeded ? "text-rose-600 dark:text-rose-300" : "text-zinc-950 dark:text-white"}>
                    {formatCurrency(budget.remaining)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
