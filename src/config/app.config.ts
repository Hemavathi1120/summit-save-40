// Application Configuration
export const APP_CONFIG = {
  // Application metadata
  name: 'ExpenseFlow',
  version: '1.0.0',
  description: 'Premium Expense Management Application',
  
  // UI Configuration
  ui: {
    // Layout
    maxWidth: 'container',
    headerHeight: 16, // h-16
    
    // Search
    searchInputWidth: 'w-64',
    searchPlaceholder: 'Search expenses...',
    
    // Grid layouts
    statsGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    chartsGrid: 'grid-cols-1 lg:grid-cols-2',
    quickActionsGrid: 'grid-cols-1 md:grid-cols-3',
    
    // Animation delays
    staggerDelay: 100, // milliseconds
    
    // Display limits
    maxTrendCategories: 4,
    maxRecentExpenses: 10,
    
    // Form configuration
    form: {
      maxTitleLength: 100,
      maxNotesLength: 500,
      maxMerchantLength: 100,
      amountStep: 0.01,
      maxAmount: 999999.99,
    },
  },
  
  // Features
  features: {
    budgets: true,
    reports: true,
    multipleWallets: true,
    receipts: true,
    categories: true,
    search: true,
    filters: true,
    darkMode: true,
  },
  
  // Default settings
  defaults: {
    currency: 'USD',
    dateFormat: 'YYYY-MM-DD',
    locale: 'en-US',
    theme: 'system',
  },
} as const;

// Theme configuration
export const THEME_CONFIG = {
  colors: {
    brand: {
      primary: 'electric-blue',
      secondary: 'platinum',
      accent: 'charcoal',
    },
    status: {
      success: 'success',
      warning: 'warning',
      error: 'error',
    },
  },
  
  gradients: {
    primary: 'gradient-primary',
    glass: 'gradient-glass',
    subtle: 'gradient-subtle',
  },
  
  effects: {
    glass: 'card-glass',
    hover: 'hover-lift',
    premium: 'btn-premium',
  },
} as const;