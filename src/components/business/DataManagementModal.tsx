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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowDownToLine, ArrowUpFromLine, Database, FileJson, FileSpreadsheet, FileText, Settings } from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onExport?: (format: string) => void;
  onImport?: (data: File | null) => void;
  initialData?: {
    autoBackup?: boolean;
    backupFrequency?: string;
    dataRetention?: string;
  };
}

export const DataManagementModal = ({
  isOpen,
  onClose,
  onSave,
  onExport,
  onImport,
  initialData = {}
}: DataManagementModalProps) => {
  const [formData, setFormData] = useState({
    autoBackup: initialData.autoBackup ?? true,
    backupFrequency: initialData.backupFrequency || 'weekly',
    dataRetention: initialData.dataRetention || '12',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('import-export');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (onImport && selectedFile) {
      onImport(selectedFile);
    }
  };

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Data Management</DialogTitle>
          <DialogDescription>
            Import, export, and configure data settings
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import-export">Import & Export</TabsTrigger>
            <TabsTrigger value="settings">Data Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="import-export" className="space-y-4 py-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Import Data</h3>
                <Card className="rounded-lg">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <ArrowDownToLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Upload Data File</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Supported formats: CSV, Excel, JSON
                      </p>
                      <Input
                        type="file"
                        id="import-file"
                        className="w-full"
                        accept=".csv,.xlsx,.xls,.json"
                        onChange={handleFileChange}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      disabled={!selectedFile}
                      onClick={handleImport}
                    >
                      Import Data
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Export Data</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Card 
                    className="p-3 flex flex-col items-center rounded-lg cursor-pointer hover:border-blue-500"
                    onClick={() => handleExport('excel')}
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs font-medium">Excel</span>
                  </Card>
                  <Card 
                    className="p-3 flex flex-col items-center rounded-lg cursor-pointer hover:border-blue-500"
                    onClick={() => handleExport('csv')}
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-xs font-medium">CSV</span>
                  </Card>
                  <Card 
                    className="p-3 flex flex-col items-center rounded-lg cursor-pointer hover:border-blue-500"
                    onClick={() => handleExport('json')}
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                      <FileJson className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-medium">JSON</span>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup" className="font-medium">Automatic Backup</Label>
                  <p className="text-xs text-muted-foreground">Schedule regular data backups</p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={formData.autoBackup}
                  onCheckedChange={(checked) => handleSwitchChange('autoBackup', checked)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <select
                    id="backup-frequency"
                    name="backupFrequency"
                    value={formData.backupFrequency}
                    onChange={handleChange}
                    disabled={!formData.autoBackup}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="data-retention">Data Retention Period (months)</Label>
                  <Input
                    id="data-retention"
                    name="dataRetention"
                    type="number"
                    value={formData.dataRetention}
                    onChange={handleChange}
                    min="1"
                    max="36"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 mt-4">
                <Database className="h-4 w-4 text-blue-600" />
                <p className="text-xs">
                  Your data is securely stored and encrypted. We recommend regular backups for additional safety.
                </p>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab('import-export')}>
                  Back
                </Button>
                <Button type="submit">Save Settings</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
