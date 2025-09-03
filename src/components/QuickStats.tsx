import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExpenseStore } from '@/store/expenseStore';
import { APP_CONFIG } from '@/config/app.config';
import { TEXT } from '@/config/text.constants';

export default function QuickStats() {
  const { expenses } = useExpenseStore();

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
  });
  
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgPerDay = monthlyTotal / new Date().getDate();
  
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });
  
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyChange = lastMonthTotal > 0 ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  const stats = [
    {
      title: TEXT.stats.totalExpenses,
      value: `₹${totalExpenses.toLocaleString('en-IN')}`,
      icon: DollarSign,
      change: null,
      color: 'primary'
    },
    {
      title: TEXT.stats.thisMonth,
      value: `₹${monthlyTotal.toLocaleString('en-IN')}`,
      icon: Calendar,
      change: {
        value: Math.abs(monthlyChange),
        isPositive: monthlyChange < 0,
        label: monthlyChange < 0 ? TEXT.stats.lessSpent : TEXT.stats.moreSpent
      },
      color: monthlyChange < 0 ? 'success' : 'warning'
    },
    {
      title: TEXT.stats.dailyAverage,
      value: `₹${avgPerDay.toFixed(0)}`,
      icon: TrendingUp,
      change: null,
      color: 'electric-blue'
    },
    {
      title: TEXT.stats.transactions,
      value: expenses.length.toString(),
      icon: TrendingDown,
      change: null,
      color: 'platinum'
    }
  ];

  return (
    <div className={`grid ${APP_CONFIG.ui.statsGrid} gap-8`}>
      {stats.map((stat, index) => (
        <Card 
          key={stat.title} 
          className="card-glass rounded-2xl p-8 hover-lift hover-glow stagger-item border-2 border-border/20 group"
          style={{ animationDelay: `${index * APP_CONFIG.ui.staggerDelay}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{stat.title}</p>
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
              {stat.change && (
                <div className="flex items-center gap-2">
                  {stat.change.isPositive ? (
                    <TrendingDown className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-warning" />
                  )}
                  <Badge 
                    variant="secondary" 
                    className={`text-sm font-semibold px-3 py-1 ${stat.change.isPositive ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} border-0`}
                  >
                    {stat.change.value.toFixed(1)}% {stat.change.label}
                  </Badge>
                </div>
              )}
            </div>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow ${
              stat.color === 'primary' 
                ? 'bg-primary text-primary-foreground' 
                : stat.color === 'success'
                ? 'bg-success text-white'
                : stat.color === 'warning' 
                ? 'bg-warning text-white'
                : stat.color === 'electric-blue'
                ? 'bg-electric-blue text-white'
                : 'bg-primary text-primary-foreground'
            }`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}