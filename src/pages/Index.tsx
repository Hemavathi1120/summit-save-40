import { useState, useEffect } from 'react';
import { useNavigate } from '../hooks/use-navigation';
import { Plus, PieChart, Wallet, Target, TrendingUp, Calendar, Filter, Search, FileText } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import FilterModal from '@/components/FilterModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ThemeToggle';
import ExpenseForm from '@/components/ExpenseForm';
import QuickStats from '@/components/QuickStats';
import ExpenseList from '@/components/ExpenseList';
import CategoryChart from '@/components/CategoryChart';
import { useExpenseStore } from '@/store/expenseStore';
import { APP_CONFIG } from '@/config/app.config';
import { TEXT } from '@/config/text.constants';

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const { expenses, categories, loadMockData } = useExpenseStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load mock data on first visit
    loadMockData();
    setIsLoading(false);
  }, [loadMockData]);
  
  // Calculate total balance from expenses
  const totalBalance = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply additional filters if they exist
    let matchesFilters = true;
    if (appliedFilters.category && appliedFilters.category !== 'all') {
      matchesFilters = matchesFilters && expense.categoryId === appliedFilters.category;
    }
    if (appliedFilters.merchant) {
      matchesFilters = matchesFilters && expense.merchant.toLowerCase().includes(appliedFilters.merchant.toLowerCase());
    }
    
    return matchesSearch && matchesFilters;
  });

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Hero Header with Enhanced Gradient */}
      <header className="sticky top-0 z-50 border-b border-border/30 glass bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton 
              destination="/" 
              size="md"
              variant="subtle"
              className="hover:shadow-md"
            />
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow float">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">ExpenseFlow</h1>
              <p className="text-sm text-muted-foreground">Premium expense tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="lg" 
              className="h-11 px-8 rounded-xl border-2"
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>
            <Button 
              variant="default" 
              size="lg" 
              className="h-11 rounded-md btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-semibold px-6"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
        {/* Quick Stats Grid */}
        <QuickStats totalBalance={totalBalance} expenses={expenses} isLoading={isLoading} />
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Enhanced Charts Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold gradient-text">Financial Insights</h2>
            <p className="text-muted-foreground">Track your spending patterns and trends</p>
          </div>
          
          <div className={`grid ${APP_CONFIG.ui.chartsGrid} gap-8`}>
            <Card className="card-glass rounded-2xl p-8 hover-lift hover-glow border-2 border-border/20 dark:border-border/30 bg-card dark:bg-card/95">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground dark:text-foreground/90">{TEXT.sections.spendingByCategory}</h3>
              </div>
              <CategoryChart />
            </Card>

            <Card className="card-glass rounded-2xl p-8 hover-lift hover-glow border-2 border-border/20 dark:border-border/30 bg-card dark:bg-card/95">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary dark:text-primary/90" />
                </div>
                <h3 className="text-xl font-bold text-foreground dark:text-foreground/90">{TEXT.sections.recentTrends}</h3>
              </div>
              <div className="space-y-5">
                {categories.slice(0, APP_CONFIG.ui.maxTrendCategories).map((category, index) => {
                  const categoryExpenses = expenses.filter(e => e.categoryId === category.id);
                  const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                  return (
                    <div key={category.id} className="stagger-item p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors" style={{ animationDelay: `${index * APP_CONFIG.ui.staggerDelay}ms` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: category.color }}></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="font-semibold px-3 py-1">₹{total.toLocaleString('en-IN')}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>

        {/* Enhanced Expenses Section */}
        <section className="space-y-6">
          <Card className="card-glass rounded-2xl p-8 border-2 border-border/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{TEXT.sections.recentExpenses}</h3>
                  <p className="text-sm text-muted-foreground">Manage your transactions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={TEXT.forms.placeholders.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-12 pr-4 py-3 ${APP_CONFIG.ui.searchInputWidth} rounded-xl border-2 border-input-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300 font-medium`}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="btn-premium rounded-xl border-2 hover-glow"
                  onClick={() => setShowFilterModal(true)}
                >
                  <Filter className="w-5 h-5 mr-2" />
                  {TEXT.actions.filter}
                </Button>
              </div>
            </div>
            
            <ExpenseList expenses={filteredExpenses} isLoading={false} />
          </Card>
        </section>

        {/* Enhanced Quick Actions - New Design by HEMAVATHI from Dream Team Services */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Quick Actions</h2>
              <p className="text-muted-foreground">Take control of your finances</p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              View All
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Budget Card */}
            <Card 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-primary/5 dark:border-primary/10 group cursor-pointer bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 dark:from-primary/10 dark:to-transparent dark:hover:from-primary/20 backdrop-blur-sm"
              onClick={() => navigate('/budgets')}
            >
              <CardContent className="p-0">
                <div className="relative p-6">
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary/20 dark:bg-primary/30 group-hover:bg-primary/30 dark:group-hover:bg-primary/40 transition-colors duration-300" />
                  <div className="mb-6 relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{TEXT.quickActions.setBudgets.title}</h3>
                  <p className="text-muted-foreground text-sm">{TEXT.quickActions.setBudgets.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Card */}
            <Card 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-secondary/5 dark:border-secondary/10 group cursor-pointer bg-gradient-to-br from-secondary/5 to-transparent hover:from-secondary/10 dark:from-secondary/10 dark:to-transparent dark:hover:from-secondary/20 backdrop-blur-sm"
              onClick={() => navigate('/analytics')}
            >
              <CardContent className="p-0">
                <div className="relative p-6">
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-secondary/10 dark:bg-secondary/20 group-hover:bg-secondary/20 dark:group-hover:bg-secondary/30 transition-colors duration-300" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-secondary/20 dark:bg-secondary/30 group-hover:bg-secondary/30 dark:group-hover:bg-secondary/40 transition-colors duration-300" />
                  <div className="mb-6 relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">{TEXT.quickActions.viewReports.title}</h3>
                  <p className="text-muted-foreground text-sm">{TEXT.quickActions.viewReports.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Wallets Card */}
            <Card 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-500/5 dark:border-blue-500/10 group cursor-pointer bg-gradient-to-br from-blue-500/5 to-transparent hover:from-blue-500/10 dark:from-blue-500/10 dark:to-transparent dark:hover:from-blue-500/20 backdrop-blur-sm"
              onClick={() => navigate('/wallets')}
            >
              <CardContent className="p-0">
                <div className="relative p-6">
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-blue-500/10 dark:bg-blue-500/20 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors duration-300" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-blue-500/20 dark:bg-blue-500/30 group-hover:bg-blue-500/30 dark:group-hover:bg-blue-500/40 transition-colors duration-300" />
                  <div className="mb-6 relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600/70 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">{TEXT.quickActions.manageWallets.title}</h3>
                  <p className="text-muted-foreground text-sm">{TEXT.quickActions.manageWallets.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* New Export Card */}
            <Card 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-emerald-500/5 dark:border-emerald-500/10 group cursor-pointer bg-gradient-to-br from-emerald-500/5 to-transparent hover:from-emerald-500/10 dark:from-emerald-500/10 dark:to-transparent dark:hover:from-emerald-500/20 backdrop-blur-sm"
              onClick={() => navigate('/profile')}
            >
              <CardContent className="p-0">
                <div className="relative p-6">
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/30 transition-colors duration-300" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 group-hover:bg-emerald-500/30 dark:group-hover:bg-emerald-500/40 transition-colors duration-300" />
                  <div className="mb-6 relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600/70 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-500 transition-colors">{TEXT.quickActions.exportData.title}</h3>
                  <p className="text-muted-foreground text-sm">{TEXT.quickActions.exportData.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Add Expense Modal */}
      {showAddForm && (
        <ExpenseForm onClose={() => setShowAddForm(false)} />
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal 
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default Index;