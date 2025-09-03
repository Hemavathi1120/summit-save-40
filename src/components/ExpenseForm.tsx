import { useState } from 'react';
import { X, Upload, DollarSign, Calendar, Tag, Wallet, Building2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useExpenseStore } from '@/store/expenseStore';
import { APP_CONFIG } from '@/config/app.config';
import { TEXT } from '@/config/text.constants';

interface ExpenseFormProps {
  onClose: () => void;
}

export default function ExpenseForm({ onClose }: ExpenseFormProps) {
  const { categories, wallets, addExpense } = useExpenseStore();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    walletId: '',
    merchant: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.categoryId || !formData.walletId) {
      return;
    }

    addExpense({
      title: formData.title,
      amount: parseFloat(formData.amount),
      date: formData.date,
      categoryId: formData.categoryId,
      walletId: formData.walletId,
      merchant: formData.merchant,
      notes: formData.notes,
    });

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <Card className="card-glass w-full max-w-lg rounded-2xl p-8 animate-slide-up border-2 border-border/20 shadow-premium">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold gradient-text">{TEXT.forms.addNewExpense}</h2>
            <p className="text-muted-foreground">Track your spending with ease</p>
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
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{TEXT.forms.title}</label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder={TEXT.forms.placeholders.expenseTitle}
                maxLength={APP_CONFIG.ui.form.maxTitleLength}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{TEXT.forms.amount}</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                step={APP_CONFIG.ui.form.amountStep}
                max={APP_CONFIG.ui.form.maxAmount}
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder={TEXT.forms.placeholders.amount}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Date & Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{TEXT.forms.date}</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{TEXT.forms.category}</label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-input-border bg-background/95 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 text-foreground [&>option]:bg-background [&>option]:text-foreground [&>option]:py-2"
                required
              >
                <option value="">{TEXT.forms.placeholders.selectCategory}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Wallet */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{TEXT.forms.wallet}</label>
            <div className="relative">
              <Wallet className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" />
              <select
                value={formData.walletId}
                onChange={(e) => handleChange('walletId', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-input-border bg-background/95 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 text-foreground [&>option]:bg-background [&>option]:text-foreground [&>option]:py-2"
                required
              >
                <option value="">{TEXT.forms.placeholders.selectWallet}</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({wallet.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Merchant */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{TEXT.forms.merchant}</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={formData.merchant}
                onChange={(e) => handleChange('merchant', e.target.value)}
                placeholder={TEXT.forms.placeholders.merchant}
                maxLength={APP_CONFIG.ui.form.maxMerchantLength}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{TEXT.forms.notes}</label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder={TEXT.forms.placeholders.notes}
                maxLength={APP_CONFIG.ui.form.maxNotesLength}
                rows={3}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Enhanced Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-bold py-4 text-lg rounded-xl"
              size="lg"
            >
              {TEXT.navigation.addExpense}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}