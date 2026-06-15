"use client";

import { useState } from "react";
import { Transaction } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

interface ListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}

export const TransactionList = ({ transactions, onDelete }: ListProps) => {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "IDR");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().split("T")[0];
  };

  return (
    <div className="w-full font-sans text-xs uppercase tracking-wider overflow-x-auto border border-zinc-900 bg-black/20">
      <div className="min-w-[900px]">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-0 border-b border-zinc-800 p-0 font-display font-bold text-zinc-500 bg-black sticky top-0 z-10">
          <div className="col-span-1 p-5 border-r border-zinc-900">TYPE</div>
          <div className="col-span-2 p-5 border-r border-zinc-900 text-center font-mono">TIMESTAMP</div>
          <div className="col-span-4 p-5 border-r border-zinc-900">DESCRIPTION</div>
          <div className="col-span-2 p-5 border-r border-zinc-900">CATEGORY</div>
          <div className="col-span-1 p-5 border-r border-zinc-900 text-right">AMT (IDR)</div>
          <div className="col-span-2 p-5 text-right">ACTIONS</div>
        </div>

        <div className="divide-y divide-zinc-900">
          <AnimatePresence mode="popLayout">
            {transactions.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center text-zinc-600 font-display tracking-[0.5em] text-sm">
                [ NO RECORDS AVAILABLE ]
              </motion.div>
            ) : (
              transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="grid grid-cols-12 gap-0 items-center group transition-colors hover:bg-zinc-900/30"
                >
                  <div className={`col-span-1 p-5 border-r border-zinc-900 font-bold font-mono ${transaction.type === "income" ? "text-white" : "text-zinc-500"}`}>
                    [{transaction.type === "income" ? "INC" : "EXP"}]
                  </div>
                  <div className="col-span-2 p-5 border-r border-zinc-900 text-zinc-400 text-center font-mono">{formatDate(transaction.date)}</div>
                  <div className="col-span-4 p-5 border-r border-zinc-900 text-white font-bold group-hover:text-zinc-200">{transaction.title}</div>
                  <div className="col-span-2 p-5 border-r border-zinc-900 text-zinc-400">{transaction.category}</div>
                  <div
                    className={`col-span-1 p-5 border-r border-zinc-900 text-right font-bold font-mono ${transaction.type === "income" ? "text-white" : "text-zinc-400"} flex items-baseline justify-end gap-2`}
                  >
                    <span className="text-lg font-bold opacity-60 font-sans leading-none translate-y-[1px]">{transaction.type === "income" ? "+" : "-"}</span>
                    <span>{formatCurrency(transaction.amount).replace("IDR", "").trim()}</span>
                  </div>
                  <div className="col-span-2 p-5 text-right flex justify-end gap-6 md:opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    <button onClick={() => router.push(`/transactions/edit/${transaction.id}`)} className="text-zinc-500 hover:text-white transition-colors">
                      [ EDIT ]
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("PERMANENT WIPE?")) onDelete(transaction.id);
                      }}
                      className="text-zinc-600 hover:text-white transition-colors font-bold"
                    >
                      [ WIPE ]
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
