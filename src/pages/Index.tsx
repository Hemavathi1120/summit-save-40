import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PieChart, Wallet, Target, TrendingUp, Calendar, Filter, Search } from 'lucide-react';
import FilterModal from '@/components/FilterModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  const navigate = useNavigate();

  useEffect(() => {
    // Load mock data on first visit
    loadMockData();
  }, [loadMockData]);

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
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow float">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{APP_CONFIG.name}</h1>
              <p className="text-sm text-muted-foreground">Premium expense tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-xl border-2"
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>
            <Button 
              variant="default" 
              size="lg" 
              className="btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-semibold px-6"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              {TEXT.navigation.addExpense}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Quick Stats Grid */}
        <QuickStats />

        {/* Enhanced Charts Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold gradient-text">Financial Insights</h2>
            <p className="text-muted-foreground">Track your spending patterns and trends</p>
          </div>
          
          <div className={`grid ${APP_CONFIG.ui.chartsGrid} gap-8`}>
            <Card className="card-glass rounded-2xl p-8 hover-lift hover-glow border-2 border-border/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">{TEXT.sections.spendingByCategory}</h3>
              </div>
              <CategoryChart />
            </Card>

            <Card className="card-glass rounded-2xl p-8 hover-lift hover-glow border-2 border-border/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{TEXT.sections.recentTrends}</h3>
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
            
            <ExpenseList expenses={filteredExpenses} />
          </Card>
        </section>

        {/* Enhanced Quick Actions */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Quick Actions</h2>
            <p className="text-muted-foreground">Manage your finances with powerful tools</p>
          </div>
          
          <div className={`grid ${APP_CONFIG.ui.quickActionsGrid} gap-6`}>
            <Card 
              className="card-glass rounded-2xl p-6 hover-lift hover-glow cursor-pointer group border-2 border-border/20 transition-all duration-300"
              onClick={() => navigate('/budgets')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{TEXT.quickActions.setBudgets.title}</h4>
                  <p className="text-muted-foreground">{TEXT.quickActions.setBudgets.description}</p>
                </div>
              </div>
            </Card>

            <Card 
              className="card-glass rounded-2xl p-6 hover-lift hover-glow cursor-pointer group border-2 border-border/20 transition-all duration-300"
              onClick={() => navigate('/analytics')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PieChart className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{TEXT.quickActions.viewReports.title}</h4>
                  <p className="text-muted-foreground">{TEXT.quickActions.viewReports.description}</p>
                </div>
              </div>
            </Card>

            <Card 
              className="card-glass rounded-2xl p-6 hover-lift hover-glow cursor-pointer group border-2 border-border/20 transition-all duration-300"
              onClick={() => navigate('/wallets')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{TEXT.quickActions.manageWallets.title}</h4>
                  <p className="text-muted-foreground">{TEXT.quickActions.manageWallets.description}</p>
                </div>
              </div>
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