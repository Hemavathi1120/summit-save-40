import { useState } from 'react';
import { X, Filter, Calendar, Tag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExpenseStore } from '@/store/expenseStore';
import { toast } from '@/hooks/use-toast';

interface FilterModalProps {
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export default function FilterModal({ onClose, onApplyFilters }: FilterModalProps) {
  const { categories } = useExpenseStore();
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    amountMin: '',
    amountMax: '',
    merchant: '',
  });

  const handleApply = () => {
    onApplyFilters(filters);
    toast({
      title: 'Filters applied!',
      description: 'Your expense list has been filtered according to your criteria.',
    });
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      category: 'all',
      dateRange: 'all',
      amountMin: '',
      amountMax: '',
      merchant: '',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    toast({
      title: 'Filters cleared!',
      description: 'All filters have been reset.',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
      <Card className="card-glass w-full max-w-lg rounded-2xl p-8 page-enter border-2 border-border/20 shadow-premium">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold gradient-text">Filter Expenses</h2>
            <p className="text-muted-foreground">Refine your expense search</p>
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

        <div className="space-y-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Category</label>
            <Select value={filters.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="w-full rounded-xl border-2 h-12">
                <SelectValue />
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
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(value) => handleChange('dateRange', value)}>
              <SelectTrigger className="w-full rounded-xl border-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Amount Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  step="0.01"
                  value={filters.amountMin}
                  onChange={(e) => handleChange('amountMin', e.target.value)}
                  placeholder="Min amount"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  step="0.01"
                  value={filters.amountMax}
                  onChange={(e) => handleChange('amountMax', e.target.value)}
                  placeholder="Max amount"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Merchant Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Merchant</label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={filters.merchant}
                onChange={(e) => handleChange('merchant', e.target.value)}
                placeholder="Filter by merchant name"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 btn-premium rounded-xl border-2 h-12"
            >
              Reset Filters
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-bold h-12 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}