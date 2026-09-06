"use client";

import { useState } from "react";
import { TransactionFormData, TransactionType } from "@/types";
import { Plus, X } from "@phosphor-icons/react";
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 py-4 font-medium text-zinc-400 transition-all hover:border-zinc-300 hover:text-zinc-600 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
        >
          <Plus size={20} weight="bold" />
          Add Transaction
        </motion.button>
      ) : (
        <motion.div layoutId="form" className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">New Transaction</h3>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
              <X size={20} weight="bold" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 p-1 bg-zinc-100 rounded-lg mb-4">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 rounded-md py-2 text-sm font-bold transition-all ${type === "expense" ? "bg-white text-rose-600 shadow-sm dark:bg-zinc-800" : "text-zinc-500"}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 rounded-md py-2 text-sm font-bold transition-all ${type === "income" ? "bg-white text-emerald-600 shadow-sm dark:bg-zinc-800" : "text-zinc-500"}`}
              >
                Income
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">Title</label>
              <input
                autoFocus
                type="text"
                placeholder="What did you buy/earn?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-950 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">Amount</label>
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-zinc-950 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-950 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                >
                  <option>Umum</option>
                  <option>Makan</option>
                  <option>Transport</option>
                  <option>Hiburan</option>
                  <option>Gaji</option>
                  <option>Investasi</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-950 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-zinc-950 py-4 font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Add {type === "income" ? "Income" : "Expense"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};