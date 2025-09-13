import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, SendHorizontal, Check, FileText, Mail, Calendar, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SendReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (reportData: any) => void;
  scheduledReports: {
    name: string;
    schedule: string;
    recipients: string;
    lastSent?: string;
    format: string;
  }[];
}

export function SendReportsModal({ isOpen, onClose, onSend, scheduledReports }: SendReportsModalProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('Business Expense Reports');
  const [emailFormat, setEmailFormat] = useState('pdf-attachment');
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      // Reset selections when modal opens
      setSelectedReports([]);
      setEmailSubject('Business Expense Reports');
      setEmailFormat('pdf-attachment');
      setIsSending(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleReport = (reportName: string) => {
    if (selectedReports.includes(reportName)) {
      setSelectedReports(selectedReports.filter(r => r !== reportName));
    } else {
      setSelectedReports([...selectedReports, reportName]);
    }
  };

  const handleSelectAll = () => {
    if (selectedReports.length === scheduledReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(scheduledReports.map(r => r.name));
    }
  };

  const handleSendReports = () => {
    setIsSending(true);
    
    // Simulate sending reports
    setTimeout(() => {
      onSend({
        reports: selectedReports,
        subject: emailSubject,
        format: emailFormat,
        sentDate: new Date().toISOString(),
      });
      setIsSending(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-lg rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-lg max-h-[85vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <CardTitle className="text-xl font-semibold">
            Send Reports
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSending}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4 pb-0 space-y-5 flex-1 overflow-y-auto">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Select Reports to Send</Label>
              <button 
                className="text-xs text-blue-600 hover:underline"
                onClick={handleSelectAll}
              >
                {selectedReports.length === scheduledReports.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              {scheduledReports.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No scheduled reports found
                </div>
              ) : (
                scheduledReports.map((report, index) => {
                  const isSelected = selectedReports.includes(report.name);
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-start p-3 border-b last:border-0 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <Checkbox 
                        id={`report-${index}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggleReport(report.name)}
                        className="mt-1"
                      />
                      
                      <div className="ml-2 flex-1">
                        <label 
                          htmlFor={`report-${index}`}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {report.name}
                        </label>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.schedule}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {report.recipients}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {report.format}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Email Subject</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="email-subject"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-format">Format</Label>
              <Select value={emailFormat} onValueChange={setEmailFormat}>
                <SelectTrigger id="email-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf-attachment">PDF Attachment</SelectItem>
                  <SelectItem value="excel-attachment">Excel Attachment</SelectItem>
                  <SelectItem value="embedded-html">Embedded in Email</SelectItem>
                  <SelectItem value="link">Link to Download</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Recipients</Label>
            <div className="p-3 border rounded-md">
              {selectedReports.length === 0 ? (
                <p className="text-sm text-muted-foreground">Select reports to see recipients</p>
              ) : (
                <div className="space-y-2">
                  {Array.from(new Set(
                    selectedReports
                      .map(name => scheduledReports.find(r => r.name === name)?.recipients || '')
                      .flatMap(recipientStr => recipientStr.split(', '))
                  )).map((recipient, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <Check className="h-3 w-3 text-green-600 mr-2" />
                      {recipient}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4 pb-4">
          <Button 
            onClick={handleSendReports}
            disabled={selectedReports.length === 0 || isSending}
            className="w-full"
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <SendHorizontal className="mr-2 h-4 w-4" />
                Send {selectedReports.length} {selectedReports.length === 1 ? 'Report' : 'Reports'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
