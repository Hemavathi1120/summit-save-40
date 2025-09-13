import React, { useState, useEffect } from 'react';
import { useNavigate } from '../hooks/use-navigation';
import { BackButton } from '@/components/ui/back-button';
import { 
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  Target,
  Wallet,
  Download,
  RefreshCw,
  Info,
  Filter,
  ArrowUpRight,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import CategoryChart from '@/components/CategoryChart';
import QuickStats from '@/components/QuickStats';
import { useExpenseStore } from '@/store/expenseStore';
import { CURRENCY } from '@/config/text.constants';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { expenses, categories, wallets } = useExpenseStore();

  // Simulating refresh data
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    // Refresh data when timeRange changes
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 500);
  }, [timeRange]);

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
  
  // Generate insights based on expense data
  const generateInsights = () => {
    const filteredData = getFilteredExpenses();
    if (filteredData.length < 3) return [];
    
    const insights = [];
    
    // Top spending category
    const categorySpending: Record<string, number> = {};
    filteredData.forEach(expense => {
      const catId = expense.categoryId;
      if (catId) {
        categorySpending[catId] = (categorySpending[catId] || 0) + expense.amount;
      }
    });
    
    const topCategoryId = Object.keys(categorySpending).sort(
      (a, b) => categorySpending[b] - categorySpending[a]
    )[0];
    
    const topCategory = categories.find(c => c.id === topCategoryId);
    if (topCategory) {
      insights.push({
        type: 'category',
        icon: PieChart,
        color: 'from-blue-500 to-indigo-600',
        title: 'Top Category',
        message: `Your highest spending is in ${topCategory.name} (${CURRENCY.format(categorySpending[topCategoryId])}).`
      });
    }
    
    // Spending trend
    const thisMonth = filteredData.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
    }).reduce((sum, e) => sum + e.amount, 0);
    
    const lastMonth = filteredData.filter(e => {
      const d = new Date(e.date);
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
    }).reduce((sum, e) => sum + e.amount, 0);
    
    if (lastMonth > 0) {
      const percentChange = ((thisMonth - lastMonth) / lastMonth) * 100;
      insights.push({
        type: 'trend',
        icon: percentChange > 0 ? TrendingUp : TrendingDown,
        color: percentChange > 0 ? 'from-rose-500 to-pink-600' : 'from-emerald-500 to-teal-600',
        title: 'Monthly Change',
        message: `Your spending is ${Math.abs(percentChange).toFixed(1)}% ${percentChange > 0 ? 'higher' : 'lower'} than last month.`
      });
    }
    
    return insights;
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
      {/* Enhanced Modern Header - Created by HEMAVATHI from Dream Team Services */}
      <header className="sticky top-0 z-50 border-b border-border/30 glass bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton 
                destination="/" 
                size="md"
                variant="subtle"
                className="hover:shadow-md"
              />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Analytics Dashboard</h1>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 ml-1" 
                      onClick={refreshData}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="border-dashed border-muted-foreground/50">
                      <Filter className="w-3.5 h-3.5 mr-2" />
                      <span>{filteredExpenses.length} Transactions</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Transactions in selected period</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 border rounded-md">
                  <Calendar className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
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
                size="sm" 
                className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-200/30 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:from-indigo-500/20 hover:to-purple-500/20"
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
                <Download className="w-3.5 h-3.5 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            {/* Placeholder for tabs - actual Tabs component moved to main section */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-8 mt-0">
          {/* Overview Stats */}
            <QuickStats totalBalance={0} expenses={[]} isLoading={false} />          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Category Breakdown - Modern Design */}
            <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-background rounded-xl">
              <CardHeader className="border-b border-border/10 bg-muted/30 dark:bg-muted/5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <PieChart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-medium">Category Breakdown</CardTitle>
                      <CardDescription className="text-xs">
                        Spending by category
                      </CardDescription>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your spending distribution across categories</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CategoryChart />
              </CardContent>
              <CardFooter className="bg-muted/20 dark:bg-muted/5 py-2 px-6 border-t border-border/10 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{categoryTotals.length} Categories</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <span>View Details</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            {/* Monthly Trends - Modern Design */}
            <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-background rounded-xl">
              <CardHeader className="border-b border-border/10 bg-muted/30 dark:bg-muted/5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-medium">Monthly Trends</CardTitle>
                      <CardDescription className="text-xs">
                        6-month spending overview
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    {monthlyData[monthlyData.length - 1].month}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {monthlyData.map((data, index) => {
                    const maxAmount = Math.max(...monthlyData.map(d => d.amount));
                    const widthPercentage = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                    const isLatest = index === monthlyData.length - 1;
                    
                    return (
                      <div 
                        key={index} 
                        className={`space-y-2 ${isLatest ? 'animate-pulse' : ''}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{data.month}</span>
                            {isLatest && (
                              <Badge className="h-5 bg-blue-500 text-xs font-normal">Current</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {data.count} transactions
                            </span>
                            <span className="text-sm font-bold">₹{data.amount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted/30 dark:bg-muted/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-700 ${isLatest ? 'bg-blue-500' : 'bg-blue-400/70'}`}
                            style={{ width: `${widthPercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 dark:bg-muted/5 py-2 px-6 border-t border-border/10 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Last 6 months</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <span>See Yearly</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Category Details - Modern Design */}
          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-background rounded-xl">
            <CardHeader className="border-b border-border/10 bg-muted/30 dark:bg-muted/5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">Category Analysis</CardTitle>
                    <CardDescription className="text-xs">
                      Detailed breakdown for {timeRange === 'week' ? 'the last 7 days' : timeRange === 'month' ? 'the last month' : timeRange === 'quarter' ? 'the last quarter' : timeRange === 'year' ? 'the last year' : 'all time'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Total: <span className="font-bold">₹{totalAmount.toLocaleString('en-IN')}</span></span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryTotals.map((category, index) => (
                  <div 
                    key={category.id} 
                    className="stagger-item p-4 rounded-xl bg-muted/10 hover:bg-muted/20 transition-all duration-300 border border-border/20 relative overflow-hidden group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div 
                      className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300" 
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex items-center justify-between mb-3 relative">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-white font-medium" 
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.count} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹{category.total.toLocaleString('en-IN')}</div>
                        <Badge className="bg-muted/30 text-foreground text-xs hover:bg-muted">
                          {category.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 relative">
                      <div className="flex-1 bg-muted/30 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${category.percentage}%`,
                            backgroundColor: category.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-8 mt-0">
          {/* Monthly Spending Trend - Expanded */}
          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-background rounded-xl">
            <CardHeader className="border-b border-border/10 bg-muted/30 dark:bg-muted/5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">Spending Trends</CardTitle>
                    <CardDescription className="text-xs">
                      Monthly spending patterns
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] flex items-end gap-4 mb-8">
                {monthlyData.map((data, index) => {
                  const maxAmount = Math.max(...monthlyData.map(d => d.amount));
                  const heightPercentage = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                  const isLatest = index === monthlyData.length - 1;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex justify-center">
                        <div 
                          className={`w-full max-w-[40px] rounded-t-lg ${isLatest ? 'bg-blue-500' : 'bg-blue-400/70'} hover:opacity-90 transition-all duration-300 group relative`}
                          style={{ height: `${heightPercentage * 2}px` }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            ₹{data.amount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium">{data.month}</div>
                      <div className="text-xs text-muted-foreground">{data.count}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t border-border/10 pt-6">
                <h4 className="text-sm font-semibold mb-3">Key Trends</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/10 border-border/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Highest Month</div>
                          <div className="font-semibold">
                            {monthlyData.sort((a, b) => b.amount - a.amount)[0]?.month}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/10 border-border/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Lowest Month</div>
                          <div className="font-semibold">
                            {monthlyData.sort((a, b) => a.amount - b.amount)[0]?.month}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/10 border-border/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Monthly Average</div>
                          <div className="font-semibold">
                            ₹{(monthlyData.reduce((acc, data) => acc + data.amount, 0) / monthlyData.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Merchants - Modern Design */}
          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-background rounded-xl">
            <CardHeader className="border-b border-border/10 bg-muted/30 dark:bg-muted/5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">Top Merchants</CardTitle>
                    <CardDescription className="text-xs">
                      Where you spend the most
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {topMerchants.map((merchant, index) => {
                  const maxAmount = Math.max(...topMerchants.map(m => m.total));
                  const widthPercentage = (merchant.total / maxAmount) * 100;
                  const colors = ['from-emerald-500 to-green-600', 'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600', 'from-amber-500 to-orange-600', 'from-pink-500 to-rose-600'];
                  
                  return (
                    <div 
                      key={index} 
                      className="stagger-item flex items-center p-4 rounded-xl bg-muted/5 hover:bg-muted/10 transition-all duration-300 border border-border/20 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center font-bold text-lg text-white shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          {merchant.merchant.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{merchant.merchant}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-full bg-muted/30 rounded-full h-1.5">
                              <div 
                                className={`bg-gradient-to-r ${colors[index % colors.length]} h-1.5 rounded-full transition-all duration-500`}
                                style={{ width: `${widthPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap">
                              ₹{merchant.total.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-8 mt-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Smart Insights</h3>
            <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-500/30">
              <Lightbulb className="h-3.5 w-3.5 mr-1" />
              AI-Powered
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Generate AI Insights */}
            {generateInsights().map((insight, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r p-6 relative overflow-hidden border-b border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-10"></div>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${insight.color} flex items-center justify-center mb-2 shadow-lg`}>
                    <insight.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p>{insight.message}</p>
                </CardContent>
              </Card>
            ))}
            
            {generateInsights().length === 0 && (
              <Card className="col-span-2">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Lightbulb className="h-8 w-8 text-muted-foreground/70" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Insights Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    We need more transaction data to generate meaningful insights. Try adding more expenses or selecting a different time period.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Recommendations */}
          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-background rounded-xl">
            <CardHeader className="border-b border-border/10 bg-muted/30 dark:bg-muted/5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">Smart Recommendations</CardTitle>
                    <CardDescription className="text-xs">
                      Based on your spending patterns
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredExpenses.length > 5 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Budget Suggestion</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Consider setting a budget for your top spending category: {categoryTotals[0]?.name}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900">
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-1">Spending Alert</h4>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Your spending at {topMerchants[0]?.merchant} is higher than usual. You might want to review these expenses.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900">
                    <h4 className="font-medium text-emerald-700 dark:text-emerald-300 mb-1">Savings Opportunity</h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      You could save approximately ₹{(totalAmount * 0.15).toLocaleString('en-IN', { maximumFractionDigits: 0 })} by reducing discretionary spending.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Info className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <h4 className="font-medium mb-1">More Data Needed</h4>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Add more transactions to receive personalized spending recommendations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}