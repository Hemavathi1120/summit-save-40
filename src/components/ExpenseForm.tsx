import { useState } from 'react';
import { X, Upload, Calendar, Tag, Wallet, Building2, FileText, ChevronRight, ChevronLeft, Check, Receipt, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useExpenseStore } from '@/store/expenseStore';
import { APP_CONFIG } from '@/config/app.config';
import { TEXT, CURRENCY } from '@/config/text.constants';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseFormProps {
  onClose: () => void;
}

// Define steps for our multi-step form
type FormStep = 'basics' | 'details' | 'review';

export default function ExpenseForm({ onClose }: ExpenseFormProps) {
  const { categories, wallets, addExpense } = useExpenseStore();
  // Track the current step in our multi-step form
  const [currentStep, setCurrentStep] = useState<FormStep>('basics');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    walletId: '',
    merchant: '',
    notes: '',
  });
  
  // Animation variants for step transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 'basics') {
      if (!formData.title || !formData.amount || !formData.date) {
        return;
      }
      setCurrentStep('details');
      return;
    }
    
    if (currentStep === 'details') {
      if (!formData.categoryId || !formData.walletId) {
        return;
      }
      setCurrentStep('review');
      return;
    }
    
    // Final submission - save the expense
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

  // Go back to the previous step
  const handleBack = () => {
    if (currentStep === 'details') setCurrentStep('basics');
    if (currentStep === 'review') setCurrentStep('details');
  };

  // Navigate directly to a specific step (for review screen)
  const navigateToStep = (step: FormStep) => {
    setCurrentStep(step);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Check if the current step has all required fields filled
  const isStepComplete = () => {
    switch (currentStep) {
      case 'basics':
        return !!formData.title && !!formData.amount && !!formData.date;
      case 'details':
        return !!formData.categoryId && !!formData.walletId;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="card-glass w-full max-w-lg rounded-2xl p-6 md:p-8 animate-slide-up border-2 border-primary/10 dark:border-primary/20 shadow-premium">
        {/* Header with Progress Indicator */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold gradient-text">{TEXT.forms.addNewExpense}</h2>
              <p className="text-muted-foreground text-sm">
                {currentStep === 'basics' && TEXT.forms.steps.basics}
                {currentStep === 'details' && TEXT.forms.steps.details}
                {currentStep === 'review' && TEXT.forms.steps.review}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-10 h-10 p-0 rounded-full hover:bg-secondary/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="w-full flex items-center justify-between px-2">
            <div className="flex items-center w-full">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 'basics' ? 'bg-primary text-primary-foreground' : 
                  'bg-primary/20 text-primary border-2 border-primary/30'
                )}
                onClick={() => currentStep !== 'basics' && navigateToStep('basics')}
              >
                {currentStep === 'basics' ? '1' : <Check className="w-4 h-4" />}
              </div>
              <div className={cn(
                "flex-1 h-1 mx-1", 
                currentStep !== 'basics' ? "bg-primary" : "bg-muted"
              )} />
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 'details' ? 'bg-primary text-primary-foreground' : 
                  currentStep === 'review' ? 'bg-primary/20 text-primary border-2 border-primary/30' :
                  'bg-muted text-muted-foreground'
                )}
                onClick={() => (currentStep === 'review' || isStepComplete()) && navigateToStep('details')}
              >
                {currentStep === 'review' ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <div className={cn(
                "flex-1 h-1 mx-1", 
                currentStep === 'review' ? "bg-primary" : "bg-muted"
              )} />
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === 'review' ? 'bg-primary text-primary-foreground' : 
                  'bg-muted text-muted-foreground'
                )}
              >
                3
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {currentStep === 'basics' && (
              <motion.div
                key="basics"
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6"
              >
                {/* Title with animated label */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder=" "
                      maxLength={APP_CONFIG.ui.form.maxTitleLength}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-input-border dark:border-border/40 bg-background/40 dark:bg-background/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 peer"
                      required
                    />
                    <label 
                      htmlFor="title"
                      className="absolute top-2 left-4 text-xs font-medium text-muted-foreground dark:text-muted-foreground/80 peer-focus:text-primary transition-all duration-200 z-10"
                    >
                      {TEXT.forms.title}
                    </label>
                    <Tag className="absolute top-6 right-4 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Amount with animated label */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      id="amount"
                      type="number"
                      step={APP_CONFIG.ui.form.amountStep}
                      max={APP_CONFIG.ui.form.maxAmount}
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      placeholder=" "
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-input-border dark:border-border/40 bg-background/40 dark:bg-background/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 peer"
                      required
                    />
                    <label 
                      htmlFor="amount"
                      className="absolute top-2 left-4 text-xs font-medium text-muted-foreground dark:text-muted-foreground/80 peer-focus:text-primary transition-all duration-200 z-10"
                    >
                      {TEXT.forms.amount}
                    </label>
                    <span className="absolute top-6 right-4 text-muted-foreground font-medium text-lg">₹</span>
                  </div>
                </div>

                {/* Date with animated label */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-input-border dark:border-border/40 bg-background/40 dark:bg-background/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 peer"
                      required
                    />
                    <label 
                      htmlFor="date"
                      className="absolute top-2 left-4 text-xs font-medium text-muted-foreground dark:text-muted-foreground/80 peer-focus:text-primary transition-all duration-200 z-10"
                    >
                      {TEXT.forms.date}
                    </label>
                    <Calendar className="absolute top-6 right-4 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'details' && (
              <motion.div
                key="details"
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6"
              >
                {/* Category with custom select styling */}
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      id="category"
                      value={formData.categoryId}
                      onChange={(e) => handleChange('categoryId', e.target.value)}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-input-border dark:border-border/40 bg-background/40 dark:bg-background/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 appearance-none peer [&>option]:bg-background dark:[&>option]:bg-gray-800 [&>option]:text-foreground"
                      required
                    >
                      <option value="">{TEXT.forms.placeholders.selectCategory}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                    <label 
                      htmlFor="category"
                      className="absolute top-2 left-4 text-xs font-medium text-muted-foreground dark:text-muted-foreground/80 peer-focus:text-primary transition-all duration-200 z-10"
                    >
                      {TEXT.forms.category}
                    </label>
                    <ChevronRight className="absolute top-6 right-4 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Wallet with custom select styling */}
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      id="wallet"
                      value={formData.walletId}
                      onChange={(e) => handleChange('walletId', e.target.value)}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-input-border dark:border-border/40 bg-background/40 dark:bg-background/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 appearance-none peer [&>option]:bg-background dark:[&>option]:bg-gray-800 [&>option]:text-foreground"
                      required
                    >
                      <option value="">{TEXT.forms.placeholders.selectWallet}</option>
                      {wallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                          {wallet.name} ({wallet.currency})
                        </option>
                      ))}
                    </select>
                    <label 
                      htmlFor="wallet"
                      className="absolute top-2 left-4 text-xs font-medium text-muted-foreground dark:text-muted-foreground/80 peer-focus:text-primary transition-all duration-200 z-10"
                    >
                      {TEXT.forms.wallet}
                    </label>
                    <Wallet className="absolute top-6 right-4 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Merchant with animated label */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      id="merchant"
                      type="text"
                      value={formData.merchant}
                      onChange={(e) => handleChange('merchant', e.target.value)}
                      placeholder=" "
                      maxLength={APP_CONFIG.ui.form.maxMerchantLength}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-input-border dark:border-border/40 bg-background/40 dark:bg-background/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 peer"
                    />
                    <label 
                      htmlFor="merchant"
                      className="absolute top-2 left-4 text-xs font-medium text-muted-foreground dark:text-muted-foreground/80 peer-focus:text-primary transition-all duration-200 z-10"
                    >
                      {TEXT.forms.merchant}
                    </label>
                    <Building2 className="absolute top-6 right-4 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Notes with animated label */}
                <div className="space-y-2">
                  <div className="relative">
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder=" "
                      maxLength={APP_CONFIG.ui.form.maxNotesLength}
                      rows={3}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-input-border dark:border-border/40 bg-background/40 dark:bg-background/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all duration-200 resize-none peer"
                    />
                    <label 
                      htmlFor="notes"
                      className="absolute top-2 left-4 text-xs font-medium text-muted-foreground dark:text-muted-foreground/80 peer-focus:text-primary transition-all duration-200 z-10"
                    >
                      {TEXT.forms.notes}
                    </label>
                    <FileText className="absolute top-6 right-4 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6"
              >
                {/* Expense Summary Card */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-primary/80" /> 
                    Expense Summary
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Title</p>
                      <p className="font-medium">{formData.title}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold text-lg text-primary">{CURRENCY.format(parseFloat(formData.amount))}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(formData.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-muted-foreground">{TEXT.forms.category}</p>
                      <p className="font-medium">
                        {categories.find(c => c.id === formData.categoryId)?.name || 'Not selected'}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-muted-foreground">{TEXT.forms.wallet}</p>
                      <p className="font-medium">
                        {wallets.find(w => w.id === formData.walletId)?.name || 'Not selected'}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-muted-foreground">{TEXT.forms.merchant.split(' ')[0]}</p>
                      <p className="font-medium">{formData.merchant || '-'}</p>
                    </div>
                  </div>
                  
                  {formData.notes && (
                    <div className="pt-2 border-t border-primary/10">
                      <p className="text-muted-foreground text-sm mb-1">{TEXT.forms.notes.split(' ')[0]}</p>
                      <p className="text-sm">{formData.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="px-4 py-2 bg-background/50 dark:bg-background/20 border border-border/20 dark:border-border/30 rounded-lg text-sm text-muted-foreground flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" /> 
                    {TEXT.forms.createdOn || 'Created on'} {new Date().toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className={cn(
            "pt-6 flex",
            currentStep === 'basics' ? "justify-end" : "justify-between"
          )}>
            {currentStep !== 'basics' && (
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="rounded-xl px-6 border-primary/30"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> {TEXT.forms.steps.back}
              </Button>
            )}
            
            <Button
              type="submit"
              className={cn(
                "rounded-xl px-6",
                currentStep === 'review' 
                  ? "btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-semibold" 
                  : "bg-primary hover:bg-primary/90"
              )}
              disabled={!isStepComplete()}
            >
              {currentStep === 'review' ? (
                <>{TEXT.forms.steps.submit}</>
              ) : (
                <>{TEXT.forms.steps.next} <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}