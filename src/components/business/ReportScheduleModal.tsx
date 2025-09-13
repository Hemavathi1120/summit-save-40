import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Save, Calendar, Users, ArrowRight, FileText, Trash2, Plus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface ReportScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reportData: any) => void;
  report?: {
    name: string;
    schedule: string;
    recipients: string;
    lastSent?: string;
    format: string;
  };
  isNew?: boolean;
}

export function ReportScheduleModal({ isOpen, onClose, onSave, report, isNew = false }: ReportScheduleModalProps) {
  const [name, setName] = useState(report?.name || '');
  const [schedule, setSchedule] = useState(report?.schedule || 'Monthly');
  const [format, setFormat] = useState(report?.format || 'PDF');
  const [recipients, setRecipients] = useState<string[]>(report?.recipients?.split(', ') || []);
  
  // Sample team members
  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Admin', email: 'john@example.com' },
    { id: 2, name: 'Sarah Smith', role: 'Manager', email: 'sarah@example.com' },
    { id: 3, name: 'Mike Johnson', role: 'Member', email: 'mike@example.com' },
    { id: 4, name: 'Lisa Wong', role: 'Finance', email: 'lisa@example.com' },
    { id: 5, name: 'Management Team', role: 'Group', email: '' },
    { id: 6, name: 'Finance Team', role: 'Group', email: '' },
    { id: 7, name: 'All Team Leaders', role: 'Group', email: '' },
  ];
  
  React.useEffect(() => {
    if (report) {
      setName(report.name || '');
      setSchedule(report.schedule || 'Monthly');
      setFormat(report.format || 'PDF');
      
      // Parse recipients string to array
      const recipientList = report.recipients?.split(', ') || [];
      setRecipients(recipientList);
    } else {
      setName('');
      setSchedule('Monthly');
      setFormat('PDF');
      setRecipients([]);
    }
  }, [report, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name,
        schedule,
        recipients: recipients.join(', '),
        format,
        lastSent: report?.lastSent || new Date().toLocaleDateString(),
      });
      onClose();
    }
  };
  
  const handleToggleRecipient = (recipient: string) => {
    if (recipients.includes(recipient)) {
      setRecipients(recipients.filter(r => r !== recipient));
    } else {
      setRecipients([...recipients, recipient]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-lg rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-lg max-h-[85vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <CardTitle className="text-xl font-semibold">
            {isNew ? 'Schedule New Report' : `Edit Report`}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4 pb-0 space-y-5 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name</Label>
            <div className="relative">
              <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Enter report name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Select value={schedule} onValueChange={setSchedule}>
                <SelectTrigger id="schedule" className="w-full">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select frequency" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format" className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Recipients</Label>
              <div className="flex items-center text-sm text-blue-600">
                <Users className="h-3 w-3 mr-1" />
                <span>{recipients.length} selected</span>
              </div>
            </div>
            
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {recipients.map((recipient, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="pl-2 flex items-center"
                  >
                    {recipient}
                    <button 
                      className="ml-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                      onClick={() => handleToggleRecipient(recipient)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="border rounded-lg max-h-[200px] overflow-y-auto">
              {teamMembers.map((member) => {
                const isSelected = recipients.includes(member.name);
                
                return (
                  <div 
                    key={member.id}
                    className={`flex items-center justify-between p-2 border-b last:border-0 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <div className="flex items-center">
                      <Checkbox 
                        id={`member-${member.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggleRecipient(member.name)}
                      />
                      <label 
                        htmlFor={`member-${member.id}`}
                        className="ml-2 text-sm cursor-pointer flex-1"
                      >
                        {member.name}
                        {member.email && (
                          <span className="text-xs text-muted-foreground ml-1">({member.role})</span>
                        )}
                      </label>
                    </div>
                    
                    {member.email && (
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {member.email}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Report Content</Label>
            <div className="border rounded-lg p-3 space-y-2">
              {['Expense totals', 'Category breakdown', 'Team member comparison', 'Transaction list'].map((content, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`content-${index}`} defaultChecked={index < 3} />
                  <label
                    htmlFor={`content-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {content}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 pb-4">
          {!isNew && (
            <Button 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                onSave({ ...report, deleted: true });
                onClose();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button 
            onClick={handleSave}
            className={isNew ? "w-full ml-auto" : "ml-auto"}
          >
            <Save className="mr-2 h-4 w-4" />
            {isNew ? 'Schedule Report' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
