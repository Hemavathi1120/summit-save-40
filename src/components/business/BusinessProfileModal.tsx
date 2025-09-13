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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, Upload } from 'lucide-react';

interface BusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    name?: string;
    logo?: string;
    industry?: string;
    size?: string;
    address?: string;
    website?: string;
    description?: string;
  };
}

export const BusinessProfileModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}: BusinessProfileModalProps) => {
  const [formData, setFormData] = useState({
    name: initialData.name || 'Summit Save Inc.',
    logo: initialData.logo || '',
    industry: initialData.industry || 'Finance',
    size: initialData.size || '10-50 employees',
    address: initialData.address || '123 Business Ave, Finance District, Mumbai',
    website: initialData.website || 'www.summitsave.com',
    description: initialData.description || 'Summit Save provides financial management and expense tracking solutions for businesses and individuals.'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Business Profile</DialogTitle>
          <DialogDescription>
            Update your company details and information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.logo || ''} alt="Business Logo" />
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  <Building className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                className="absolute bottom-0 right-0 rounded-full w-7 h-7 bg-primary text-primary-foreground"
              >
                <Upload className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter business name"
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Enter industry"
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="size">Company Size</Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Number of employees"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter business address"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter business description"
                rows={3}
              />
            </div>
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
