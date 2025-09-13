import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Printer, Mail, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CURRENCY } from '@/config/text.constants';

// Mock data for charts
const monthlyExpenseData = [
  { month: 'Jan', amount: 4500 },
  { month: 'Feb', amount: 5200 },
  { month: 'Mar', amount: 4800 },
  { month: 'Apr', amount: 6300 },
  { month: 'May', amount: 5700 },
  { month: 'Jun', amount: 6100 },
];

const categoryData = [
  { category: 'Office Supplies', percentage: 15, amount: 2250, color: '#3b82f6' },
  { category: 'Software & Subscriptions', percentage: 25, amount: 3750, color: '#8b5cf6' },
  { category: 'Travel & Accommodation', percentage: 20, amount: 3000, color: '#f59e0b' },
  { category: 'Meals & Entertainment', percentage: 12, amount: 1800, color: '#ec4899' },
  { category: 'Marketing & Advertising', percentage: 18, amount: 2700, color: '#10b981' },
  { category: 'Other', percentage: 10, amount: 1500, color: '#64748b' },
];

const teamData = [
  { name: 'John Doe', amount: 5200, transactions: 12 },
  { name: 'Sarah Smith', amount: 3800, transactions: 8 },
  { name: 'Mike Johnson', amount: 2700, transactions: 6 },
  { name: 'Lisa Wong', amount: 1500, transactions: 4 },
];

interface ReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
}

export function ReportViewModal({ isOpen, onClose, reportType }: ReportViewModalProps) {
  const [activeTab, setActiveTab] = useState('chart');
  const [dateRange, setDateRange] = useState('last-month');

  if (!isOpen) return null;
  
  // Helper to render the chart based on report type
  const renderChart = () => {
    if (reportType.includes('Expense Summary')) {
      return (
        <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-6">
          {monthlyExpenseData.map((month, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div 
                className="w-12 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md"
                style={{ height: `${(month.amount / 7000) * 250}px` }}
              ></div>
              <span className="text-xs font-medium">{month.month}</span>
            </div>
          ))}
        </div>
      );
    } else if (reportType.includes('Category Analysis')) {
      return (
        <div className="space-y-6">
          {/* Simplified pie chart representation */}
          <div className="flex justify-center">
            <div className="h-[200px] w-[200px] relative rounded-full overflow-hidden">
              {categoryData.map((category, index) => {
                // Create pie segments through conic gradient
                const previousTotal = categoryData
                  .slice(0, index)
                  .reduce((acc, curr) => acc + curr.percentage, 0);
                
                return (
                  <div
                    key={index}
                    className="absolute inset-0"
                    style={{
                      background: category.color,
                      clipPath: `conic-gradient(from ${previousTotal * 3.6}deg, currentColor ${category.percentage * 3.6}deg, transparent ${category.percentage * 3.6}deg)`,
                    }}
                  />
                );
              })}
              <div className="absolute inset-[25%] bg-background rounded-full flex items-center justify-center">
                <span className="font-semibold text-lg">Total</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                <span className="text-sm">{category.category}</span>
                <span className="text-xs text-muted-foreground ml-auto">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (reportType.includes('Team Spending')) {
      return (
        <div className="space-y-6 pt-4">
          {teamData.map((member, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{member.name}</span>
                <span className="font-semibold">{CURRENCY.format(member.amount)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" 
                  style={{ width: `${(member.amount / 6000) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {member.transactions} transactions
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-[250px] text-center">
          <p className="text-muted-foreground">No chart available for this report type.</p>
          <p className="text-sm text-muted-foreground mt-2">Try selecting a different report or date range.</p>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-3xl rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-lg max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <CardTitle className="text-xl font-semibold">
            {reportType}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <div className="flex justify-between items-center px-6 py-2 border-b">
          <div className="flex items-center gap-2">
            <select 
              className="bg-transparent border rounded-md p-1 text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="last-year">Last Year</option>
              <option value="ytd">Year to Date</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid grid-cols-2 h-8 w-[180px]">
              <TabsTrigger value="chart" className="text-xs py-1">Chart View</TabsTrigger>
              <TabsTrigger value="table" className="text-xs py-1">Table View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <CardContent className="flex-1 overflow-y-auto p-6">
          <TabsContent value="chart">
            {renderChart()}
          </TabsContent>
          
          <TabsContent value="table">
            <div className="border rounded-lg">
              <div className="grid grid-cols-4 p-3 border-b font-medium text-sm">
                {reportType.includes('Expense Summary') ? (
                  <>
                    <div>Month</div>
                    <div>Transactions</div>
                    <div>Avg. Amount</div>
                    <div className="text-right">Total</div>
                  </>
                ) : reportType.includes('Category Analysis') ? (
                  <>
                    <div className="col-span-2">Category</div>
                    <div>Percentage</div>
                    <div className="text-right">Amount</div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2">Team Member</div>
                    <div>Transactions</div>
                    <div className="text-right">Amount</div>
                  </>
                )}
              </div>
              
              {reportType.includes('Expense Summary') ? (
                monthlyExpenseData.map((month, i) => (
                  <div 
                    key={i} 
                    className="grid grid-cols-4 p-3 border-b last:border-0 text-sm"
                  >
                    <div>{month.month}</div>
                    <div>{Math.round(month.amount / 250)}</div>
                    <div>{CURRENCY.format(month.amount / Math.round(month.amount / 250))}</div>
                    <div className="text-right font-semibold">{CURRENCY.format(month.amount)}</div>
                  </div>
                ))
              ) : reportType.includes('Category Analysis') ? (
                categoryData.map((category, i) => (
                  <div 
                    key={i} 
                    className="grid grid-cols-4 p-3 border-b last:border-0 text-sm"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      {category.category}
                    </div>
                    <div>{category.percentage}%</div>
                    <div className="text-right font-semibold">{CURRENCY.format(category.amount)}</div>
                  </div>
                ))
              ) : (
                teamData.map((member, i) => (
                  <div 
                    key={i} 
                    className="grid grid-cols-4 p-3 border-b last:border-0 text-sm"
                  >
                    <div className="col-span-2">{member.name}</div>
                    <div>{member.transactions}</div>
                    <div className="text-right font-semibold">{CURRENCY.format(member.amount)}</div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4 pb-4 border-t">
          <div className="text-sm text-muted-foreground">
            Generated on {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm">
              <Mail className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
