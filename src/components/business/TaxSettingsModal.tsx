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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FileText, Plus } from 'lucide-react';

interface TaxSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    taxEnabled?: boolean;
    gstin?: string;
    defaultTaxRate?: string;
    companyPan?: string;
    taxCategories?: {id: string; name: string; rate: string}[];
  };
}

export const TaxSettingsModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}: TaxSettingsModalProps) => {
  const [formData, setFormData] = useState({
    taxEnabled: initialData.taxEnabled ?? true,
    gstin: initialData.gstin || 'GSTIN12345678901',
    defaultTaxRate: initialData.defaultTaxRate || '18',
    companyPan: initialData.companyPan || 'ABCDE1234F',
    taxCategories: initialData.taxCategories || [
      { id: '1', name: 'GST', rate: '18' },
      { id: '2', name: 'SGST', rate: '9' },
      { id: '3', name: 'CGST', rate: '9' },
      { id: '4', name: 'IGST', rate: '18' }
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (value: boolean) => {
    setFormData(prev => ({ ...prev, taxEnabled: value }));
  };

  const handleTaxCategoryChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      taxCategories: prev.taxCategories.map(cat => 
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const handleAddTaxCategory = () => {
    const newId = `${formData.taxCategories.length + 1}`;
    setFormData(prev => ({
      ...prev,
      taxCategories: [
        ...prev.taxCategories,
        { id: newId, name: '', rate: '' }
      ]
    }));
  };

  const handleRemoveTaxCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      taxCategories: prev.taxCategories.filter(cat => cat.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Tax Settings</DialogTitle>
          <DialogDescription>
            Configure tax rates and settings for your business
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="tax-enabled" className="font-medium">Enable Tax Calculation</Label>
              <p className="text-sm text-muted-foreground">Add taxes to your expenses and invoices</p>
            </div>
            <Switch
              id="tax-enabled"
              checked={formData.taxEnabled}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          <Tabs defaultValue="basic" className="w-full pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="rates">Tax Rates</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="Enter GSTIN number"
                    disabled={!formData.taxEnabled}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="companyPan">Company PAN</Label>
                  <Input
                    id="companyPan"
                    name="companyPan"
                    value={formData.companyPan}
                    onChange={handleChange}
                    placeholder="Enter company PAN"
                    disabled={!formData.taxEnabled}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    name="defaultTaxRate"
                    type="number"
                    value={formData.defaultTaxRate}
                    onChange={handleChange}
                    placeholder="Enter default tax rate"
                    disabled={!formData.taxEnabled}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rates" className="space-y-4 pt-4">
              <div className="space-y-4">
                {formData.taxCategories.map((category, index) => (
                  <div key={category.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <Input
                        value={category.name}
                        onChange={(e) => handleTaxCategoryChange(category.id, 'name', e.target.value)}
                        placeholder="Tax name"
                        disabled={!formData.taxEnabled}
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={category.rate}
                          onChange={(e) => handleTaxCategoryChange(category.id, 'rate', e.target.value)}
                          placeholder="Rate %"
                          disabled={!formData.taxEnabled}
                          className="rounded-r-none"
                        />
                        <div className="inline-flex h-10 items-center justify-center rounded-r-md border border-l-0 bg-muted px-3">
                          %
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTaxCategory(category.id)}
                          disabled={!formData.taxEnabled}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTaxCategory}
                  disabled={!formData.taxEnabled}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Tax Category
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Tax Reports</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tax reports can be generated from the Reports section with detailed tax breakdowns
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.taxEnabled}>
              Save Settings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
