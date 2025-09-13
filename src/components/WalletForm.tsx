import { useState } from 'react';
import { X, Wallet, Building2, DollarSign, CreditCard, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { TEXT, CURRENCY, WALLET } from '@/config/text.constants';

interface WalletFormProps {
  onClose: () => void;
  wallet?: any;
  isEdit?: boolean;
}

export default function WalletForm({ onClose, wallet, isEdit = false }: WalletFormProps) {
  const [formData, setFormData] = useState({
    name: wallet?.name || '',
    type: wallet?.type || 'checking',
    balance: wallet?.balance?.toString() || '',
    bank: wallet?.bank || '',
    currency: wallet?.currency || 'INR',
  });

  // Map icons to wallet types from constants
  const walletIcons = {
    checking: Building2,
    savings: PiggyBank,
    credit: CreditCard,
    cash: Wallet,
  };
  
  const walletTypes = WALLET.form.types.map(type => ({
    ...type,
    icon: walletIcons[type.value as keyof typeof walletIcons]
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.balance) {
      toast({
        title: WALLET.form.error.title,
        description: WALLET.form.error.required,
        variant: 'destructive',
      });
      return;
    }

    // Here you would normally save to Firebase
    toast({
      title: isEdit ? WALLET.form.success.updated : WALLET.form.success.added,
      description: isEdit ? WALLET.form.success.updatedDesc : WALLET.form.success.addedDesc,
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
              {isEdit ? WALLET.form.editAccount : WALLET.form.addAccount}
            </h2>
            <p className="text-muted-foreground">{WALLET.form.subtitle}</p>
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
          {/* Account Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{WALLET.form.accountName}</label>
            <div className="relative">
              <Wallet className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={WALLET.form.placeholders.accountName}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{WALLET.form.accountType}</label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger className="w-full rounded-xl border-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {walletTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Balance */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              {formData.type === 'credit' ? WALLET.form.creditBalance || 'Current Balance (negative for debt)' : WALLET.form.balance}
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => handleChange('balance', e.target.value)}
                placeholder={WALLET.form.placeholders.balance}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Bank/Institution */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{WALLET.form.bank}</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={formData.bank}
                onChange={(e) => handleChange('bank', e.target.value)}
                placeholder={WALLET.form.placeholders.bank}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-input/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">{WALLET.form.currency}</label>
            <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
              <SelectTrigger className="w-full rounded-xl border-2 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
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
              <Wallet className="w-5 h-5 mr-2" />
              {isEdit ? WALLET.form.updateButton || 'Update Account' : WALLET.form.addAccount}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}