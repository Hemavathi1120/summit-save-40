import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Save, User, Mail, Phone, Shield, CreditCard, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MemberSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
  member: any;
}

export function MemberSettingsModal({ isOpen, onClose, onSave, member }: MemberSettingsModalProps) {
  const [activeTab, setActiveTab] = React.useState('profile');
  const [settings, setSettings] = React.useState({
    role: member?.role || 'Member',
    allowExpenseSubmission: true,
    allowExpenseApproval: member?.role === 'Admin' || member?.role === 'Manager',
    receiveNotifications: true,
    expenseLimit: '1000',
    twoFactorEnabled: false
  });

  React.useEffect(() => {
    if (member) {
      setSettings({
        ...settings,
        role: member.role || 'Member',
        allowExpenseApproval: member.role === 'Admin' || member.role === 'Manager'
      });
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...member,
      role: settings.role,
      settings: {
        ...settings
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-2xl rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-lg max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {member.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-semibold">
                {member.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <div className="px-6 pt-4 border-b">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="profile" className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={member.name} className="pl-8" readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={member.email} className="pl-8" readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={member.phone || ''} placeholder="No phone number added" className="pl-8" readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <Input defaultValue="June 15, 2023" readOnly />
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Role Assignment</Label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Select 
                    value={settings.role} 
                    onValueChange={(value) => setSettings({
                      ...settings, 
                      role: value,
                      allowExpenseApproval: value === 'Admin' || value === 'Manager'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="expense-submission" className="block">Allow Expense Submission</Label>
                    <p className="text-xs text-muted-foreground">User can submit new expenses</p>
                  </div>
                  <Switch
                    id="expense-submission"
                    checked={settings.allowExpenseSubmission}
                    onCheckedChange={(checked) => setSettings({...settings, allowExpenseSubmission: checked})}
                    disabled={settings.role === 'Viewer'}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="expense-approval" className="block">Allow Expense Approval</Label>
                    <p className="text-xs text-muted-foreground">User can approve expenses from team members</p>
                  </div>
                  <Switch
                    id="expense-approval"
                    checked={settings.allowExpenseApproval}
                    onCheckedChange={(checked) => setSettings({...settings, allowExpenseApproval: checked})}
                    disabled={settings.role === 'Member' || settings.role === 'Viewer'}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor" className="block">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Require 2FA for this user</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, twoFactorEnabled: checked})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-limit">Expense Approval Limit</Label>
                <div className="relative">
                  <CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="expense-limit" 
                    type="number" 
                    placeholder="Enter limit amount"
                    value={settings.expenseLimit}
                    onChange={(e) => setSettings({...settings, expenseLimit: e.target.value})}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Maximum amount this user can approve without additional review</p>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="receive-notifications" className="block">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive email updates about expense activity</p>
                  </div>
                  <Switch
                    id="receive-notifications"
                    checked={settings.receiveNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, receiveNotifications: checked})}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Notification Preferences</Label>
                  
                  {[
                    'New expense requires approval',
                    'Expense approved',
                    'Expense rejected',
                    'New team member added',
                    'Monthly report available',
                  ].map((notification, i) => (
                    <div key={i} className="flex items-center justify-between pt-2">
                      <span className="text-sm">{notification}</span>
                      <Switch defaultChecked={i < 3} disabled={!settings.receiveNotifications} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <CardFooter className="flex justify-end pt-4 pb-4 border-t">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
