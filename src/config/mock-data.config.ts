import { Category, Wallet, Expense } from '@/store/expenseStore';

// Mock Categories Configuration
export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#FF6B6B', icon: '🍽️' },
  { id: '2', name: 'Transportation', color: '#4ECDC4', icon: '🚗' },
  { id: '3', name: 'Shopping', color: '#45B7D1', icon: '🛍️' },
  { id: '4', name: 'Entertainment', color: '#96CEB4', icon: '🎬' },
  { id: '5', name: 'Bills & Utilities', color: '#FFEAA7', icon: '💡' },
  { id: '6', name: 'Healthcare', color: '#DDA0DD', icon: '🏥' },
  { id: '7', name: 'Travel', color: '#98D8C8', icon: '✈️' },
  { id: '8', name: 'Education', color: '#F7DC6F', icon: '📚' },
  { id: '9', name: 'Personal Care', color: '#FFB6C1', icon: '💄' },
  { id: '10', name: 'Gifts & Donations', color: '#98FB98', icon: '🎁' },
];

// Mock Wallets Configuration
export const MOCK_WALLETS: Wallet[] = [
  { id: '1', name: 'Main Checking', balance: 180500.00, currency: 'INR' },
  { id: '2', name: 'Credit Card', balance: -62500.00, currency: 'INR' },
  { id: '3', name: 'Savings', balance: 1125000.00, currency: 'INR' },
  { id: '4', name: 'Cash Wallet', balance: 9250.00, currency: 'INR' },
];

// Mock Expenses Configuration
export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 127.43,
    date: '2024-01-15',
    categoryId: '1',
    walletId: '1',
    merchant: 'Whole Foods Market',
    notes: 'Weekly groceries',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2', 
    title: 'Gas Station',
    amount: 52.18,
    date: '2024-01-14',
    categoryId: '2',
    walletId: '2',
    merchant: 'Shell',
    notes: 'Fill up',
    createdAt: '2024-01-14T08:15:00Z'
  },
  {
    id: '3',
    title: 'Coffee Shop',
    amount: 12.50,
    date: '2024-01-14',
    categoryId: '1',
    walletId: '1',
    merchant: 'Starbucks',
    notes: 'Morning coffee',
    createdAt: '2024-01-14T07:45:00Z'
  },
  {
    id: '4',
    title: 'Netflix Subscription',
    amount: 15.99,
    date: '2024-01-13',
    categoryId: '4',
    walletId: '2',
    merchant: 'Netflix',
    notes: 'Monthly subscription',
    createdAt: '2024-01-13T00:00:00Z'
  },
  {
    id: '5',
    title: 'New Headphones',
    amount: 199.99,
    date: '2024-01-12',
    categoryId: '3',
    walletId: '1',
    merchant: 'Best Buy',
    notes: 'Sony WH-1000XM4',
    createdAt: '2024-01-12T14:20:00Z'
  },
  {
    id: '6',
    title: 'Electricity Bill',
    amount: 89.32,
    date: '2024-01-11',
    categoryId: '5',
    walletId: '1',
    merchant: 'City Electric',
    notes: 'Monthly bill',
    createdAt: '2024-01-11T09:00:00Z'
  },
  {
    id: '7',
    title: 'Movie Tickets',
    amount: 28.00,
    date: '2024-01-10',
    categoryId: '4',
    walletId: '2',
    merchant: 'AMC Theaters',
    notes: 'Weekend movie',
    createdAt: '2024-01-10T19:30:00Z'
  },
  {
    id: '8',
    title: 'Lunch',
    amount: 23.75,
    date: '2024-01-10',
    categoryId: '1',
    walletId: '1',
    merchant: 'Local Bistro',
    notes: 'Business lunch',
    createdAt: '2024-01-10T12:15:00Z'
  },
  {
    id: '9',
    title: 'Gym Membership',
    amount: 49.99,
    date: '2024-01-09',
    categoryId: '6',
    walletId: '1',
    merchant: 'FitLife Gym',
    notes: 'Monthly membership',
    createdAt: '2024-01-09T06:00:00Z'
  },
  {
    id: '10',
    title: 'Book Purchase',
    amount: 24.99,
    date: '2024-01-08',
    categoryId: '8',
    walletId: '3',
    merchant: 'Amazon',
    notes: 'Programming book',
    createdAt: '2024-01-08T14:30:00Z'
  },
];

// Data generation utilities
export const generateMockData = () => ({
  categories: MOCK_CATEGORIES,
  wallets: MOCK_WALLETS,
  expenses: MOCK_EXPENSES,
});

// Category utilities
export const getCategoryById = (id: string): Category | undefined => 
  MOCK_CATEGORIES.find(category => category.id === id);

export const getCategoryByName = (name: string): Category | undefined => 
  MOCK_CATEGORIES.find(category => category.name.toLowerCase() === name.toLowerCase());

// Wallet utilities
export const getWalletById = (id: string): Wallet | undefined => 
  MOCK_WALLETS.find(wallet => wallet.id === id);

export const getWalletByName = (name: string): Wallet | undefined => 
  MOCK_WALLETS.find(wallet => wallet.name.toLowerCase() === name.toLowerCase());