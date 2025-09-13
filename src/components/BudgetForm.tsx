import { useState } from 'react';
import { X, Target, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExpenseStore } from '@/store/expenseStore';
import { toast } from '@/hooks/use-toast';

interface BudgetFormProps {
  onClose: () => void;
  budget?: any;
  isEdit?: boolean;
}

export default function BudgetForm({ onClose, budget, isEdit = false }: BudgetFormProps) {
  const { categories } = useExpenseStore();
  const [formData, setFormData] = useState({
    categoryId: budget?.categoryId || '',
    limit: budget?.limit?.toString() || '',
    period: budget?.period || 'monthly',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.limit) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Here you would normally save to Firebase
    toast({
      title: isEdit ? 'Budget updated!' : 'Budget created!',
      description: `Your ${formData.period} budget has been ${isEdit ? 'updated' : 'created'} successfully.`,
    });

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl">
      <Card className="card-glass w-full max-w-lg rounded-2xl p-8 page-enter border-2 border-border/20 dark:border-border/40 shadow-premium">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold gradient-text">
              {isEdit ? 'Edit Budget' : 'Create Budget'}
            </h2>
            <p className="text-muted-foreground">Set spending limits for your categories</p>
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="w-12 h-12 p-0 hover:bg-secondary/20 rounded-xl hover-glow"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Category</label>
            <Select value={formData.categoryId} onValueChange={(value) => handleChange('categoryId', value)}>
              <SelectTrigger className="w-full rounded-xl border-2 h-12">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
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
          </div>

          {/* Budget Limit */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Budget Limit</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₹</span>
              <input
                type="number"
                step="0.01"
                value={formData.limit}
                onChange={(e) => handleChange('limit', e.target.value)}
                placeholder="Enter budget amount"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Period */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Period</label>
            <Select value={formData.period} onValueChange={(value) => handleChange('period', value)}>
              <SelectTrigger className="w-full rounded-xl border-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-bold py-4 text-lg rounded-xl"
              size="lg"
            >
              <Target className="w-5 h-5 mr-2" />
              {isEdit ? 'Update Budget' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}