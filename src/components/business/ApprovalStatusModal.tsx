import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, FileText, User, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CURRENCY } from '@/config/text.constants';
import { toast } from '@/hooks/use-toast';

interface ApprovalStatusProps {
  isOpen: boolean;
  onClose: () => void;
  status: {
    title: string;
    count: number;
    color: string;
  };
}

export function ApprovalStatusModal({ isOpen, onClose, status }: ApprovalStatusProps) {
  if (!isOpen) return null;

  // Mock expenses for the selected status
  const expenses = [
    { 
      id: 1, 
      title: 'Office Supplies', 
      amount: 234.56, 
      employee: 'John Doe', 
      date: '2023-06-15', 
      notes: 'Monthly office supplies from Staples'
    },
    { 
      id: 2, 
      title: 'Client Lunch', 
      amount: 89.99, 
      employee: 'Sarah Smith', 
      date: '2023-06-14',
      notes: 'Business lunch with potential client'
    },
    { 
      id: 3, 
      title: 'Software License', 
      amount: 599.00, 
      employee: 'Mike Johnson', 
      date: '2023-06-10',
      notes: 'Annual subscription for design software'
    }
  ];

  // Generate actions based on status
  const getActions = (statusTitle: string) => {
    switch (statusTitle) {
      case 'Awaiting Manager Approval':
        return [
          { label: 'Approve', icon: CheckCircle2, variant: 'default', className: 'bg-green-600 hover:bg-green-700' },
          { label: 'Reject', icon: XCircle, variant: 'outline', className: 'border-red-300 text-red-600 hover:bg-red-50' }
        ];
      case 'Awaiting Finance Review':
        return [
          { label: 'Process', icon: CheckCircle2, variant: 'default', className: 'bg-blue-600 hover:bg-blue-700' },
          { label: 'Request Info', icon: FileText, variant: 'outline', className: 'border-amber-300 text-amber-600 hover:bg-amber-50' }
        ];
      case 'Approved':
        return [
          { label: 'Reimburse', icon: FileText, variant: 'default', className: 'bg-purple-600 hover:bg-purple-700' }
        ];
      case 'Rejected':
        return [
          { label: 'Review', icon: FileText, variant: 'outline', className: '' }
        ];
      case 'Reimbursed':
        return [
          { label: 'View Receipt', icon: FileText, variant: 'outline', className: '' }
        ];
      default:
        return [];
    }
  };

  const actions = getActions(status.title);
  
  const handleAction = (action: string, expense: any) => {
    console.log(`Performing ${action} on expense ${expense.id}: ${expense.title}`);
    // Show toast when action is performed
    const toastMessage = `${action} action performed on expense: ${expense.title}`;
    toast({
      title: action,
      description: toastMessage
    });
    // In a real app, this would perform the action
    // For now, we'll just close the modal after a short delay
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-2xl rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-lg max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold">
              {status.title}
            </CardTitle>
            <Badge className={status.color}>
              {status.count}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-accent/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="py-4 overflow-y-auto">
          <div className="space-y-4">
            {expenses.map(expense => (
              <div 
                key={expense.id} 
                className="p-4 border rounded-lg hover:bg-accent/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{expense.title}</h3>
                  <span className="font-bold">{CURRENCY.format(expense.amount)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{expense.employee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {expense.notes && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {expense.notes}
                  </p>
                )}
                
                <div className="flex gap-2 justify-end mt-2">
                  {actions.map((action, index) => (
                    <Button 
                      key={index}
                      size="sm"
                      variant={action.variant as any}
                      className={`rounded-lg ${action.className}`}
                      onClick={() => handleAction(action.label, expense)}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-lg"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            size="sm" 
            className="rounded-lg"
          >
            View All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
