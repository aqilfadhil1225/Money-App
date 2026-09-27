"use client";

import { useState } from "react";
import { TransactionFormData, TransactionType } from "@/types";
import { CaretDown, Plus, X } from "@phosphor-icons/react";
import { motion } from "motion/react";

interface FormProps {
  onAdd: (data: TransactionFormData) => void;
}

export const TransactionForm = ({ onAdd }: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("Umum");
  const [date, setDate] = useState("");

  const selectClassName =
    "w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-10 text-sm font-medium text-zinc-900 shadow-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:border-zinc-600 dark:focus:border-white dark:focus:ring-white/10";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0 || !date) return;

    onAdd({
      title,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });

    setTitle("");
    setAmount("");
    setCategory("Umum");
    setDate("");
    setIsOpen(false);
  };

  return (
    <div className="mb-12">
      {!isOpen ? (
        <motion.button
          layoutId="form"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 bg-white py-4 text-sm font-semibold tracking-[0.08em] text-zinc-500 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-950 dark:hover:text-zinc-100"
        >
          <Plus size={18} weight="bold" />
          ADD TRANSACTION
        </motion.button>
      ) : (
        <motion.div
          layoutId="form"
          className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
        >
          <div
            className={`absolute inset-x-0 top-0 h-1.5 ${type === "income" ? "bg-emerald-500" : "bg-rose-500"}`}
          />

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Quick entry</p>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-zinc-950 dark:text-white">New transaction</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
              aria-label="Close transaction form"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl bg-zinc-100 p-1.5 dark:bg-zinc-800">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                    type === "expense"
                      ? "bg-white text-rose-600 shadow-sm dark:bg-zinc-900 dark:text-rose-400"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                    type === "income"
                      ? "bg-white text-emerald-600 shadow-sm dark:bg-zinc-900 dark:text-emerald-400"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Title</label>
              <input
                autoFocus
                type="text"
                placeholder="What did you buy or earn?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white dark:focus:ring-white/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Amount</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400">Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3.5 pl-10 pr-4 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={selectClassName}
                  >
                    <option value="Umum">Umum</option>
                    <option value="Makan">Makan</option>
                    <option value="Transport">Transport</option>
                    <option value="Hiburan">Hiburan</option>
                    <option value="Gaji">Gaji</option>
                    <option value="Investasi">Investasi</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                    <CaretDown size={16} weight="bold" />
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-950 outline-none transition-all focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
              />
            </div>

            <button
              type="submit"
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.99] ${
                type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              }`}
            >
              <Plus size={18} weight="bold" />
              Add {type === "income" ? "Income" : "Expense"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};