import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateMockData } from '@/config/mock-data.config';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  walletId: string;
  merchant: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface ExpenseStore {
  expenses: Expense[];
  categories: Category[];
  wallets: Wallet[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  loadMockData: () => void;
}

// Mock data is now imported from config

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      categories: [],
      wallets: [],

      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updates } : expense
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },

      loadMockData: () => {
        const { expenses, categories, wallets } = get();
        // Only load mock data if store is empty
        if (expenses.length === 0) {
          const mockData = generateMockData();
          set({
            expenses: mockData.expenses,
            categories: mockData.categories,
            wallets: mockData.wallets,
          });
        }
      },
    }),
    {
      name: 'expense-store',
      partialize: (state) => ({
        expenses: state.expenses,
        categories: state.categories,
        wallets: state.wallets,
      }),
    }
  )
);