"use client";

import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "@phosphor-icons/react";
import { motion } from "motion/react";

interface SummaryProps {
  transactions: Transaction[];
}

const CornerBrackets = () => (
  <>
    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-zinc-800" />
    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-zinc-800" />
    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-zinc-800" />
    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-zinc-800" />
  </>
);

export const BalanceSummary = ({ transactions }: SummaryProps) => {
  const income = transactions.filter((t) => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions.filter((t) => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "IDR");
  };

  const Card = ({ title, icon: Icon, value, status, delay = 0, colorClass = "text-white" }: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }} className="p-10 bg-black text-white relative flex flex-col min-h-[260px]">
      <CornerBrackets />

      {/* Header */}
      <div className="flex items-center gap-2 text-zinc-400 font-display text-xs tracking-[0.2em] font-bold">
        <Icon size={16} />
        <span>[ {title} ]</span>
      </div>

      {/* Value - Vertically Centered */}
      <div className="flex-grow flex items-center">
        <div className={`text-5xl font-mono font-bold tracking-tight leading-none ${colorClass} flex items-baseline gap-2`}>
          <span className="text-4xl font-bold opacity-80 font-sans translate-y-[2px]">{value < 0 ? "-" : value > 0 && title === "NET BALANCE" ? "+" : ""}</span>
          <span>{formatCurrency(Math.abs(value))}</span>
        </div>
      </div>

      {/* Footer / Status - Maintains height consistency */}
      <div className="mt-4 h-4">
        {status ? (
          <div className="text-xs font-sans text-zinc-500 tracking-[0.2em] font-medium uppercase">STATUS: {status}</div>
        ) : (
          <div className="text-[10px] font-mono text-zinc-600 tracking-[0.2em] uppercase">TRX MONITOR ACTIVE</div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-20 border border-zinc-900 divide-y md:divide-y-0 md:divide-x divide-zinc-900 uppercase">
      <Card title="NET BALANCE" icon={Wallet} value={balance} status={balance >= 0 ? "NOMINAL" : "DEFICIT"} />
      <Card title="INCOME" icon={ArrowUpRight} value={income} delay={0.1} />
      <Card title="EXPENSE" icon={ArrowDownLeft} value={expense} delay={0.2} colorClass="text-zinc-300" />
    </div>
  );
};
