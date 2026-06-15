"use client";

import { useState, useEffect } from "react";
import { TransactionFormData, TransactionType } from "@/types";

interface FormProps {
  onSubmit: (data: TransactionFormData) => void;
  initialData?: TransactionFormData;
  submitLabel?: string;
}

const InputWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-3 relative group">
    <label className="block font-sans text-xs tracking-[0.2em] text-zinc-500 font-bold group-focus-within:text-white transition-colors">// {label}</label>
    <div className="relative flex items-center">
      <span className="absolute left-4 font-mono text-zinc-600 group-focus-within:text-white transition-colors">{">"}</span>
      {children}
    </div>
  </div>
);

export const TransactionForm = ({ onSubmit, initialData, submitLabel = "EXECUTE: COMMIT DATA" }: FormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [amount, setAmount] = useState(initialData?.amount.toString() || "");
  const [type, setType] = useState<TransactionType>(initialData?.type || "expense");
  const [category, setCategory] = useState(initialData?.category || "GENERAL");
  const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0 || !date) return;

    onSubmit({
      title,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });

    if (!initialData) {
      setTitle("");
      setAmount("");
      setCategory("GENERAL");
    }
  };

  return (
    <div className="max-w-2xl mx-auto relative border border-zinc-900 p-10 pt-16 bg-black/40 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-zinc-900 flex items-center px-4 justify-between bg-zinc-950/50">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
        <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">● {initialData ? "EDIT RECORD MODE" : "MANUAL OVERRIDE MODE"}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 uppercase">
        {/* Type Toggle */}
        <div className="flex border border-zinc-800 p-1 bg-black">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-4 font-mono text-xs tracking-widest transition-all ${type === "expense" ? "bg-white text-black font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            [ SET EXPENSE ]
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-4 font-mono text-xs tracking-widest transition-all ${type === "income" ? "bg-white text-black font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            [ SET INCOME ]
          </button>
        </div>

        {/* Title Input */}
        <InputWrapper label="ENTRY TITLE">
          <input
            autoFocus
            type="text"
            placeholder="INPUT DESCRIPTION..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-900 pl-12 pr-4 py-5 font-mono text-base focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700 text-white rounded-none"
          />
        </InputWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Amount Input */}
          <InputWrapper label="VALUE AMT">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 pl-12 pr-4 py-5 font-mono text-base focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700 text-white rounded-none"
            />
          </InputWrapper>

          {/* Category Input */}
          <InputWrapper label="CATEGORY ID">
            <div className="relative w-full">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 pl-12 pr-4 py-5 font-mono text-base focus:outline-none focus:border-zinc-600 transition-colors appearance-none cursor-pointer text-white rounded-none"
              >
                <option value="GENERAL">GENERAL</option>
                <option value="FOOD">FOOD LOGISTICS</option>
                <option value="TRANSPORT">TRANSPORT HUB</option>
                <option value="ENTERTAINMENT">REC SYSTEMS</option>
                <option value="SALARY">CREDIT INFLOW</option>
                <option value="INVESTMENT">ASSET GROWTH</option>
              </select>
            </div>
          </InputWrapper>
        </div>

        {/* Date Input */}
        <InputWrapper label="TIMESTAMP">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-900 pl-12 pr-4 py-5 font-mono text-base focus:outline-none focus:border-zinc-600 transition-colors text-white rounded-none [color-scheme:dark]"
          />
        </InputWrapper>

        <div className="pt-6">
          <button type="submit" className="w-full py-8 bg-white text-black font-display font-black text-xl tracking-[0.4em] hover:invert transition-all active:translate-y-px">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
