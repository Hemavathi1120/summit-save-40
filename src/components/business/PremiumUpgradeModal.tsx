import React from 'react';
import { X, CheckCircle2, CreditCard, Calendar, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { CURRENCY } from '@/config/text.constants';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumUpgradeModal({ isOpen, onClose }: PremiumUpgradeModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = (plan: string) => {
    // In a real app, this would connect to a payment processor
    toast({
      title: "Premium Subscription Activated",
      description: `You've successfully upgraded to the ${plan} plan.`,
      variant: "default",
    });
    onClose();
  };

  const plans = [
    {
      name: "Business Pro",
      price: 1499,
      monthlyPrice: 1499,
      yearlyPrice: 14990,
      yearlyDiscount: 2000,
      features: [
        "Up to 10 team members",
        "All expense tracking features",
        "Advanced reporting",
        "Basic approval workflows",
        "Email support",
      ],
      color: "blue",
      gradientFrom: "from-blue-600",
      gradientTo: "to-indigo-600",
      recommended: false,
    },
    {
      name: "Business Premium",
      price: 2999,
      monthlyPrice: 2999,
      yearlyPrice: 29990,
      yearlyDiscount: 6000,
      features: [
        "Up to 25 team members",
        "All Pro features",
        "Custom approval workflows",
        "API access",
        "Data export & integration",
        "Priority support",
        "Dedicated account manager",
      ],
      color: "purple",
      gradientFrom: "from-purple-600",
      gradientTo: "to-pink-600",
      recommended: true,
    },
    {
      name: "Enterprise",
      price: 4999,
      monthlyPrice: 4999,
      yearlyPrice: 49990,
      yearlyDiscount: 10000,
      features: [
        "Unlimited team members",
        "All Premium features",
        "Advanced security features",
        "Custom integrations",
        "24/7 phone support",
        "Custom training sessions",
        "Dedicated success team",
      ],
      color: "green",
      gradientFrom: "from-emerald-600",
      gradientTo: "to-teal-600",
      recommended: false,
    },
  ];

  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="max-w-4xl w-full rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-premium overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full hover:bg-accent/50 z-10" 
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-10">
            <CardTitle className="text-3xl font-bold">Upgrade to Premium</CardTitle>
            <CardDescription className="text-blue-100">Get access to advanced business features</CardDescription>
          </CardHeader>

          {/* Billing toggle */}
          <div className="flex justify-center -mt-5 mb-8">
            <div className="bg-background border-2 border-border rounded-full p-1 flex shadow-lg">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
                  billingCycle === 'yearly' 
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                <span>Yearly</span>
                <span className="ml-1 text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 rounded-md whitespace-nowrap">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <CardContent className="px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                  plan.recommended 
                    ? `border-${plan.color}-500 dark:border-${plan.color}-700 shadow-lg` 
                    : 'border-border'
                }`}
              >
                {plan.recommended && (
                  <div className={`bg-gradient-to-r ${plan.gradientFrom} ${plan.gradientTo} text-white text-center py-1 text-xs font-medium`}>
                    RECOMMENDED
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  
                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">
                        {CURRENCY.format(billingCycle === 'monthly' ? plan.monthlyPrice : (plan.yearlyPrice / 12))}
                      </span>
                      <span className="text-muted-foreground ml-1 mb-1">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually ({CURRENCY.format(plan.yearlyPrice)})
                      </div>
                    )}
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1 font-medium">
                        Save {CURRENCY.format(plan.yearlyDiscount)} per year
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full rounded-lg ${
                      plan.recommended 
                        ? `bg-gradient-to-r ${plan.gradientFrom} ${plan.gradientTo} hover:opacity-90 text-white` 
                        : ''
                    }`}
                    variant={plan.recommended ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    Choose Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-accent/30 rounded-lg p-4">
            <h3 className="font-medium mb-2">All plans include:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-sm">Secure payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                <span className="text-sm">GST invoice for businesses</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center border-t bg-accent/20 px-6 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">Need a custom enterprise plan?</span>
          </div>
          <Button 
            variant="link" 
            className="text-blue-600 dark:text-blue-400 h-auto p-0"
            onClick={() => {
              toast({
                title: "Enterprise Contact",
                description: "Our team will contact you soon to discuss custom enterprise pricing.",
                variant: "default",
              });
              onClose();
            }}
          >
            Contact our sales team
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
