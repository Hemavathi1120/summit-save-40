import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Save, Check, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface RoleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: any) => void;
  role?: {
    role: string;
    description: string;
    count: number;
    permissions?: string[];
  };
}

export function RoleSettingsModal({ isOpen, onClose, onSave, role }: RoleSettingsModalProps) {
  const defaultPermissions = [
    'View expenses',
    'Submit expenses',
    'Approve expenses',
    'Edit categories',
    'View reports',
    'Create reports',
    'Manage team',
    'Access settings',
    'Export data'
  ];

  const [description, setDescription] = React.useState(role?.description || '');
  const [permissions, setPermissions] = React.useState<string[]>(role?.permissions || defaultPermissions.slice(0, 2));

  React.useEffect(() => {
    if (role) {
      setDescription(role.description || '');
      
      // Set default permissions based on role if not provided
      let defaultPerms: string[] = [];
      switch(role.role) {
        case 'Admin':
          defaultPerms = defaultPermissions;
          break;
        case 'Manager':
          defaultPerms = defaultPermissions.slice(0, 7);
          break;
        case 'Member':
          defaultPerms = defaultPermissions.slice(0, 3);
          break;
        case 'Viewer':
          defaultPerms = ['View expenses', 'View reports'];
          break;
        default:
          defaultPerms = defaultPermissions.slice(0, 2);
      }
      
      setPermissions(role.permissions || defaultPerms);
    } else {
      setDescription('');
      setPermissions(defaultPermissions.slice(0, 2));
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handlePermissionChange = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const handleSave = () => {
    if (role) {
      onSave({
        ...role,
        description,
        permissions
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-lg rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-lg max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <CardTitle className="text-xl font-semibold">
            {role?.role} Role Settings
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4 pb-0 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="description">Role Description</Label>
            <Input
              id="description"
              placeholder="Enter role description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Permissions</Label>
            
            {role?.role === 'Viewer' && (
              <div className="flex items-start gap-2 p-3 rounded bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 mb-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Viewer permissions are limited</p>
                  <p className="text-xs">Upgrade to Premium for customizable viewer permissions</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {defaultPermissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox 
                    id={permission} 
                    checked={permissions.includes(permission)}
                    onCheckedChange={() => handlePermissionChange(permission)}
                    disabled={(role?.role === 'Viewer' && !permissions.includes(permission)) || 
                             (role?.role === 'Admin' && ['View expenses', 'Access settings'].includes(permission))}
                  />
                  <label
                    htmlFor={permission}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4 pb-4">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
