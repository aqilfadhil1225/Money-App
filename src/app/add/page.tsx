"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { TransactionForm } from "@/components/TransactionForm";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const { addTransaction, isLoaded } = useTransactions();
  const router = useRouter();

  if (!isLoaded) {
    return <div className="flex items-center justify-center p-20 font-mono text-zinc-400 tracking-widest animate-pulse uppercase">[ INITIALIZING INPUT TERMINAL... ]</div>;
  }

  const handleAdd = (data: any) => {
    addTransaction(data);
    router.push("/");
  };

  return (
    <div className="p-8 lg:p-12 lg:pb-32 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <header className="mb-16 border-l-2 border-white pl-8 py-2">
          <h1 className="text-6xl font-display font-black tracking-tighter mb-2 uppercase">Add Data</h1>
          <p className="text-base font-mono text-zinc-400 tracking-[0.4em] uppercase font-bold animate-terminal-cursor">MANUAL COMMAND INPUT</p>
        </header>

        <section>
          <TransactionForm onSubmit={handleAdd} />
        </section>
      </motion.div>
    </div>
  );
}
