"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { BalanceSummary } from "@/components/BalanceSummary";
import { motion } from "motion/react";

export default function Home() {
  const { transactions, isLoaded } = useTransactions();

  if (!isLoaded) {
    return <div className="flex items-center justify-center p-20 font-mono text-zinc-500 tracking-widest animate-pulse uppercase">[ LOADING TELEMETRY... ]</div>;
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="border-l-2 border-white pl-8 py-2">
            <h1 className="text-7xl font-display font-black tracking-tighter mb-4 uppercase">Dashboard</h1>
            <p className="text-base font-mono text-zinc-400 tracking-[0.4em] uppercase font-bold animate-terminal-cursor">MAIN TELEMETRY VIEW</p>
          </div>
        </header>

        <BalanceSummary transactions={transactions} />

        <div className="mt-20 border-t border-zinc-900 pt-8">
          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.5em] uppercase text-center">SYSTEM STANDBY // WAITING FOR INSTRUCTIONS</p>
        </div>
      </motion.div>
    </div>
  );
}
