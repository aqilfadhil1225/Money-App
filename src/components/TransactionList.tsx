"use client";

import { useMemo, useState } from "react";
import { Transaction, TransactionFormData, TransactionType } from "@/types";
import { Trash, PencilSimple, CalendarBlank, Tag, Check, X, MagnifyingGlass, Funnel } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

interface ListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: TransactionFormData) => void;
}

export const TransactionList = ({ transactions, onDelete, onUpdate }: ListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest">("newest");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const saveEdit = () => {
    if (editingId && editData) {
      onUpdate(editingId, editData);
      setEditingId(null);
      setEditData(null);
    }
  };

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.category))).sort(),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return transactions
      .filter((transaction) => {
        const matchesSearch = transaction.title.toLowerCase().includes(normalizedQuery);
        const matchesType = typeFilter === "all" || transaction.type === typeFilter;
        const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((first, second) => {
        if (sortOrder === "highest") return second.amount - first.amount;
        const firstDate = new Date(first.date).getTime();
        const secondDate = new Date(second.date).getTime();
        return sortOrder === "newest" ? secondDate - firstDate : firstDate - secondDate;
      });
  }, [categoryFilter, searchQuery, sortOrder, transactions, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">Recent History</h3>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          {filteredTransactions.length} of {transactions.length} Transactions
        </span>
      </div>

      <div className="mb-6 space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search transactions..."
            aria-label="Search transactions"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 dark:border-zinc-700 dark:bg-zinc-950">
            <Funnel size={16} className="shrink-0 text-zinc-400" />
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as "all" | TransactionType)}
              aria-label="Filter by transaction type"
              className="w-full bg-transparent py-3 text-sm text-zinc-950 outline-none dark:text-white"
            >
              <option className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" value="all">All types</option>
              <option className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" value="income">Income</option>
              <option className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" value="expense">Expense</option>
            </select>
          </label>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filter by category"
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          >
            <option className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" value="all">All categories</option>
            {categories.map((category) => <option className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" key={category} value={category}>{category}</option>)}
          </select>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest" | "highest")}
            aria-label="Sort transactions"
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          >
            <option className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" value="newest">Newest first</option>
            <option className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" value="oldest">Oldest first</option>
            <option className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" value="highest">Highest amount</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border-2 border-dashed border-zinc-100 py-20 text-center dark:border-zinc-800"
            >
              <p className="text-zinc-400 font-medium">No transactions yet. Add your first record!</p>
            </motion.div>
          ) : filteredTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border-2 border-dashed border-zinc-100 py-16 text-center dark:border-zinc-800"
            >
              <p className="font-medium text-zinc-400">No matching transactions found.</p>
            </motion.div>
          ) : (
            filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                className={`group flex items-center justify-between rounded-2xl border bg-white p-4 transition-all hover:shadow-sm dark:bg-zinc-900 ${
                  editingId === transaction.id ? 'border-zinc-950 ring-1 ring-zinc-950 dark:border-white dark:ring-white' : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                }`}
              >
{editingId === transaction.id && editData ? (
                  <div className="flex-1 flex flex-col gap-2">
                    <input 
                      className="px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-bold"
                      value={editData.title}
                      onChange={e => setEditData({...editData, title: e.target.value})}
                    />
                    <input 
                      className="w-full px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono font-bold"
                      type="number"
                      value={editData.amount}
                      onChange={e => setEditData({...editData, amount: parseFloat(e.target.value)})}
                    />
                    <input 
                      className="w-full px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                      type="date"
                      value={editData.date?.split('T')[0] || ''}
                      onChange={e => setEditData({...editData, date: e.target.value})}
                    />
                    <div className="flex gap-1 mt-1">
                      <button onClick={saveEdit} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                        <Check size={18} weight="bold" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                        <X size={18} weight="bold" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        transaction.type === 'income' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-rose-50 text-rose-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                      </div>
                      <div>
                        <h4 className="font-bold leading-tight text-zinc-950 dark:text-white">{transaction.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            <Tag size={12} />
                            {transaction.category}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            <CalendarBlank size={12} />
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className={`text-lg font-bold tracking-tighter ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-zinc-950 dark:text-white'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(transaction)}
                          className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-50 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                          <PencilSimple size={18} weight="bold" />
                        </button>
                        <button 
                          onClick={() => { if (window.confirm('Delete this transaction?')) onDelete(transaction.id); }}
                          className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash size={18} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
