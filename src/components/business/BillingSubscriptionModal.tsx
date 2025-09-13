import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CheckCircle2, CreditCard } from 'lucide-react';

interface BillingSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    plan?: string;
    paymentMethod?: string;
  };
}

export const BillingSubscriptionModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}: BillingSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    plan: initialData.plan || 'basic',
    paymentMethod: initialData.paymentMethod || 'card'
  });

  const handlePlanChange = (value: string) => {
    setFormData(prev => ({ ...prev, plan: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₹0',
      period: 'Free forever',
      features: ['Up to 5 team members', 'Basic expense tracking', 'Monthly reports']
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '₹999',
      period: 'per month',
      features: ['Up to 20 team members', 'Advanced expense tracking', 'Custom approval workflows', 'Weekly reports']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹1,999',
      period: 'per month',
      features: ['Unlimited team members', 'Full analytics suite', 'Custom expense policies', 'Real-time reporting', 'API access']
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="h-4 w-4 text-blue-600" /> },
    { id: 'upi', name: 'UPI', icon: <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M16 8L8 16M8 8L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg> },
    { id: 'bank', name: 'Bank Transfer', icon: <svg className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 14V17M12 14V17M16 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg> }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Billing & Subscription</DialogTitle>
          <DialogDescription>
            Manage your subscription plan and payment methods
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium">Subscription Plan</h3>
            <RadioGroup value={formData.plan} onValueChange={handlePlanChange}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 transition-all ${
                    formData.plan === plan.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={plan.id} id={plan.id} />
                      <Label htmlFor={plan.id} className="font-medium">{plan.name}</Label>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">{plan.price}</span>
                      <span className="text-sm text-muted-foreground block">{plan.period}</span>
                    </div>
                  </div>
                  <div className="mt-2 pl-6">
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3 w-3 text-blue-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Payment Method</h3>
            <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
              <div className="grid grid-cols-1 gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 flex items-center gap-3 ${
                      formData.paymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30'
                        : ''
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <Label htmlFor={`payment-${method.id}`}>{method.name}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
