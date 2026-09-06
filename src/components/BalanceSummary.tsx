"use client";

import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "@phosphor-icons/react";
import { motion } from "motion/react";

interface SummaryProps {
  transactions: Transaction[];
}

export const BalanceSummary = ({ transactions }: SummaryProps) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const balance = income - expense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-zinc-950 text-white shadow-xl shadow-zinc-950/20"
      >
        <div className="flex items-center gap-3 mb-2 opacity-60">
          <Wallet size={20} weight="bold" />
          <span className="text-xs font-bold uppercase tracking-widest">Total Balance</span>
        </div>
        <div className="text-3xl font-bold tracking-tighter">
          {formatCurrency(balance)}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center gap-3 mb-2 text-emerald-600">
          <ArrowUpRight size={20} weight="bold" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 opacity-60 dark:text-zinc-300">Income</span>
        </div>
        <div className="text-3xl font-bold tracking-tighter text-zinc-950 dark:text-white">
          {formatCurrency(income)}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center gap-3 mb-2 text-rose-600">
          <ArrowDownLeft size={20} weight="bold" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 opacity-60 dark:text-zinc-300">Expense</span>
        </div>
        <div className="text-3xl font-bold tracking-tighter text-zinc-950 dark:text-white">
          {formatCurrency(expense)}
        </div>
      </motion.div>
    </div>
  );
};
