export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface TransactionFormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string;
}

export interface BudgetFormData {
  category: string;
  limit: number;
  month: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  currentAmount: number;
  deadline: string;
}

export interface GoalFormData {
  name: string;
  target: number;
  currentAmount: number;
  deadline: string;
}

export interface AppData {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
}

export interface BackupFile {
  version: 1;
  exportedAt: string;
  data: AppData;
}
