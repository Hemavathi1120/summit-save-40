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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { CheckCircle2, FileText, Tag } from 'lucide-react';

interface ExpensePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    approvalWorkflow?: {
      role: string;
      action: string;
    }[];
    spendingLimits?: {
      category: string;
      limit: string;
    }[];
    documentationRules?: string[];
    requireReceipts?: boolean;
    receiptThreshold?: string;
    expenseJustification?: boolean;
    clientRequired?: boolean;
  };
}

export const ExpensePolicyModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}: ExpensePolicyModalProps) => {
  const [formData, setFormData] = useState({
    approvalWorkflow: initialData.approvalWorkflow || [
      { role: 'Team Members', action: 'Submit expenses' },
      { role: 'Managers', action: 'First level approval for their team' },
      { role: 'Finance Team', action: 'Final approval and processing' },
    ],
    spendingLimits: initialData.spendingLimits || [
      { category: 'Meals (per person)', limit: '₹1,200.00' },
      { category: 'Accommodation (per night)', limit: '₹4,000.00' },
      { category: 'Air Travel', limit: 'Economy Class' },
      { category: 'Software Purchases', limit: 'Manager Approval' },
    ],
    documentationRules: initialData.documentationRules || [
      'Receipts required for all expenses over ₹500',
      'Itemized receipts for meals and entertainment',
      'Purpose of expense must be documented',
      'Client name required for business development expenses',
    ],
    requireReceipts: initialData.requireReceipts ?? true,
    receiptThreshold: initialData.receiptThreshold || '500',
    expenseJustification: initialData.expenseJustification ?? true,
    clientRequired: initialData.clientRequired ?? true,
  });

  const handleToggleChange = (key: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpendingLimitChange = (index: number, field: 'category' | 'limit', value: string) => {
    const updatedLimits = [...formData.spendingLimits];
    updatedLimits[index][field] = value;
    setFormData(prev => ({ ...prev, spendingLimits: updatedLimits }));
  };

  const handleAddSpendingLimit = () => {
    setFormData(prev => ({
      ...prev,
      spendingLimits: [...prev.spendingLimits, { category: '', limit: '' }]
    }));
  };

  const handleRemoveSpendingLimit = (index: number) => {
    const updatedLimits = [...formData.spendingLimits];
    updatedLimits.splice(index, 1);
    setFormData(prev => ({ ...prev, spendingLimits: updatedLimits }));
  };

  const handleRuleChange = (index: number, value: string) => {
    const updatedRules = [...formData.documentationRules];
    updatedRules[index] = value;
    setFormData(prev => ({ ...prev, documentationRules: updatedRules }));
  };

  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      documentationRules: [...prev.documentationRules, '']
    }));
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = [...formData.documentationRules];
    updatedRules.splice(index, 1);
    setFormData(prev => ({ ...prev, documentationRules: updatedRules }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Expense Policy</DialogTitle>
          <DialogDescription>
            Set guidelines for expense submissions and approvals
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div>
            <h3 className="font-medium mb-3">Approval Workflow</h3>
            <div className="space-y-3">
              {formData.approvalWorkflow.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 mt-1 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                    {i+1}
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div>
                      <Label htmlFor={`role-${i}`} className="text-xs">Role</Label>
                      <Input
                        id={`role-${i}`}
                        value={step.role}
                        onChange={(e) => {
                          const updatedWorkflow = [...formData.approvalWorkflow];
                          updatedWorkflow[i].role = e.target.value;
                          setFormData(prev => ({ ...prev, approvalWorkflow: updatedWorkflow }));
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`action-${i}`} className="text-xs">Action</Label>
                      <Input
                        id={`action-${i}`}
                        value={step.action}
                        onChange={(e) => {
                          const updatedWorkflow = [...formData.approvalWorkflow];
                          updatedWorkflow[i].action = e.target.value;
                          setFormData(prev => ({ ...prev, approvalWorkflow: updatedWorkflow }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Spending Limits</h3>
            <div className="space-y-3">
              {formData.spendingLimits.map((limit, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Category"
                      value={limit.category}
                      onChange={(e) => handleSpendingLimitChange(i, 'category', e.target.value)}
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      placeholder="Limit"
                      value={limit.limit}
                      onChange={(e) => handleSpendingLimitChange(i, 'limit', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpendingLimit(i)}
                      disabled={formData.spendingLimits.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSpendingLimit}
                className="mt-2"
              >
                Add Spending Limit
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Documentation Requirements</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-receipts" className="font-medium">Require Receipts</Label>
                  <p className="text-xs text-muted-foreground">Mandatory receipt uploads for expenses</p>
                </div>
                <Switch
                  id="require-receipts"
                  checked={formData.requireReceipts}
                  onCheckedChange={(checked) => handleToggleChange('requireReceipts', checked)}
                />
              </div>
              
              {formData.requireReceipts && (
                <div>
                  <Label htmlFor="receipt-threshold">Minimum Receipt Threshold (₹)</Label>
                  <Input
                    id="receipt-threshold"
                    name="receiptThreshold"
                    type="number"
                    value={formData.receiptThreshold}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="expense-justification" className="font-medium">Require Expense Justification</Label>
                  <p className="text-xs text-muted-foreground">Expense purpose must be documented</p>
                </div>
                <Switch
                  id="expense-justification"
                  checked={formData.expenseJustification}
                  onCheckedChange={(checked) => handleToggleChange('expenseJustification', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="client-required" className="font-medium">Client Details for Business Development</Label>
                  <p className="text-xs text-muted-foreground">Require client name for related expenses</p>
                </div>
                <Switch
                  id="client-required"
                  checked={formData.clientRequired}
                  onCheckedChange={(checked) => handleToggleChange('clientRequired', checked)}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label className="font-medium mb-2 block">Additional Documentation Rules</Label>
              <div className="space-y-3">
                {formData.documentationRules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <Input
                      value={rule}
                      onChange={(e) => handleRuleChange(i, e.target.value)}
                      placeholder="Enter documentation rule"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRule(i)}
                      disabled={formData.documentationRules.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRule}
                  className="mt-2"
                >
                  Add Rule
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Policy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
