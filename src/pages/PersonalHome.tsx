import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, CircleDollarSign, PiggyBank, Target, TrendingUp, User, Wallet } from 'lucide-react';

// Mock text constants
const text = {
  quickActions: {
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
  }
};

// Import the currency formatting utility
import { CURRENCY } from '@/config/text.constants';

// Utility functions
const formatCurrency = (amount: number) => {
  return CURRENCY.format(amount);
};

// Mock components
const WalletList = ({ wallets, isLoading, compact }: { wallets: any[]; isLoading: boolean; compact?: boolean }) => {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <p>Loading wallets...</p>
      ) : wallets.map((wallet) => (
        <div key={wallet.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: wallet.color }}></div>
            <span>{wallet.name}</span>
          </div>
          <span className={`font-medium ${wallet.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatCurrency(wallet.balance)}
          </span>
        </div>
      ))}
    </div>
  );
};

const MonthlyChart = ({ expenses, isLoading }: { expenses: any[]; isLoading: boolean }) => {
  return (
    <div className="flex items-center justify-center h-full">
      {isLoading ? (
        <p>Loading chart...</p>
      ) : (
        <div className="text-center">
          <p>Monthly spending chart placeholder</p>
          <p className="text-muted-foreground text-sm">Monthly expense data visualization</p>
        </div>
      )}
    </div>
  );
};

const CategoryChart = ({ expenses, isLoading, type }: { expenses: any[]; isLoading: boolean; type?: string }) => {
  return (
    <div className="flex items-center justify-center h-full">
      {isLoading ? (
        <p>Loading chart...</p>
      ) : (
        <div className="text-center">
          <p>{type === 'doughnut' ? 'Category breakdown chart placeholder' : 'Category chart placeholder'}</p>
          <p className="text-muted-foreground text-sm">Expense categories visualization</p>
        </div>
      )}
    </div>
  );
};

const ExpenseList = ({ expenses, isLoading, showFilters, className }: { expenses: any[]; isLoading: boolean; showFilters?: boolean; className?: string }) => {
  return (
    <div className={className || ""}>
      {isLoading ? (
        <p className="p-6 text-center">Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p className="p-6 text-center text-muted-foreground">No expenses found</p>
      ) : (
        <div className="divide-y divide-border/30">
          {expenses.map((expense) => (
            <div key={expense.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{expense.title}</p>
                <p className="text-xs text-muted-foreground">{expense.category} • {expense.date.toLocaleDateString()}</p>
              </div>
              <span className="font-semibold">{formatCurrency(expense.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuickStats = ({ totalBalance, expenses, isLoading }: { totalBalance: number; expenses: any[]; isLoading: boolean }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 rounded-xl shadow-glow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold">{isLoading ? "..." : formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-2 border-purple-500/20 rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <CircleDollarSign className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
              <p className="text-2xl font-bold">{isLoading ? "..." : formatCurrency(18500)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-500/20 rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
              <p className="text-2xl font-bold">{isLoading ? "..." : "65%"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Mock hooks
const useExpenses = () => {
  return {
    expenses: [
      { id: 1, title: "Groceries", amount: 125.50, category: "Food", date: new Date() },
      { id: 2, title: "Internet Bill", amount: 79.99, category: "Utilities", date: new Date() },
      { id: 3, title: "Movie Tickets", amount: 45.00, category: "Entertainment", date: new Date() }
    ],
    isLoading: false,
    error: null,
  };
};

const useWallets = () => {
  return {
    wallets: [
      { id: 1, name: "Cash", balance: 500, color: "#4CAF50" },
      { id: 2, name: "Bank Account", balance: 2500, color: "#2196F3" },
      { id: 3, name: "Credit Card", balance: -350, color: "#F44336" }
    ],
    isLoading: false,
    error: null,
  };
};

const useNavigate = () => (path: string) => console.log(`Navigating to: ${path}`);
const useAuth = () => ({ userProfile: { displayName: "User", email: "user@example.com" }, currentUser: { email: "user@example.com" } });
const useToast = () => ({ toast: ({ title, description }: { title: string; description: string }) => console.log(`Toast: ${title} - ${description}`) });
const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
  <a href={to} className={className}>{children}</a>
);

export default function PersonalHome() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { expenses, isLoading: isLoadingExpenses, error: expensesError } = useExpenses();
  const { wallets, isLoading: isLoadingWallets, error: walletsError } = useWallets();
  const [activeTab, setActiveTab] = useState("overview");
  const [greeting, setGreeting] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);
  
  useEffect(() => {
    setGreeting(getGreeting());
    
    if (expensesError) {
      toast({
        title: "Error loading expenses",
        description: expensesError
      });
    }
    
    if (walletsError) {
      toast({
        title: "Error loading wallets",
        description: walletsError
      });
    }
  }, [getGreeting, expensesError, walletsError, toast]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const totalBalance = wallets?.reduce((acc, wallet) => acc + wallet.balance, 0) || 0;
  const recentExpenses = expenses?.slice(0, 5) || [];
  
  return (
    <div className="page-enter relative">
      {/* Floating Back Button - Only shows when header is out of view */}
      {scrolled && (
        <div className="fixed bottom-6 left-6 z-50" style={{
          animation: 'fadeIn 0.3s ease-in-out',
          opacity: 1
        }}>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="rounded-full p-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
            title="Back to top"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </Button>
        </div>
      )}
      
      {/* Enhanced Header Section with Improved Back Button */}
      <section className="bg-gradient-to-b from-background to-muted/30 border-b sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="container px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="rounded-xl border-2 border-blue-200/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all shadow-sm hover:shadow-md flex items-center gap-2 px-4 py-2 h-auto"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </div>
                <span className="font-medium">Back to Dashboard</span>
              </Button>
              
              <div className="h-6 w-px bg-border mx-1"></div>
              
              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full hidden md:block">
                Personal Account
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-2 hover:bg-accent/70 transition-all"
                onClick={() => navigate('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
          
          <div className="mt-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {greeting}, {userProfile?.displayName || 'User'}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Enhanced QuickStats Component */}
        </div>
      </section>
      
      {/* Welcome Banner with QuickStats */}
      <div className="container px-6 pt-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 p-6 rounded-2xl shadow-sm border border-blue-500/10 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div>
              <h2 className="font-semibold text-xl">Welcome to your Personal Dashboard</h2>
              <p className="text-sm text-muted-foreground mt-1">Track your expenses, monitor budgets, and achieve your financial goals</p>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/80 dark:bg-background/80 backdrop-blur-sm rounded-lg border-blue-300/30 hover:border-blue-400/50 transition-all hover:shadow-md"
              onClick={() => navigate('/expenses')}
            >
              View All Transactions
            </Button>
          </div>
        </div>
        
        <div className="mt-4 mb-8 animate-fadeIn">
          <QuickStats totalBalance={totalBalance} expenses={expenses || []} isLoading={isLoadingExpenses || isLoadingWallets} />
        </div>
      </div>

      <div className="container px-6 py-8">
        {/* Enhanced Quick Actions */}
        <section className="mb-12 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                {text.quickActions.title}
              </h2>
              <p className="text-muted-foreground">{text.quickActions.subtitle}</p>
            </div>
            <div 
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              View All
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Set Budgets */}
            <div 
              onClick={() => navigate('/budgets')}
              className="group relative overflow-hidden rounded-2xl bg-background/80 hover:bg-accent/30 border-2 border-border/20 h-[160px] p-6 flex flex-col justify-between transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-bl from-primary/20 to-primary/5 -mr-20 -mt-20 blur-xl group-hover:blur-lg transition-all"></div>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all shadow-sm">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{text.quickActions.setBudgets.title}</h3>
                <p className="text-sm text-muted-foreground">{text.quickActions.setBudgets.description}</p>
              </div>
            </div>

            {/* View Reports */}
            <div 
              onClick={() => navigate('/analytics')}
              className="group relative overflow-hidden rounded-2xl bg-background/80 hover:bg-accent/30 border-2 border-border/20 h-[160px] p-6 flex flex-col justify-between transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-bl from-purple-500/20 to-purple-500/5 -mr-20 -mt-20 blur-xl group-hover:blur-lg transition-all"></div>
              <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-all shadow-sm">
                <BarChart className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-purple-500 transition-colors">{text.quickActions.viewReports.title}</h3>
                <p className="text-sm text-muted-foreground">{text.quickActions.viewReports.description}</p>
              </div>
            </div>

            {/* Manage Wallets */}
            <div 
              onClick={() => navigate('/wallets')}
              className="group relative overflow-hidden rounded-2xl bg-background/80 hover:bg-accent/30 border-2 border-border/20 h-[160px] p-6 flex flex-col justify-between transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-bl from-blue-500/20 to-blue-500/5 -mr-20 -mt-20 blur-xl group-hover:blur-lg transition-all"></div>
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all shadow-sm">
                <Wallet className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-blue-500 transition-colors">{text.quickActions.manageWallets.title}</h3>
                <p className="text-sm text-muted-foreground">{text.quickActions.manageWallets.description}</p>
              </div>
            </div>
            
            {/* Export Data */}
            <div 
              onClick={() => navigate('/export')}
              className="group relative overflow-hidden rounded-2xl bg-background/80 hover:bg-accent/30 border-2 border-border/20 h-[160px] p-6 flex flex-col justify-between transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-bl from-green-500/20 to-green-500/5 -mr-20 -mt-20 blur-xl group-hover:blur-lg transition-all"></div>
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-all shadow-sm">
                <AreaChart className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-green-500 transition-colors">{text.quickActions.exportData.title}</h3>
                <p className="text-sm text-muted-foreground">{text.quickActions.exportData.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Dashboard Content */}
        <section>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8 animate-fadeIn">
            <div className="border-b mb-6">
              <TabsList className="w-full md:w-auto bg-transparent mb-[-2px]">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-6 pb-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-primary" />
                    </div>
                    Overview
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="spending" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-6 pb-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <BarChart className="h-3 w-3 text-purple-500" />
                    </div>
                    Spending
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="wallets" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-6 pb-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Wallet className="h-3 w-3 text-blue-500" />
                    </div>
                    Wallets
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TabsContent value="overview" className="lg:col-span-2 space-y-8">
              <Card className="border-2 border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5">
                <CardContent className="p-0">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-semibold">Monthly Spending Trends</h3>
                      </div>
                      <select className="text-xs bg-background border rounded-md px-2 py-1.5 text-muted-foreground">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                        <option>Last 3 Months</option>
                      </select>
                    </div>
                    <div className="h-[300px]">
                      <MonthlyChart expenses={expenses || []} isLoading={isLoadingExpenses} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5">
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                        </div>
                        <h3 className="font-semibold">Recent Transactions</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 rounded-lg border-blue-200/50 hover:border-blue-300/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20" 
                        onClick={() => navigate('/expenses')}
                      >
                        View All
                      </Button>
                    </div>
                    <div className="flex mt-3 gap-4">
                      <div className="text-center px-3 py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                        <p className="text-xs text-muted-foreground">Income</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">+{formatCurrency(36750)}</p>
                      </div>
                      <div className="text-center px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                        <p className="text-xs text-muted-foreground">Expenses</p>
                        <p className="font-semibold text-red-600 dark:text-red-400">-{formatCurrency(19200)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto scrollbar-thin">
                    <ExpenseList 
                      expenses={recentExpenses} 
                      isLoading={isLoadingExpenses}
                      showFilters={false}
                      className="overflow-y-auto"
                    />
                    {/* Removed duplicate "View All Transactions" button */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spending" className="lg:col-span-2 space-y-8">
              <Card className="border-2 border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Spending by Category</h3>
                    </div>
                    <select className="text-xs bg-background border rounded-md px-2 py-1.5 text-muted-foreground">
                      <option>Last 30 Days</option>
                      <option>This Month</option>
                      <option>Last 90 Days</option>
                    </select>
                  </div>
                  <div className="h-[300px]">
                    <CategoryChart expenses={expenses || []} isLoading={isLoadingExpenses} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5">
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Smart Insights & Recommendations</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/40 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Your top category this month is Food & Dining</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            You've spent {formatCurrency(23500)} on restaurants and groceries this month.
                          </p>
                          <div className="mt-2 w-full bg-amber-200/50 dark:bg-amber-700/30 h-2 rounded-full">
                            <div className="h-2 rounded-full bg-amber-500" style={{ width: '75%' }}></div>
                          </div>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">75% of your food budget</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center shrink-0">
                          <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">You're saving more than last month</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your spending is <span className="text-green-600 dark:text-green-400 font-medium">15% lower</span> compared to the previous month.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">Last month</span>
                            <div className="flex-1 h-2 bg-blue-200/50 dark:bg-blue-700/30 rounded-full">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <span className="text-xs font-medium">{formatCurrency(110000)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">This month</span>
                            <div className="flex-1 h-2 bg-blue-200/50 dark:bg-blue-700/30 rounded-full">
                              <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-xs font-medium">{formatCurrency(93500)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/40 flex items-center justify-center shrink-0">
                          <CircleDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Create a budget to track your spending</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Setting up budgets can help you manage your finances better and reach your financial goals faster.
                          </p>
                          <Button 
                            size="sm" 
                            className="mt-2 h-8 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => navigate('/budgets')}
                          >
                            Create Budget
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallets" className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-border/20 rounded-xl shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-blue-500" />
                      </div>
                      <h3 className="font-semibold">Wallet Summary</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-muted/40 rounded-lg">
                        <span className="text-muted-foreground">Total Wallets</span>
                        <span className="font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded-md text-blue-700 dark:text-blue-400">{wallets?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/60 rounded-lg">
                        <span className="text-muted-foreground">Total Balance</span>
                        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{formatCurrency(totalBalance)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/40 rounded-lg">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="text-sm text-muted-foreground">Just now</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate('/wallets/new')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Add New Wallet
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-border/20 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 8v4M12 16h.01"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold">Wallet Management Tips</h3>
                    </div>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3 p-2 bg-muted/40 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5 shrink-0">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                        </div>
                        <span>Create separate wallets for different expense categories to better track spending</span>
                      </li>
                      <li className="flex items-start gap-3 p-2 bg-muted/40 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5 shrink-0">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                        </div>
                        <span>Update wallet balances regularly for accurate tracking of your finances</span>
                      </li>
                      <li className="flex items-start gap-3 p-2 bg-muted/40 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5 shrink-0">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                        </div>
                        <span>Link your budgets to specific wallets for more effective financial management</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5 mt-4">
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold">Your Financial Accounts</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 rounded-lg border-blue-200/50 hover:border-blue-300/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                        onClick={() => navigate('/wallets')}
                      >
                        Manage All
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-100 dark:border-blue-900/50">
                        <div className="flex justify-between mb-2">
                          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Total Assets</p>
                          <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700 dark:text-blue-300">
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-blue-800 dark:text-blue-300">{formatCurrency(220000)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 border border-red-100 dark:border-red-900/50">
                        <div className="flex justify-between mb-2">
                          <p className="text-sm text-red-700 dark:text-red-400 font-medium">Total Liabilities</p>
                          <div className="w-6 h-6 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-700 dark:text-red-300">
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-red-800 dark:text-red-300">{formatCurrency(25700)}</p>
                      </div>
                    </div>
                    <WalletList 
                      wallets={wallets || []} 
                      isLoading={isLoadingWallets}
                      compact 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Right Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5">
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold">Your Account</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-4 p-3 bg-muted/40 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {userProfile?.displayName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{userProfile?.displayName || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{userProfile?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl mb-4">
                      <h4 className="text-sm font-medium mb-2">Expense Categories</h4>
                      <div className="h-[180px]">
                        <CategoryChart expenses={expenses || []} isLoading={isLoadingExpenses} type="doughnut" />
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-lg border-purple-200/50 hover:border-purple-300/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
                      onClick={() => navigate('/profile')}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5">
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                          <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                          <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Savings Progress</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Monthly Target</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(15000)} / {formatCurrency(22500)}</span>
                      </div>
                      <div className="w-full h-3 bg-muted/60 rounded-full overflow-hidden">
                        <div className="h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '66%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">66% complete</span>
                        <span className="text-xs text-green-600 dark:text-green-400">{formatCurrency(7500)} to go</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800/60 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">You're on track!</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Keep going to meet your goal
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-lg border-green-200/50 hover:border-green-300/50 hover:bg-green-50/50 dark:hover:bg-green-900/20"
                    >
                      Adjust Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gradient-to-b from-transparent to-accent/5">
                <CardContent className="p-0">
                  <div className="p-6 border-b bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold">Top Expenses</h3>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">This Month</span>
                    </div>
                  </div>
                  <div className="divide-y divide-border/10">
                    {isLoadingExpenses ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="w-3/5 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-1/5 h-4 bg-muted rounded animate-pulse"></div>
                          </div>
                          <div className="w-2/5 h-3 bg-muted/70 rounded animate-pulse mt-2"></div>
                        </div>
                      ))
                    ) : expenses && expenses.length > 0 ? (
                      expenses.slice(0, 3).map((expense) => (
                        <div key={expense.id} className="p-4 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigate(`/expenses/${expense.id}`)}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate" style={{ maxWidth: '70%' }}>{expense.title}</span>
                            <span className="font-semibold text-blue-700 dark:text-blue-400">{formatCurrency(expense.amount)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{expense.category} • {expense.date.toLocaleDateString()}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-sm text-muted-foreground">No expenses found</p>
                      </div>
                    )}
                    <div className="p-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full rounded-lg border-blue-200/50 hover:border-blue-300/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                        onClick={() => navigate('/expenses')}
                      >
                        View All Transactions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}