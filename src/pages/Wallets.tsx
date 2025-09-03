import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Wallet,
  CreditCard,
  Building2,
  PiggyBank,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  MoreVertical
} from 'lucide-react';
import WalletForm from '@/components/WalletForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useExpenseStore } from '@/store/expenseStore';
import { TEXT, CURRENCY } from '@/config/text.constants';

interface WalletAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  balance: number;
  currency: string;
  color: string;
  icon: any;
  isActive: boolean;
  lastTransaction: string;
  monthlyChange: number;
  bank?: string;
}

export default function Wallets() {
  const navigate = useNavigate();
  const { expenses } = useExpenseStore();
  const [showBalances, setShowBalances] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<any>(null);

  // Mock wallet data - in a real app this would come from a store/API
  const [wallets] = useState<WalletAccount[]>([
    {
      id: '1',
      name: 'Primary Checking',
      type: 'checking',
      balance: 4250.75,
      currency: 'USD',
      color: '#3B82F6',
      icon: Building2,
      isActive: true,
      lastTransaction: '2024-01-20',
      monthlyChange: -320.50,
      bank: 'Chase Bank'
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 15680.20,
      currency: 'USD',
      color: '#10B981',
      icon: PiggyBank,
      isActive: true,
      lastTransaction: '2024-01-18',
      monthlyChange: 500.00,
      bank: 'Wells Fargo'
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: -1240.30,
      currency: 'USD',
      color: '#EF4444',
      icon: CreditCard,
      isActive: true,
      lastTransaction: '2024-01-21',
      monthlyChange: -180.75,
      bank: 'American Express'
    },
    {
      id: '4',
      name: 'Cash Wallet',
      type: 'cash',
      balance: 180.00,
      currency: 'USD',
      color: '#F59E0B',
      icon: Wallet,
      isActive: true,
      lastTransaction: '2024-01-19',
      monthlyChange: -45.00
    }
  ]);

  const getWalletTypeLabel = (type: string) => {
    switch (type) {
      case 'checking': return 'Checking Account';
      case 'savings': return 'Savings Account';
      case 'credit': return 'Credit Card';
      case 'cash': return 'Cash';
      default: return type;
    }
  };

  const totalAssets = wallets
    .filter(w => w.type !== 'credit')
    .reduce((sum, wallet) => sum + Math.max(0, wallet.balance), 0);
  
  const totalLiabilities = wallets
    .filter(w => w.type === 'credit')
    .reduce((sum, wallet) => sum + Math.abs(Math.min(0, wallet.balance)), 0);

  const netWorth = totalAssets - totalLiabilities;

  const handleEditWallet = (wallet: any) => {
    setEditingWallet(wallet);
  };

  const handleDeleteWallet = (walletId: string) => {
    // Here you would delete from Firebase
    toast({
      title: 'Account deleted!',
      description: 'The account has been removed successfully.',
    });
  };

  const handleSyncTransactions = () => {
    toast({
      title: 'Syncing transactions...',
      description: 'Your account balances are being updated.',
    });
    
    // Simulate sync process
    setTimeout(() => {
      toast({
        title: 'Sync complete!',
        description: 'All account balances have been updated.',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 glass bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="rounded-xl border-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow float">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Wallet Management</h1>
              <p className="text-sm text-muted-foreground">Manage your accounts and balances</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show Balances</span>
              <Switch 
                checked={showBalances} 
                onCheckedChange={setShowBalances}
              />
              {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </div>
            <Button 
              variant="default" 
              size="lg" 
              className="btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-semibold px-6"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Account
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">
                  {showBalances ? CURRENCY.format(totalAssets) : '••••••'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Liabilities</p>
                <p className="text-2xl font-bold">
                  {showBalances ? CURRENCY.format(totalLiabilities) : '••••••'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-glass rounded-2xl p-6 border-2 border-border/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Worth</p>
                <p className="text-2xl font-bold">
                  {showBalances ? CURRENCY.format(netWorth) : '••••••'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Wallets Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {wallets.map((wallet, index) => {
            const WalletIcon = wallet.icon;
            const isPositive = wallet.monthlyChange > 0;
            
            return (
              <Card 
                key={wallet.id} 
                className="stagger-item card-glass rounded-2xl border-2 border-border/20 hover-lift hover-glow transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-glow"
                        style={{ backgroundColor: wallet.color }}
                      >
                        <WalletIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{wallet.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          {getWalletTypeLabel(wallet.type)}
                          {wallet.bank && (
                            <>
                              <span>•</span>
                              <span>{wallet.bank}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={wallet.isActive ? "default" : "secondary"}>
                        {wallet.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Balance</span>
                      <span className="text-2xl font-bold">
                        {showBalances ? CURRENCY.format(wallet.balance) : '••••••'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/5 border border-border/20">
                      <span className="text-sm text-muted-foreground">Monthly Change</span>
                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {showBalances ? CURRENCY.format(Math.abs(wallet.monthlyChange)) : '••••'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Transaction</span>
                      <span>{new Date(wallet.lastTransaction).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-lg hover-glow"
                        onClick={() => handleEditWallet(wallet)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 rounded-lg hover:border-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="card-glass border-2 border-border/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this account? This will also remove all associated transactions. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="btn-premium">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="btn-premium bg-destructive hover:bg-destructive/90 text-white"
                              onClick={() => handleDeleteWallet(wallet.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="card-glass rounded-2xl p-8 border-2 border-border/20">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              Account Management
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="p-6 h-auto rounded-xl border-2 hover-glow"
                onClick={() => setShowAddForm(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">Add New Account</h4>
                    <p className="text-sm text-muted-foreground">Connect your bank accounts</p>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-6 h-auto rounded-xl border-2 hover-glow"
                onClick={handleSyncTransactions}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">Sync Transactions</h4>
                    <p className="text-sm text-muted-foreground">Update account balances</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Wallet Form Modals */}
      {showAddForm && (
        <WalletForm onClose={() => setShowAddForm(false)} />
      )}
      
      {editingWallet && (
        <WalletForm 
          wallet={editingWallet}
          isEdit={true}
          onClose={() => setEditingWallet(null)} 
        />
      )}
    </div>
  );
}