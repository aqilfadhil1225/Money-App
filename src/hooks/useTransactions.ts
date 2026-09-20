"use client";

import { useState, useEffect } from 'react';
import { Budget, BudgetFormData, Transaction, TransactionFormData } from '../types';

const readStorage = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedTransactions = readStorage<Transaction[]>('money_transactions');
      const savedBudgets = readStorage<Budget[]>('money_budgets');

      if (savedTransactions) {
        setTransactions(savedTransactions);
      }

      if (savedBudgets) {
        setBudgets(savedBudgets);
      }

      setIsLoaded(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem('money_transactions', JSON.stringify(transactions));
  }, [transactions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem('money_budgets', JSON.stringify(budgets));
  }, [budgets, isLoaded]);

  const addTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, data: TransactionFormData) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addBudget = (data: BudgetFormData) => {
    const budget: Budget = {
      ...data,
      id: crypto.randomUUID(),
    };

    setBudgets((prev) => {
      const filtered = prev.filter((item) => !(item.category === data.category && item.month === data.month));
      return [budget, ...filtered];
    });
  };

  const updateBudget = (id: string, data: BudgetFormData) => {
    setBudgets((prev) =>
      prev.map((budget) => (budget.id === id ? { ...budget, ...data } : budget))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  return {
    transactions,
    budgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    isLoaded,
  };
};
