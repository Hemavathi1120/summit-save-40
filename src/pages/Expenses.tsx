import React, { useState } from 'react';
import { useNavigate } from '../hooks/use-navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  PieChart,
  Download,
  Upload
} from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import FilterModal from '@/components/FilterModal';
import { exportToCSV, exportToJSON, importFromCSV } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import CategoryChart from '@/components/CategoryChart';
import QuickStats from '@/components/QuickStats';
import { useExpenseStore } from '@/store/expenseStore';
import { TEXT, CURRENCY } from '@/config/text.constants';

export default function Expenses() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const navigate = useNavigate();
  
  const { expenses, categories } = useExpenseStore();

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.categoryId === filterCategory;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          matchesDate = expenseDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = expenseDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = expenseDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageTransaction = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;

  const handleExportCSV = () => {
    const exportData = filteredExpenses.map(expense => ({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      categoryName: categories.find(c => c.id === expense.categoryId)?.name || 'Unknown',
      merchant: expense.merchant,
      notes: expense.notes
    }));
    
    exportToCSV(exportData, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportJSON = () => {
    const exportData = filteredExpenses.map(expense => ({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      categoryName: categories.find(c => c.id === expense.categoryId)?.name || 'Unknown',
      merchant: expense.merchant,
      notes: expense.notes
    }));
    
    exportToJSON(exportData, `expenses-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await importFromCSV(file);
          // Here you would save the imported expenses to your store/Firebase
        } catch (error) {
          console.error('Import failed:', error);
        }
      }
    };
    input.click();
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    setFilterCategory(filters.category);
    setDateRange(filters.dateRange);
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 glass bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton 
              destination="/" 
              size="md"
              variant="subtle"
              className="hover:shadow-md"
            />
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow float">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Expense Management</h1>
              <p className="text-sm text-muted-foreground">Track and analyze your spending</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-premium rounded-xl border-2"
                onClick={handleExportCSV}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-premium rounded-xl border-2"
                onClick={handleImport}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
            <Button 
              variant="default" 
              size="lg" 
              className="btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-semibold px-6"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-8">
        {/* Overview Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{filteredExpenses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
          
          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-2xl font-bold">₹{averageTransaction.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                <PieChart className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </section>

        {/* Filters Section */}
        <section>
          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-input-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300"
                  />
                </div>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48 rounded-xl border-2 h-12">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-36 rounded-xl border-2 h-12">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-semibold">
                  {filteredExpenses.length} results
                </Badge>
              </div>
            </div>
          </Card>
        </section>

        {/* Chart Section */}
        <section>
          <Card className="card-glass rounded-2xl p-8 border-2 border-border/20">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <PieChart className="h-4 w-4 text-white" />
                </div>
                Spending by Category
              </CardTitle>
              <CardDescription>
                Visual breakdown of your expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <CategoryChart />
            </CardContent>
          </Card>
        </section>

        {/* Expenses List */}
        <section>
          <Card className="card-glass rounded-2xl border-2 border-border/20">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest expense entries</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ExpenseList expenses={filteredExpenses} isLoading={false} />
            </CardContent>
          </Card>
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
}