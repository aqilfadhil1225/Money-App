"use client";

import { useEffect, useMemo, useState } from "react";
import { Budget, Transaction } from "@/types";
import {
  ArrowDownRight,
  CaretDown,
  CheckCircle,
  Coins,
  PencilSimple,
  Plus,
  Trash,
  WarningCircle,
  X,
} from "@phosphor-icons/react";

interface BudgetSummaryProps {
  transactions: Transaction[];
  budgets: Budget[];
  onAddBudget: (data: { category: string; limit: number; month: string }) => void;
  onUpdateBudget: (id: string, data: { category: string; limit: number; month: string }) => void;
  onDeleteBudget: (id: string) => void;
}

const monthKey = () => new Date().toISOString().slice(0, 7);

export const BudgetSummary = ({ transactions, budgets, onAddBudget, onUpdateBudget, onDeleteBudget }: BudgetSummaryProps) => {
  const [category, setCategory] = useState("Makan");
  const [limit, setLimit] = useState(500000);
  const [month, setMonth] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState("Makan");
  const [editingLimit, setEditingLimit] = useState(500000);
  const [editingMonth, setEditingMonth] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [isReady, setIsReady] = useState(false);

  const categoryOptions = ["Umum", "Makan", "Transport", "Hiburan", "Tagihan", "Belanja", "Investasi"];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const today = monthKey();
      setCurrentMonth(today);
      setMonth((prev) => prev || today);
      setEditingMonth((prev) => prev || today);
      setIsReady(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

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

  const totalBudget = budgetRows.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgetRows.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!category || !limit || limit <= 0) return;

    onAddBudget({ category, limit, month: month || currentMonth });
  };

  const startEditing = (budget: Budget) => {
    setEditingBudgetId(budget.id);
    setEditingCategory(budget.category);
    setEditingLimit(budget.limit);
    setEditingMonth(budget.month);
  };

  const saveEdit = () => {
    if (!editingBudgetId) return;
    if (!editingCategory || !editingLimit || editingLimit <= 0) return;

    onUpdateBudget(editingBudgetId, {
      category: editingCategory,
      limit: editingLimit,
      month: editingMonth,
    });

    setEditingBudgetId(null);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="relative mb-8 overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/40 to-zinc-50 p-5 shadow-[0_18px_45px_-30px_rgba(16,185,129,0.35)] dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />

      <div className="relative mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Monthly Budget</p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-zinc-950 dark:text-white">Spending plan</h3>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Coins size={14} weight="fill" />
          {isReady && currentMonth
            ? new Date(month || currentMonth).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
            : "Memuat..."}
        </div>
      </div>

      <div className="relative mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <span>Total budget</span>
            <Coins size={15} className="text-emerald-500" weight="fill" />
          </div>
          <p className="text-lg font-bold text-zinc-950 dark:text-white">{formatCurrency(totalBudget)}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <span>Terpakai</span>
            <ArrowDownRight size={15} className="text-rose-500" weight="fill" />
          </div>
          <p className="text-lg font-bold text-zinc-950 dark:text-white">{formatCurrency(totalSpent)}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <span>Sisa</span>
            <CheckCircle size={15} className="text-emerald-500" weight="fill" />
          </div>
          <p className="text-lg font-bold text-zinc-950 dark:text-white">{formatCurrency(totalRemaining)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-3 dark:border-zinc-800 dark:from-zinc-900/80 dark:via-zinc-900/60 dark:to-zinc-950/80">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <Plus size={16} weight="bold" />
          </div>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Tambah anggaran baru</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-2.5 pr-10 text-sm font-medium text-zinc-950 shadow-sm transition-all hover:border-zinc-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:border-zinc-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
              >
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                <CaretDown size={14} weight="bold" />
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Budget</label>
            <input
              type="number"
              value={limit}
              min={0}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Month</label>
            <input
              type="month"
              value={month || currentMonth}
              onChange={(event) => setMonth(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
            />
          </div>

          <button
            type="submit"
            className="flex h-[46px] items-center justify-center gap-2 self-end rounded-xl bg-gradient-to-r from-zinc-950 to-zinc-800 px-3 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition hover:brightness-110 dark:from-white dark:to-zinc-200 dark:text-zinc-950"
          >
            <Plus size={16} weight="bold" />
            Add
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {budgetRows.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-zinc-200 bg-white/70 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-400">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Coins size={22} weight="fill" />
            </div>
            Belum ada anggaran untuk bulan ini.
          </div>
        ) : (
          budgetRows.map((budget) => {
            const isNearLimit = budget.remaining <= budget.limit * 0.2 && budget.remaining > 0;
            const isExceeded = budget.remaining < 0;
            const isEditing = editingBudgetId === budget.id;

            return (
              <div
                key={budget.id}
                className="relative overflow-hidden rounded-[24px] border border-zinc-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/70"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${isExceeded ? "from-rose-500 to-rose-400" : isNearLimit ? "from-amber-500 to-amber-400" : "from-emerald-500 to-teal-400"}`} />

                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div className="grid gap-2 md:grid-cols-3">
                      <div className="relative">
                        <select
                          value={editingCategory}
                          onChange={(event) => setEditingCategory(event.target.value)}
                          className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 pr-10 text-sm font-medium text-zinc-900 shadow-sm transition-all hover:border-zinc-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
                        >
                          {categoryOptions.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                          <CaretDown size={14} weight="bold" />
                        </span>
                      </div>

                      <input
                        type="number"
                        value={editingLimit}
                        min={0}
                        onChange={(event) => setEditingLimit(Number(event.target.value))}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
                      />

                      <input
                        type="month"
                        value={editingMonth}
                        onChange={(event) => setEditingMonth(event.target.value)}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBudgetId(null)}
                        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <Coins size={17} weight="fill" />
                          </div>
                          <p className="truncate text-base font-bold text-zinc-950 dark:text-white">{budget.category}</p>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatCurrency(budget.spent)} terpakai dari {formatCurrency(budget.limit)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isExceeded ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                            <WarningCircle size={12} weight="fill" />
                            Over
                          </span>
                        ) : isNearLimit ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            <WarningCircle size={12} weight="fill" />
                            Near limit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle size={12} weight="fill" />
                            On track
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
                      <span>{formatCurrency(budget.spent)} spent</span>
                      <span>{formatCurrency(budget.limit)} limit</span>
                    </div>

                    <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${isExceeded ? "bg-rose-500" : isNearLimit ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(budget.progress, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <span>Remaining</span>
                      <span className={isExceeded ? "text-rose-600 dark:text-rose-300" : "text-zinc-950 dark:text-white"}>
                        {formatCurrency(budget.remaining)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(budget)}
                        className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                      >
                        <PencilSimple size={16} weight="bold" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteBudget(budget.id)}
                        className="rounded-xl p-2 text-zinc-500 transition hover:bg-rose-100 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
