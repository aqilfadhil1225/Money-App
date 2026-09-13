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
