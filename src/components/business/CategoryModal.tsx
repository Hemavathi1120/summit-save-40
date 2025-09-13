import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Save, Trash2 } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: { name: string; color: string; deleted?: boolean }) => void;
  category?: { name: string; color: string };
}

export function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const [name, setName] = React.useState(category?.name || '');
  const [color, setColor] = React.useState(category?.color || '#3b82f6');

  React.useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    } else {
      setName('');
      setColor('#3b82f6');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name, color });
      onClose();
    }
  };

  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald
    '#6366f1', // indigo
    '#14b8a6', // teal
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-md rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            {category ? 'Edit Category' : 'Add Category'}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-accent/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input 
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="rounded-md"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          {category && (
            <Button 
              variant="destructive" 
              size="sm"
              className="rounded-lg"
              onClick={() => {
                onSave({ ...category, deleted: true });
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <div className={`flex gap-2 ${!category ? 'ml-auto' : ''}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-lg"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
