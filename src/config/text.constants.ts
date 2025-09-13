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
    totalBalance: 'Total Balance',
    totalExpenses: 'Total Expenses',
    monthlyExpenses: 'Monthly Expenses',
    savingsRate: 'Savings Rate',
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
    
    // Steps descriptions
    steps: {
      basics: 'Enter the basic details',
      details: 'Categorize your expense',
      review: 'Review and submit',
      back: 'Back',
      next: 'Continue',
      submit: 'Add Expense',
    },
    createdOn: 'Created on',
    
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
    back: 'Return',
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
    exportData: {
      title: 'Export Data',
      description: 'Download reports',
    },
  },
  
  // Messages
  messages: {
    noExpenses: 'No expenses found',
    loadingExpenses: 'Loading expenses...',
    expenseAdded: 'Expense added successfully',
    expenseUpdated: 'Expense updated successfully',
    expenseDeleted: 'Expense deleted successfully',
    confirmDelete: 'Are you sure you want to delete this expense?',
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

// New Quick Actions Structure
export const QUICK_ACTIONS = {
  title: "Quick Actions",
  subtitle: "Manage your finances with these quick actions",
  setBudgets: { 
    title: "Set Budgets",
    description: "Track spending limits"
  },
  viewReports: {
    title: "View Reports",
    description: "Detailed analytics"
  },
  manageWallets: {
    title: "Manage Wallets",
    description: "Track your accounts"
  },
  exportData: {
    title: "Export Data",
    description: "Download reports"
  }
};

// Wallet-related constants
export const WALLET = {
  form: {
    addAccount: 'Add Account',
    editAccount: 'Edit Account',
    updateButton: 'Update Account',
    subtitle: 'Manage your financial accounts',
    accountName: 'Account Name',
    accountType: 'Account Type',
    balance: 'Starting Balance',
    creditBalance: 'Current Balance (negative for debt)',
    bank: 'Bank Name (Optional)',
    currency: 'Currency',
    success: {
      added: 'Account added!',
      updated: 'Account updated!',
      addedDesc: 'Your account has been added successfully.',
      updatedDesc: 'Your account has been updated successfully.',
    },
    error: {
      title: 'Error',
      required: 'Please fill in all required fields.',
    },
    placeholders: {
      accountName: 'e.g., Primary Checking',
      bank: 'e.g., Chase, Bank of America',
      balance: '0.00',
    },
    types: [
      { value: 'checking', label: 'Checking Account' },
      { value: 'savings', label: 'Savings Account' },
      { value: 'credit', label: 'Credit Card' },
      { value: 'cash', label: 'Cash Wallet' },
    ],
  },
};

// Business-related constants
export const BUSINESS = {
  expenseForm: {
    title: "New Business Expense",
    description: "Add a new expense to your business account",
    steps: {
      basicInfo: "Basic Information",
      additionalDetails: "Additional Details",
      review: "Review & Submit"
    },
    success: "Expense submitted",
    successDescription: "Your business expense has been recorded successfully.",
    error: "Error",
    errorDescription: "Failed to submit expense. Please try again.",
    fields: {
      amount: "Amount",
      title: "Title",
      description: "Description",
      category: "Category",
      date: "Date",
      paymentMethod: "Payment Method",
      expenseType: "Expense Type",
      billable: "Billable to Client",
      projectCode: "Project Code",
      merchant: "Merchant",
      submittedBy: "Submitted By",
      approver: "Approver",
      receiptAttached: "Receipt Attached",
      taxDeductible: "Tax Deductible",
      tags: "Tags"
    },
    actions: {
      next: "Continue",
      previous: "Back",
      submit: "Submit Expense",
      cancel: "Cancel"
    }
  },
  tags: ["Travel", "Client Meeting", "Office", "Software", "Marketing", "Conference", "Training"]
};