import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExpenseStore, type Expense } from '@/store/expenseStore';
import { CURRENCY, TEXT } from '@/config/text.constants';
import ExpenseForm from '@/components/ExpenseForm';

export interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  showFilters?: boolean;
  className?: string;
}

export default function ExpenseList({ expenses, isLoading, showFilters = true, className = "" }: ExpenseListProps) {
  const { categories, wallets, deleteExpense } = useExpenseStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);
  const getWalletById = (id: string) => wallets.find(wallet => wallet.id === id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const handleDelete = (id: string) => {
    if (confirm(TEXT.messages.confirmDelete || 'Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  return (
    <div className={className}>
      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseForm
          onClose={() => setEditingExpense(null)}
          expenseToEdit={editingExpense}
        />
      )}
      
      {isLoading ? (
        <p className="p-6 text-center">{TEXT.messages.loadingExpenses}</p>
      ) : expenses.length === 0 ? (
        <p className="p-6 text-center text-muted-foreground">{TEXT.messages.noExpenses}</p>
      ) : (
        <div className="divide-y divide-border/30">
          {expenses.map((expense, index) => {
            const category = getCategoryById(expense.categoryId);
            const wallet = getWalletById(expense.walletId);
            const isExpanded = expandedId === expense.id;

            return (
              <Card 
                key={expense.id}
                className="card-glass rounded-xl p-6 hover-lift hover-glow stagger-item transition-all duration-300 border border-border/30 dark:border-border/40 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5 min-w-0 flex-1">
                    {/* Enhanced Category Icon */}
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: category?.color || '#6B7280' }}
                    >
                      {category?.icon || '💰'}
                    </div>

                    {/* Enhanced Expense Details */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg truncate">{expense.title}</h4>
                        {expense.merchant && (
                          <Badge variant="secondary" className="text-sm font-semibold px-3 py-1 bg-secondary/20 dark:bg-secondary/30">
                            {expense.merchant}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category?.color }}></div>
                          {category?.name || 'Uncategorized'}
                        </span>
                        <span className="opacity-50">•</span>
                        <span>{formatDate(expense.date)}</span>
                        <span className="opacity-50">•</span>
                        <span>{wallet?.name || 'Unknown Wallet'}</span>
                      </div>
                    </div>

                    {/* Enhanced Amount Display */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold gradient-text">
                        {CURRENCY.format(expense.amount)}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex items-center gap-3 ml-6">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setExpandedId(isExpanded ? null : expense.id)}
                      className="w-12 h-12 p-0 hover:bg-secondary/20 hover-glow rounded-xl"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                    {expense.notes && (
                      <div>
                        <p className="text-sm font-medium mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground">{expense.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(expense.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          onClick={() => setEditingExpense(expense)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}