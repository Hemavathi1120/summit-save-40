import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  TrendingUp,
  PieChart,
  BarChart3,
  Calendar,
  Target,
  Wallet,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CategoryChart from '@/components/CategoryChart';
import QuickStats from '@/components/QuickStats';
import { useExpenseStore } from '@/store/expenseStore';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<string>('month');
  const navigate = useNavigate();
  const { expenses, categories, wallets } = useExpenseStore();

  const getFilteredExpenses = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return expenses;
    }
    
    return expenses.filter(expense => new Date(expense.date) >= startDate);
  };

  const filteredExpenses = getFilteredExpenses();
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Category analysis
  const categoryTotals = categories.map(category => {
    const categoryExpenses = filteredExpenses.filter(e => e.categoryId === category.id);
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      ...category,
      total,
      count: categoryExpenses.length,
      percentage: totalAmount > 0 ? (total / totalAmount) * 100 : 0
    };
  }).sort((a, b) => b.total - a.total);

  // Monthly trends
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear();
    });
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      count: monthExpenses.length
    };
  }).reverse();

  // Top merchants
  const merchantTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.merchant] = (acc[expense.merchant] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topMerchants = Object.entries(merchantTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([merchant, total]) => ({ merchant, total }));

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 glass bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="rounded-xl border-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow float">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Insights into your spending patterns</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 rounded-xl border-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-premium rounded-xl border-2"
              onClick={() => {
                const reportData = {
                  summary: { totalAmount, filteredCount: filteredExpenses.length },
                  categoryTotals,
                  monthlyData,
                  topMerchants,
                  generatedAt: new Date().toISOString()
                };
                
                const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-8">
        {/* Overview Stats */}
        <QuickStats />

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <Card className="card-glass rounded-2xl p-8 border-2 border-border/20">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <PieChart className="h-4 w-4 text-white" />
                </div>
                Category Breakdown
              </CardTitle>
              <CardDescription>
                Spending distribution across categories
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <CategoryChart />
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="card-glass rounded-2xl p-8 border-2 border-border/20">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Monthly Trends
              </CardTitle>
              <CardDescription>
                Your spending patterns over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                {monthlyData.map((data, index) => {
                  const maxAmount = Math.max(...monthlyData.map(d => d.amount));
                  const widthPercentage = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {data.count} transactions
                          </Badge>
                          <span className="text-sm font-bold">₹{data.amount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${widthPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Details */}
        <Card className="card-glass rounded-2xl border-2 border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
                <Target className="h-4 w-4 text-white" />
              </div>
              Category Analysis
            </CardTitle>
            <CardDescription>
              Detailed breakdown of spending by category for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTotals.map((category, index) => (
                <div 
                  key={category.id} 
                  className="stagger-item p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-all duration-300 border border-border/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {category.count} transactions
                      </Badge>
                      <span className="font-bold">₹{category.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-secondary/20 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {category.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Merchants */}
        <Card className="card-glass rounded-2xl border-2 border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              Top Merchants
            </CardTitle>
            <CardDescription>
              Your most frequent spending destinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMerchants.map((merchant, index) => {
                const maxAmount = Math.max(...topMerchants.map(m => m.total));
                const widthPercentage = (merchant.total / maxAmount) * 100;
                
                return (
                  <div 
                    key={index} 
                    className="stagger-item flex items-center justify-between p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center font-bold text-sm text-primary">
                        {merchant.merchant.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{merchant.merchant}</p>
                        <div className="w-full bg-secondary/20 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-gradient-primary h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${widthPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-lg">₹{merchant.total.toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}