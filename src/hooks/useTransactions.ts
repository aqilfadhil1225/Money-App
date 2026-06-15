"use client";

import { useState, useEffect } from "react";
import { Transaction, TransactionFormData } from "../types";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("money_transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("money_transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, data: TransactionFormData) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoaded,
  };
};
