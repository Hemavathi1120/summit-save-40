import { useExpenseStore } from '@/store/expenseStore';
import { CURRENCY } from '@/config/text.constants';

export default function CategoryChart() {
  const { expenses, categories } = useExpenseStore();

  // Calculate spending by category
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      ...category,
      total,
      percentage: 0 // Will calculate after getting total
    };
  }).filter(item => item.total > 0);

  const grandTotal = categoryData.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate percentages
  categoryData.forEach(item => {
    item.percentage = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
  });

  // Sort by amount descending
  categoryData.sort((a, b) => b.total - a.total);

  if (categoryData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
            📊
          </div>
          <p>No spending data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simple Bar Chart */}
      <div className="space-y-3">
        {categoryData.slice(0, 5).map((item, index) => (
          <div 
            key={item.id} 
            className="stagger-item"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{CURRENCY.format(item.total)}</div>
                <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  backgroundColor: item.color,
                  width: `${item.percentage}%`,
                  animationDelay: `${index * 150}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {categoryData.length > 5 && (
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>+{categoryData.length - 5} more categories</span>
            <span>Total: ₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}