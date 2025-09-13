import React from 'react';
import { useNavigate } from '../hooks/use-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  BarChart3, 
  User, 
  ChevronRight, 
  PieChart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CURRENCY } from '@/config/text.constants';

export default function SimplifiedHome() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  
  if (!currentUser || !userProfile) {
    return null;
  }
  
  const handleShowTips = () => {
    toast({
      title: "Quick tips",
      description: "Check your expense analytics for insights on your spending habits.",
      variant: "default",
    });
  };
  
  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Header */}
      <header className="container mx-auto px-6 py-12 mb-4">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">ExpenseFlow</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Premium expense management by HEMAVATHI from Dream Team Services
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Account Selection Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Choose an Account</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Account Card */}
            <Card 
              className="rounded-2xl border-2 border-border/20 bg-gradient-to-r from-green-100/60 to-green-200/40 dark:from-green-900/40 dark:to-green-800/30 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/personal')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Personal Account
                </CardTitle>
                <CardDescription>
                  Manage your personal expenses, budgets, and finances
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Active
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last activity</span>
                    <span className="text-sm">Today</span>
                  </div>
                  
                  <Button 
                    className="w-full rounded-xl mt-2 bg-gradient-to-r from-green-600 to-teal-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/personal');
                    }}
                  >
                    Go to Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Business Account Card */}
            <Card 
              className="rounded-2xl border-2 border-border/20 bg-gradient-to-r from-blue-100/60 to-blue-200/40 dark:from-blue-900/40 dark:to-blue-800/30 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/business')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  Business Account
                </CardTitle>
                <CardDescription>
                  Advanced tools for business expense management
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      Trial Mode
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Team members</span>
                    <span className="text-sm">3/5</span>
                  </div>
                  
                  <Button 
                    className="w-full rounded-xl mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/business');
                    }}
                  >
                    Go to Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Quick Overview Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Overview</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Budget</p>
                  <p className="text-2xl font-semibold">{CURRENCY.format(52000)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-semibold">{CURRENCY.format(19200)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Savings Rate</p>
                  <p className="text-2xl font-semibold">62%</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-semibold">9</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Profile and Settings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Profile Settings</p>
                  <p className="text-sm text-muted-foreground">Manage your account</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={handleShowTips}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium">Tips & Insights</p>
                  <p className="text-sm text-muted-foreground">Get financial advice</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => window.open('https://dreamteamservices.com/help', '_blank')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Support</p>
                  <p className="text-sm text-muted-foreground">Contact Dream Team</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-6 py-12 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dream Team Services. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8">
            <button className="text-sm text-muted-foreground hover:text-foreground">Privacy</button>
            <button className="text-sm text-muted-foreground hover:text-foreground">Terms</button>
            <button className="text-sm text-muted-foreground hover:text-foreground">Help</button>
          </div>
        </div>
      </footer>
    </div>
  );
}