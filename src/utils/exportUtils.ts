import { toast } from '@/hooks/use-toast';

export interface ExportExpense {
  id: string;
  title: string;
  amount: number;
  date: string;
  categoryName: string;
  merchant: string;
  notes?: string;
}

export const exportToCSV = (expenses: ExportExpense[], filename: string = 'expenses.csv') => {
  try {
    const headers = ['Title', 'Amount', 'Date', 'Category', 'Merchant', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => [
        `"${expense.title}"`,
        expense.amount.toString(),
        expense.date,
        `"${expense.categoryName}"`,
        `"${expense.merchant}"`,
        `"${expense.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful!',
        description: `Your expenses have been exported to ${filename}`,
      });
    }
  } catch (error) {
    toast({
      title: 'Export failed',
      description: 'There was an error exporting your expenses.',
      variant: 'destructive',
    });
  }
};

export const exportToJSON = (expenses: ExportExpense[], filename: string = 'expenses.json') => {
  try {
    const jsonContent = JSON.stringify(expenses, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful!',
        description: `Your expenses have been exported to ${filename}`,
      });
    }
  } catch (error) {
    toast({
      title: 'Export failed',
      description: 'There was an error exporting your expenses.',
      variant: 'destructive',
    });
  }
};

export const importFromCSV = (file: File): Promise<ExportExpense[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const expenses: ExportExpense[] = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',').map(val => val.replace(/"/g, ''));
            return {
              id: `imported-${Date.now()}-${index}`,
              title: values[0] || '',
              amount: parseFloat(values[1]) || 0,
              date: values[2] || new Date().toISOString().split('T')[0],
              categoryName: values[3] || 'Uncategorized',
              merchant: values[4] || '',
              notes: values[5] || ''
            };
          });
        
        resolve(expenses);
        
        toast({
          title: 'Import successful!',
          description: `Imported ${expenses.length} expenses from CSV file.`,
        });
      } catch (error) {
        reject(error);
        toast({
          title: 'Import failed',
          description: 'There was an error importing the CSV file.',
          variant: 'destructive',
        });
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
      toast({
        title: 'Import failed',
        description: 'Could not read the selected file.',
        variant: 'destructive',
      });
    };
    
    reader.readAsText(file);
  });
};