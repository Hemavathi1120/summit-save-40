// Text Constants and Labels
export const TEXT = {
  // Application
  app: {
    name: 'ExpenseFlow',
    tagline: 'Premium Expense Management',
  },
  
  // Navigation and Headers
  navigation: {
    addExpense: 'Add Expense',
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    budgets: 'Budgets',
    reports: 'Reports',
    settings: 'Settings',
  },
  
  // Quick Stats
  stats: {
    totalExpenses: 'Total Expenses',
    thisMonth: 'This Month',
    dailyAverage: 'Daily Average',
    transactions: 'Transactions',
    lessSpent: 'less than last month',
    moreSpent: 'more than last month',
  },
  
  // Sections
  sections: {
    quickStats: 'Quick Statistics',
    spendingByCategory: 'Spending by Category',
    recentTrends: 'Recent Trends',
    recentExpenses: 'Recent Expenses',
    quickActions: 'Quick Actions',
  },
  
  // Forms
  forms: {
    // Expense form
    addNewExpense: 'Add New Expense',
    editExpense: 'Edit Expense',
    title: 'Title',
    amount: 'Amount',
    date: 'Date',
    category: 'Category',
    wallet: 'Wallet',
    merchant: 'Merchant (Optional)',
    notes: 'Notes (Optional)',
    
    // Placeholders
    placeholders: {
      expenseTitle: 'Coffee, lunch, gas...',
      amount: '0.00',
      selectCategory: 'Select...',
      selectWallet: 'Select wallet...',
      merchant: 'Store or restaurant name',
      notes: 'Additional details...',
      search: 'Search expenses...',
    },
    
    // Validation
    validation: {
      required: 'This field is required',
      minAmount: 'Amount must be greater than 0',
      maxAmount: 'Amount is too large',
      invalidDate: 'Please enter a valid date',
    },
  },
  
  // Actions
  actions: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    reset: 'Reset',
    export: 'Export',
    import: 'Import',
  },
  
  // Quick Actions
  quickActions: {
    setBudgets: {
      title: 'Set Budgets',
      description: 'Track spending limits',
    },
    viewReports: {
      title: 'View Reports',
      description: 'Detailed analytics',
    },
    manageWallets: {
      title: 'Manage Wallets',
      description: 'Multiple accounts',
    },
  },
  
  // Messages
  messages: {
    noExpenses: 'No expenses found',
    loadingExpenses: 'Loading expenses...',
    expenseAdded: 'Expense added successfully',
    expenseUpdated: 'Expense updated successfully',
    expenseDeleted: 'Expense deleted successfully',
    errorGeneric: 'Something went wrong. Please try again.',
    errorNetwork: 'Network error. Please check your connection.',
  },
  
  // Status
  status: {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  
  // Time periods
  periods: {
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    thisYear: 'This Year',
    lastYear: 'Last Year',
    custom: 'Custom Range',
  },
} as const;

// Currency formatting
export const CURRENCY = {
  format: (amount: number, currency = 'INR'): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },
  
  formatCompact: (amount: number, currency = 'INR'): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  },
} as const;