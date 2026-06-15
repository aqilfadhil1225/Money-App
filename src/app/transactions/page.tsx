"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { TransactionList } from "@/components/TransactionList";
import { motion } from "motion/react";

export default function TransactionsPage() {
  const { transactions, deleteTransaction, updateTransaction, isLoaded } = useTransactions();

  if (!isLoaded) {
    return <div className="flex items-center justify-center p-20 font-mono text-zinc-400 tracking-widest animate-pulse uppercase">[ RETRIEVING ARCHIVED LOGS... ]</div>;
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <header className="mb-16 border-l-2 border-white pl-8 py-2">
          <h1 className="text-6xl font-display font-black tracking-tighter mb-2 uppercase">Transaction Logs</h1>
          <p className="text-base font-mono text-zinc-400 tracking-[0.4em] uppercase font-bold animate-terminal-cursor">ARCHIVE DATA STREAM</p>
        </header>

        <section>
          <TransactionList transactions={transactions} onDelete={deleteTransaction} onUpdate={updateTransaction} />
        </section>
      </motion.div>
    </div>
  );
}
