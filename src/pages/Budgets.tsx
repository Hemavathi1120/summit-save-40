import React, { useState } from 'react';
import { useNavigate } from '../hooks/use-navigation';
import { BackButton } from '@/components/ui/back-button';
import { 
  Target,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import BudgetForm from '@/components/BudgetForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useExpenseStore } from '@/store/expenseStore';
import { TEXT, CURRENCY } from '@/config/text.constants';

interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
}

export default function Budgets() {
  const navigate = useNavigate();
  const { expenses, categories } = useExpenseStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  // Mock budgets data - in a real app this would come from a store/API
  const [budgets] = useState<Budget[]>([
    {
      id: '1',
      categoryId: '1',
      categoryName: 'Food & Dining',
      categoryColor: '#3B82F6',
      limit: 12000,
      spent: 9750,
      period: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '2',
      categoryId: '2', 
      categoryName: 'Transportation',
      categoryColor: '#10B981',
      limit: 4500,
      spent: 6300,
      period: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '3',
      categoryId: '3',
      categoryName: 'Entertainment',
      categoryColor: '#F59E0B',
      limit: 3000,
      spent: 2250,
      period: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '4',
      categoryId: '4',
      categoryName: 'Shopping',
      categoryColor: '#EF4444',
      limit: 7500,
      spent: 4800,
      period: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    }
  ]);

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'destructive', icon: AlertTriangle };
    if (percentage >= 80) return { status: 'warning', color: 'secondary', icon: AlertTriangle };
    return { status: 'good', color: 'default', icon: CheckCircle };
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
  };

  const handleDeleteBudget = (budgetId: string) => {
    // Here you would delete from Firebase
    toast({
      title: 'Budget deleted!',
      description: 'The budget has been removed successfully.',
    });
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
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Budget Management</h1>
              <p className="text-sm text-muted-foreground">Track your spending limits and goals</p>
            </div>
          </div>
          
          <Button 
            variant="default" 
            size="lg" 
            className="btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-semibold px-6"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Budget
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">{CURRENCY.format(totalBudget)}</p>
              </div>
            </div>
          </Card>

          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">{CURRENCY.format(totalSpent)}</p>
              </div>
            </div>
          </Card>

          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">{CURRENCY.format(totalRemaining)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Budget List */}
        <Card className="card-glass rounded-2xl border-2 border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              Monthly Budgets
            </CardTitle>
            <CardDescription>
              Monitor your spending against set limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgets.map((budget, index) => {
                const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                const status = getBudgetStatus(budget);
                const StatusIcon = status.icon;
                
                return (
                  <div 
                    key={budget.id} 
                    className="stagger-item p-6 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-all duration-300 border border-border/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm" 
                          style={{ backgroundColor: budget.categoryColor }}
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{budget.categoryName}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{budget.period} budget</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={status.color as any} className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {status.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg hover-glow"
                            onClick={() => handleEditBudget(budget)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="rounded-lg hover:border-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="card-glass border-2 border-border/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this budget? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="btn-premium">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="btn-premium bg-destructive hover:bg-destructive/90 text-white"
                                  onClick={() => handleDeleteBudget(budget.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {CURRENCY.format(budget.spent)} of {CURRENCY.format(budget.limit)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}% used
                        </span>
                      </div>
                      
                      <Progress 
                        value={percentage} 
                        className="h-3 rounded-full"
                      />
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Remaining: {CURRENCY.format(Math.max(0, budget.limit - budget.spent))}
                        </span>
                        {budget.spent > budget.limit && (
                          <span className="text-destructive font-medium">
                            Over by {CURRENCY.format(budget.spent - budget.limit)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget Tips */}
        <Card className="card-glass rounded-2xl p-8 border-2 border-border/20">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
              Budget Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/5 border border-border/20">
                <h4 className="font-semibold mb-2">Set Realistic Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Base your budgets on your actual spending patterns from previous months.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/5 border border-border/20">
                <h4 className="font-semibold mb-2">Review Regularly</h4>
                <p className="text-sm text-muted-foreground">
                  Check your budget progress weekly to stay on track with your goals.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/5 border border-border/20">
                <h4 className="font-semibold mb-2">Use the 50/30/20 Rule</h4>
                <p className="text-sm text-muted-foreground">
                  50% needs, 30% wants, 20% savings. A good starting framework for budgeting.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/5 border border-border/20">
                <h4 className="font-semibold mb-2">Track Every Expense</h4>
                <p className="text-sm text-muted-foreground">
                  Small purchases add up. Make sure to log all your transactions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Budget Form Modals */}
      {showAddForm && (
        <BudgetForm onClose={() => setShowAddForm(false)} />
      )}
      
      {editingBudget && (
        <BudgetForm 
          budget={editingBudget}
          isEdit={true}
          onClose={() => setEditingBudget(null)} 
        />
      )}
    </div>
  );
}