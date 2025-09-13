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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    inApp?: boolean;
    expenseSubmission?: boolean;
    expenseApproval?: boolean;
    expenseRejection?: boolean;
    budgetAlerts?: boolean;
    weeklyReports?: boolean;
    teamUpdates?: boolean;
  };
}

export const NotificationsModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}: NotificationsModalProps) => {
  const [formData, setFormData] = useState({
    // Channels
    email: initialData.email ?? true,
    push: initialData.push ?? true,
    sms: initialData.sms ?? false,
    inApp: initialData.inApp ?? true,

    // Events
    expenseSubmission: initialData.expenseSubmission ?? true,
    expenseApproval: initialData.expenseApproval ?? true,
    expenseRejection: initialData.expenseRejection ?? true,
    budgetAlerts: initialData.budgetAlerts ?? true,
    weeklyReports: initialData.weeklyReports ?? true,
    teamUpdates: initialData.teamUpdates ?? false
  });

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const notificationChannels = [
    { id: 'email', name: 'Email Notifications', description: 'Receive updates via email', icon: Mail },
    { id: 'push', name: 'Push Notifications', description: 'Get alerts on your devices', icon: Bell },
    { id: 'sms', name: 'SMS Alerts', description: 'Text messages for critical updates', icon: Smartphone },
    { id: 'inApp', name: 'In-App Notifications', description: 'See alerts within the app', icon: MessageSquare },
  ];

  const notificationEvents = [
    { id: 'expenseSubmission', name: 'Expense Submissions', description: 'When team members submit new expenses' },
    { id: 'expenseApproval', name: 'Expense Approvals', description: 'When expenses are approved' },
    { id: 'expenseRejection', name: 'Expense Rejections', description: 'When expenses are rejected' },
    { id: 'budgetAlerts', name: 'Budget Alerts', description: 'When budgets reach thresholds' },
    { id: 'weeklyReports', name: 'Weekly Reports', description: 'Weekly summary of financial activities' },
    { id: 'teamUpdates', name: 'Team Updates', description: 'Changes in team members and roles' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Configure how and when you want to be notified
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit} className="space-y-6 py-4 pr-6">
            <div className="space-y-4">
              <h3 className="font-medium">Notification Channels</h3>
              {notificationChannels.map(channel => (
                <div key={channel.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <channel.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Label htmlFor={channel.id} className="font-medium">{channel.name}</Label>
                      <p className="text-xs text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                  <Switch
                    id={channel.id}
                    checked={formData[channel.id as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => handleSwitchChange(channel.id, checked)}
                  />
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Notification Events</h3>
              {notificationEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={event.id} className="font-medium">{event.name}</Label>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  </div>
                  <Switch
                    id={event.id}
                    checked={formData[event.id as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => handleSwitchChange(event.id, checked)}
                  />
                </div>
              ))}
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={(e) => handleSubmit(e as React.FormEvent)}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
