"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { TransactionForm } from "@/components/TransactionForm";
import { motion } from "motion/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Transaction } from "@/types";

export default function EditPage() {
  const { transactions, updateTransaction, isLoaded } = useTransactions();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (isLoaded && id) {
      const found = transactions.find((t) => t.id === id);
      if (found) {
        setTransaction(found);
      } else {
        // Redirect if not found
        router.push("/transactions");
      }
    }
  }, [isLoaded, id, transactions, router]);

  const handleUpdate = (data: any) => {
    updateTransaction(id, data);
    router.push("/transactions");
  };

  if (!isLoaded || !transaction) {
    return <div className="flex items-center justify-center p-20 font-mono text-zinc-400 tracking-widest animate-pulse uppercase">[ ACCESSING SECURE RECORD... ]</div>;
  }

  return (
    <div className="p-8 lg:p-12 lg:pb-32 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <header className="mb-16 border-l-2 border-white pl-8 py-2">
          <h1 className="text-6xl font-display font-black tracking-tighter mb-2 uppercase">Edit Data</h1>
          <p className="text-base font-mono text-zinc-400 tracking-[0.4em] uppercase font-bold animate-terminal-cursor">MODIFY EXISTING ENTRY // ID: {id.slice(0, 8)}</p>
        </header>

        <section>
          <TransactionForm onSubmit={handleUpdate} initialData={transaction} submitLabel="EXECUTE: UPDATE RECORD" />
        </section>
      </motion.div>
    </div>
  );
}
