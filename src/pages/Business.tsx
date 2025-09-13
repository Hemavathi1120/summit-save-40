import React, { useState } from 'react';
import { useNavigate } from '../hooks/use-navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { BackButton } from '@/components/ui/back-button';
import {
  BarChart3,
  Building,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  LucideIcon,
  PieChart,
  Plus,
  Receipt,
  Send,
  Settings,
  Smartphone,
  Tag,
  TrendingUp,
  Upload,
  UserPlus,
  Users
} from 'lucide-react';
import { BusinessExpenseModal } from '@/components/business/BusinessExpenseModal';
import { PremiumUpgradeModal } from '@/components/business/PremiumUpgradeModal';
import { CategoryModal } from '@/components/business/CategoryModal';
import { ApprovalStatusModal } from '@/components/business/ApprovalStatusModal';
import { TeamMemberModal } from '@/components/business/TeamMemberModal';
import { RoleSettingsModal } from '@/components/business/RoleSettingsModal';
import { MemberSettingsModal } from '@/components/business/MemberSettingsModal';
import { ReportViewModal } from '@/components/business/ReportViewModal';
import { ReportScheduleModal } from '@/components/business/ReportScheduleModal';
import { SendReportsModal } from '@/components/business/SendReportsModal';
import { BusinessProfileModal } from '@/components/business/BusinessProfileModal';
import { BillingSubscriptionModal } from '@/components/business/BillingSubscriptionModal';
import { TaxSettingsModal } from '@/components/business/TaxSettingsModal';
import { NotificationsModal } from '@/components/business/NotificationsModal';
import { DataManagementModal } from '@/components/business/DataManagementModal';
import { ExpensePolicyModal } from '@/components/business/ExpensePolicyModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CURRENCY } from '@/config/text.constants';

// Sample data
const TEAM_MEMBERS = [
  { id: 1, name: 'John Doe', role: 'Admin', avatar: '/avatars/01.png', email: 'john@example.com' },
  { id: 2, name: 'Sarah Smith', role: 'Manager', avatar: '/avatars/02.png', email: 'sarah@example.com' },
  { id: 3, name: 'Mike Johnson', role: 'Member', avatar: '/avatars/03.png', email: 'mike@example.com' },
];

const RECENT_EXPENSES = [
  { id: 1, title: 'Office Supplies', amount: 234.56, category: 'Office', date: '2023-06-15', status: 'approved', employee: 'John Doe' },
  { id: 2, title: 'Client Lunch', amount: 89.99, category: 'Meals', date: '2023-06-14', status: 'pending', employee: 'Sarah Smith' },
  { id: 3, title: 'Software License', amount: 599.00, category: 'Software', date: '2023-06-10', status: 'approved', employee: 'Mike Johnson' },
  { id: 4, title: 'Travel - Conference', amount: 1250.00, category: 'Travel', date: '2023-06-05', status: 'approved', employee: 'John Doe' },
];

const BUSINESS_CATEGORIES = [
  { name: 'Office Supplies', percentage: 15, color: 'bg-blue-500' },
  { name: 'Marketing', percentage: 25, color: 'bg-purple-500' },
  { name: 'Travel', percentage: 20, color: 'bg-yellow-500' },
  { name: 'Software', percentage: 18, color: 'bg-green-500' },
  { name: 'Meals', percentage: 12, color: 'bg-pink-500' },
  { name: 'Other', percentage: 10, color: 'bg-gray-500' },
];

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  trend?: number;
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, description, trend, className }: StatCardProps) => (
  <Card className={`rounded-xl border shadow-sm ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend !== undefined && (
        <div className="flex items-center mt-2">
          {trend > 0 ? (
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <TrendingUp className="h-3 w-3 text-red-500 mr-1 transform rotate-180" />
          )}
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function BusinessPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [teamMemberModalOpen, setTeamMemberModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  
  // Settings section state variables
  const [businessProfileModalOpen, setBusinessProfileModalOpen] = useState(false);
  const [billingSubscriptionModalOpen, setBillingSubscriptionModalOpen] = useState(false);
  const [taxSettingsModalOpen, setTaxSettingsModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [dataManagementModalOpen, setDataManagementModalOpen] = useState(false);
  const [expensePolicyModalOpen, setExpensePolicyModalOpen] = useState(false);
  
  // New state variables for expense management
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{name: string; color: string} | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{title: string; count: number; color: string} | null>(null);
  
  // Team management state variables
  const [memberSettingsModalOpen, setMemberSettingsModalOpen] = useState(false);
  const [roleSettingsModalOpen, setRoleSettingsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{role: string; description: string; count: number} | null>(null);
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);
  
  // Reports management state variables
  const [reportViewModalOpen, setReportViewModalOpen] = useState(false);
  const [reportScheduleModalOpen, setReportScheduleModalOpen] = useState(false);
  const [sendReportsModalOpen, setSendReportsModalOpen] = useState(false);
  const [selectedScheduledReport, setSelectedScheduledReport] = useState<{
    name: string;
    schedule: string;
    recipients: string;
    lastSent?: string;
    format: string;
  } | null>(null);
  const [scheduledReports, setScheduledReports] = useState([
    { 
      name: 'Monthly Executive Summary', 
      schedule: 'Monthly', 
      recipients: 'Management Team',
      lastSent: '05/01/2023',
      format: 'PDF'
    },
    { 
      name: 'Weekly Expense Report', 
      schedule: 'Weekly', 
      recipients: 'Finance Team',
      lastSent: '06/12/2023',
      format: 'Excel'
    },
    { 
      name: 'Budget vs Actual', 
      schedule: 'Monthly', 
      recipients: 'All Team Leaders',
      lastSent: '05/01/2023',
      format: 'PDF'
    },
  ]);
  const [categories, setCategories] = useState([
    { name: 'Office Supplies', color: '#3b82f6' },
    { name: 'Software & Subscriptions', color: '#8b5cf6' },
    { name: 'Travel & Accommodation', color: '#f59e0b' },
    { name: 'Meals & Entertainment', color: '#ec4899' },
    { name: 'Marketing & Advertising', color: '#10b981' },
    { name: 'Professional Services', color: '#6366f1' },
    { name: 'Equipment & Maintenance', color: '#14b8a6' }
  ]);
  
  // Handler for adding new expense
  const handleAddExpense = (data: any) => {
    console.log('New business expense:', data);
    toast({
      title: "Expense added",
      description: `${data.title || 'New expense'} has been successfully added.`,
    });
    setExpenseModalOpen(false);
  };
  
  // Handler for team member actions
  const handleAddTeamMember = (member: any) => {
    if (member.deleted) {
      setTeamMembers(teamMembers.filter(m => m.id !== member.id));
      toast({
        title: "Team member removed",
        description: `${member.name} has been removed from the team.`,
      });
    } else if (member.id && teamMembers.some(m => m.id === member.id)) {
      // Update existing member
      setTeamMembers(teamMembers.map(m => m.id === member.id ? member : m));
      toast({
        title: "Team member updated",
        description: `${member.name}'s information has been updated.`,
      });
    } else {
      // Add new member
      setTeamMembers([...teamMembers, member]);
      toast({
        title: "Team member added",
        description: `${member.name} has been added to the team.`,
      });
    }
    setTeamMemberModalOpen(false);
  };
  
  const handleMemberSettings = (member: any) => {
    setSelectedMember(member);
    setMemberSettingsModalOpen(true);
  };
  
  const handleMemberSettingsSave = (updatedMember: any) => {
    setTeamMembers(teamMembers.map(m => m.id === updatedMember.id ? updatedMember : m));
    toast({
      title: "Settings updated",
      description: `Settings for ${updatedMember.name} have been updated.`,
    });
    setMemberSettingsModalOpen(false);
  };
  
  const handleRoleSettings = (role: any) => {
    setSelectedRole(role);
    setRoleSettingsModalOpen(true);
  };
  
  const handleRoleSettingsSave = (updatedRole: any) => {
    toast({
      title: "Role updated",
      description: `${updatedRole.role} role settings have been updated.`,
    });
    setRoleSettingsModalOpen(false);
  };
  
  // Handler for report actions
  const handleViewReport = (reportType: string) => {
    if (reportType.includes('Edit ')) {
      const reportName = reportType.replace('Edit ', '');
      const report = scheduledReports.find(r => r.name === reportName);
      if (report) {
        setSelectedScheduledReport(report);
        setReportScheduleModalOpen(true);
      }
    } else if (reportType === 'Create New Report' || reportType === 'Schedule New Report') {
      setSelectedScheduledReport(null);
      setReportScheduleModalOpen(true);
    } else if (reportType === 'Send Reports') {
      setSendReportsModalOpen(true);
    } else {
      setSelectedReport(reportType);
      setReportViewModalOpen(true);
    }
  };
  
  // Handle report schedule save
  const handleReportScheduleSave = (reportData: any) => {
    if (reportData.deleted) {
      // Handle report deletion
      setScheduledReports(scheduledReports.filter(r => r.name !== reportData.name));
      toast({
        title: "Report deleted",
        description: `${reportData.name} has been removed.`,
      });
    } else if (selectedScheduledReport) {
      // Update existing report
      setScheduledReports(scheduledReports.map(r => 
        r.name === selectedScheduledReport.name ? reportData : r
      ));
      toast({
        title: "Report updated",
        description: `${reportData.name} has been updated.`,
      });
    } else {
      // Add new report
      setScheduledReports([...scheduledReports, reportData]);
      toast({
        title: "Report scheduled",
        description: `${reportData.name} has been scheduled.`,
      });
    }
    setReportScheduleModalOpen(false);
  };
  
  // Handle send reports
  const handleSendReports = (data: any) => {
    toast({
      title: "Reports sent",
      description: `${data.reports.length} report(s) sent to recipients.`,
    });
  };
  
  // Handler for settings actions
  const handleSettingClick = (setting: string) => {
    setSelectedSetting(setting);
    
    switch(setting) {
      case 'Business Profile':
        setBusinessProfileModalOpen(true);
        break;
      case 'Billing & Subscription':
        setBillingSubscriptionModalOpen(true);
        break;
      case 'Tax Settings':
        setTaxSettingsModalOpen(true);
        break;
      case 'Notifications':
        setNotificationsModalOpen(true);
        break;
      case 'Data Management':
        setDataManagementModalOpen(true);
        break;
      default:
        toast({
          title: setting,
          description: `Opening ${setting} settings...`,
        });
    }
  };
  
  // Handler for business profile settings
  const handleBusinessProfileSave = (data: any) => {
    toast({
      title: "Business Profile Updated",
      description: "Your business profile has been updated successfully.",
    });
    setBusinessProfileModalOpen(false);
  };
  
  // Handler for billing and subscription settings
  const handleBillingSubscriptionSave = (data: any) => {
    toast({
      title: "Billing Settings Updated",
      description: `Your subscription has been updated to ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)} plan.`,
    });
    setBillingSubscriptionModalOpen(false);
  };
  
  // Handler for tax settings
  const handleTaxSettingsSave = (data: any) => {
    toast({
      title: "Tax Settings Updated",
      description: "Your tax settings have been updated successfully.",
    });
    setTaxSettingsModalOpen(false);
  };
  
  // Handler for notification settings
  const handleNotificationSettingsSave = (data: any) => {
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification settings have been saved.",
    });
    setNotificationsModalOpen(false);
  };
  
  // Handler for data management settings
  const handleDataManagementSave = (data: any) => {
    toast({
      title: "Data Settings Updated",
      description: "Your data management settings have been updated.",
    });
    setDataManagementModalOpen(false);
  };
  
  // Handler for data export
  const handleDataExport = (format: string) => {
    toast({
      title: "Data Export Initiated",
      description: `Exporting your data in ${format.toUpperCase()} format.`,
    });
  };
  
  // Handler for data import
  const handleDataImport = (file: File | null) => {
    if (file) {
      toast({
        title: "Data Import Initiated",
        description: `Importing data from ${file.name}.`,
      });
    }
    setDataManagementModalOpen(false);
  };
  
  // Handler for expense policy
  const handleExpensePolicySave = (data: any) => {
    toast({
      title: "Expense Policy Updated",
      description: "Your expense policy has been updated successfully.",
    });
    setExpensePolicyModalOpen(false);
  };
  
  // Handler for expense actions
  const handleExpenseAction = (expenseOrAction: any, expense?: any) => {
    if (typeof expenseOrAction === 'string') {
      // Handle as action string
      const action = expenseOrAction;
      if (expense) {
        setSelectedExpense(expense);
      }
      
      toast({
        title: `Expense ${action}`,
        description: expense ? `${action} expense: ${expense.title}` : `${action} expenses`,
      });
    } else {
      // Handle as expense object
      const expenseObj = expenseOrAction;
      setSelectedExpense(expenseObj);
      toast({
        title: "Expense details",
        description: `Viewing details for ${expenseObj.title}.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Business Expense Modal */}
      <BusinessExpenseModal 
        isOpen={expenseModalOpen} 
        onClose={() => setExpenseModalOpen(false)} 
        onSubmit={handleAddExpense} 
      />
      
      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
      
      {/* Category Modal */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        category={selectedCategory}
        onSave={(categoryData) => {
          if (selectedCategory) {
            // Edit existing category
            setCategories(categories.map(c => 
              c.name === selectedCategory.name ? categoryData : c
            ));
            toast({
              title: "Category updated",
              description: `${categoryData.name} has been updated`
            });
          } else {
            // Add new category
            setCategories([...categories, categoryData]);
            toast({
              title: "Category added",
              description: `${categoryData.name} has been added`
            });
          }
          setCategoryModalOpen(false);
        }}
      />
      
      {/* Approval Status Modal */}
      <ApprovalStatusModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        status={selectedStatus || {title: '', count: 0, color: ''}}
      />
      
      {/* Team Member Modal */}
      <TeamMemberModal
        isOpen={teamMemberModalOpen}
        onClose={() => setTeamMemberModalOpen(false)}
        onSave={handleAddTeamMember}
        member={selectedMember}
      />
      
      {/* Member Settings Modal */}
      <MemberSettingsModal
        isOpen={memberSettingsModalOpen}
        onClose={() => setMemberSettingsModalOpen(false)}
        onSave={handleMemberSettingsSave}
        member={selectedMember || null}
      />
      
      {/* Role Settings Modal */}
      <RoleSettingsModal
        isOpen={roleSettingsModalOpen}
        onClose={() => setRoleSettingsModalOpen(false)}
        onSave={handleRoleSettingsSave}
        role={selectedRole}
      />
      
      {/* Report View Modal */}
      <ReportViewModal
        isOpen={reportViewModalOpen}
        onClose={() => setReportViewModalOpen(false)}
        reportType={selectedReport || ''}
      />
      
      {/* Report Schedule Modal */}
      <ReportScheduleModal
        isOpen={reportScheduleModalOpen}
        onClose={() => setReportScheduleModalOpen(false)}
        onSave={handleReportScheduleSave}
        report={selectedScheduledReport}
        isNew={!selectedScheduledReport}
      />
      
      {/* Send Reports Modal */}
      <SendReportsModal
        isOpen={sendReportsModalOpen}
        onClose={() => setSendReportsModalOpen(false)}
        onSend={handleSendReports}
        scheduledReports={scheduledReports}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 glass bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton 
              destination="/profile" 
              size="md"
              variant="subtle"
              className="hover:shadow-md"
            />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Business Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Dream Team Services
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl border-2"
              onClick={() => {
                toast({
                  title: "Import Data",
                  description: "Data import functionality is coming soon.",
                  variant: "default",
                });
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button 
              size="sm" 
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              onClick={() => setExpenseModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Expense
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Business Overview */}
        <div className="mb-8">
          <Card className="rounded-xl border-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-1">Dream Team Services</h2>
                    <p className="text-sm text-muted-foreground">Business Account • Trial ends in 14 days</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Registration</p>
                      <p className="font-medium">BUS123456789</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Type</p>
                      <p className="font-medium">Technology Services</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Billing Cycle</p>
                      <p className="font-medium">Monthly</p>
                    </div>
                    <div 
                      className="cursor-pointer hover:bg-accent/30 p-1 rounded-md transition-colors"
                      onClick={() => setPremiumModalOpen(true)}
                    >
                      <p className="text-sm text-muted-foreground">Team Members</p>
                      <p className="font-medium">3 of 5 seats filled</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Click to upgrade for more seats</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between lg:w-1/3">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Subscription Plan</h3>
                      <p className="text-sm text-muted-foreground">Business Trial</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                      Trial
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Trial Usage</span>
                        <span>57%</span>
                      </div>
                      <Progress value={57} className="h-2" />
                    </div>
                    
                    <Button 
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                      onClick={() => setPremiumModalOpen(true)}
                    >
                      Upgrade to Premium
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs Section */}
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-5 h-10 rounded-lg p-1">
              <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">
                Overview
              </TabsTrigger>
              <TabsTrigger value="expenses" className="rounded-md data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">
                Expenses
              </TabsTrigger>
              <TabsTrigger value="team" className="rounded-md data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">
                Team
              </TabsTrigger>
              <TabsTrigger value="reports" className="rounded-md data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">
                Reports
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-md data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Monthly Budget"
                value={CURRENCY.format(12500)}
                icon={DollarSign}
                description="Total monthly budget"
                trend={5}
              />
              <StatCard 
                title="Expenses MTD"
                value={CURRENCY.format(7842.32)}
                icon={CreditCard}
                description="Month to date expenses"
                trend={-2}
              />
              <StatCard 
                title="Expense Claims"
                value="14"
                icon={Receipt}
                description="Pending approval"
              />
              <StatCard 
                title="Team Spending"
                value={CURRENCY.format(2156.40)}
                icon={Users}
                description="Last 7 days"
                trend={12}
              />
            </div>

            {/* Recent Activity and Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Expenses */}
              <Card className="lg:col-span-2 rounded-xl border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Recent Expenses</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => setActiveTab('expenses')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {RECENT_EXPENSES.map(expense => (
                      <div 
                        key={expense.id} 
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedExpense(expense);
                          setExpenseModalOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{expense.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                              <span>{expense.employee}</span>
                              <span>•</span>
                              <span>{new Date(expense.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={expense.status === 'approved' ? 'outline' : 'secondary'} className={`
                            ${expense.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800' : 
                              'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800'}
                          `}>
                            {expense.status === 'approved' ? 'Approved' : 'Pending'}
                          </Badge>
                          <span className="font-semibold">{CURRENCY.format(expense.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Expense Categories */}
              <Card className="rounded-xl border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Expense Categories</CardTitle>
                  <CardDescription>Breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {BUSINESS_CATEGORIES.map(category => (
                      <div key={category.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-sm font-medium">{category.percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div 
                            className={`h-2 rounded-full ${category.color}`} 
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewReport('Expense Categories')}
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    View Detailed Report
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Add Team Member', icon: UserPlus, color: 'bg-blue-500', handler: () => {
                  setActiveTab('team');
                  setTimeout(() => {
                    setSelectedMember(null);
                    setTeamMemberModalOpen(true);
                  }, 100);
                }},
                { title: 'Create Budget', icon: BarChart3, color: 'bg-purple-500', handler: () => {
                  toast({
                    title: "Create Budget",
                    description: "Budget creation feature opened.",
                  });
                }},
                { title: 'Expense Policy', icon: FileText, color: 'bg-amber-500', handler: () => {
                  setActiveTab('settings');
                  toast({
                    title: "Expense Policy",
                    description: "Viewing expense policy settings.",
                  });
                }},
                { title: 'Tax Settings', icon: Settings, color: 'bg-green-500', handler: () => {
                  setActiveTab('settings');
                  handleSettingClick('Tax Settings');
                }}
              ].map((action, i) => (
                <Card 
                  key={i} 
                  className="rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={action.handler}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-sm">{action.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="rounded-xl border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
                  <CardDescription>Manage your business team</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="rounded-xl border-blue-400 text-blue-700 dark:text-blue-400"
                    onClick={() => setPremiumModalOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                      <path d="M5 3v4"/>
                      <path d="M19 17v4"/>
                      <path d="M3 5h4"/>
                      <path d="M17 19h4"/>
                    </svg>
                    Upgrade
                  </Button>
                  <Button 
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                    onClick={() => {
                      setSelectedMember(null);
                      setTeamMemberModalOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div 
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => {
                          setSelectedMember(member);
                          setTeamMemberModalOpen(true);
                        }}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                          {member.role}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMemberSettings(member)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-xl border shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Roles & Permissions</CardTitle>
                      <CardDescription>Manage access levels for team members</CardDescription>
                    </div>
                    <Button
                      variant="outline" 
                      size="sm"
                      className="rounded-xl text-sm border-blue-400 text-blue-700 dark:text-blue-400"
                      onClick={() => setPremiumModalOpen(true)}
                    >
                      Upgrade for more roles
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { role: 'Admin', description: 'Full access to all features', count: 1 },
                    { role: 'Manager', description: 'Can approve expenses and manage team', count: 1 },
                    { role: 'Member', description: 'Can submit expenses and view reports', count: 3 },
                    { role: 'Viewer', description: 'Read-only access to reports', count: 0 },
                  ].map((role, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{role.role}</h4>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{role.count}</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRoleSettings(role)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-xl border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Team Activity</CardTitle>
                  <CardDescription>Recent actions by team members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { user: 'John Doe', action: 'approved an expense', time: '2 hours ago' },
                    { user: 'Sarah Smith', action: 'submitted a new expense', time: '4 hours ago' },
                    { user: 'Mike Johnson', action: 'updated expense policy', time: 'yesterday' },
                    { user: 'John Doe', action: 'added a new category', time: '3 days ago' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>
                          {' '}{activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Available Reports</h3>
              <Button 
                variant="outline" 
                className="rounded-xl"
                onClick={() => handleViewReport('Send Reports')}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Reports
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="rounded-xl border shadow-sm hover:shadow-md transition-colors cursor-pointer"
                onClick={() => handleViewReport('Expense Summary')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Expense Summary</h3>
                    <p className="text-sm text-muted-foreground">Monthly breakdown of all expenses</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="rounded-xl border shadow-sm hover:shadow-md transition-colors cursor-pointer"
                onClick={() => handleViewReport('Category Analysis')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <PieChart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Category Analysis</h3>
                    <p className="text-sm text-muted-foreground">Spending breakdown by categories</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="rounded-xl border shadow-sm hover:shadow-md transition-colors cursor-pointer"
                onClick={() => handleViewReport('Team Spending')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Users className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Team Spending</h3>
                    <p className="text-sm text-muted-foreground">Expenses by team member</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="rounded-xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Scheduled Reports</CardTitle>
                <CardDescription>Automatically generated reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduledReports.map((report, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{report.schedule}</span>
                        <span>•</span>
                        <span>{report.recipients}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReport(`Edit ${report.name}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full rounded-xl"
                  onClick={() => handleViewReport('Create New Report')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-xl border shadow-sm col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Business Settings</CardTitle>
                  <CardDescription>Manage your business profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: 'Business Profile', icon: Building, description: 'Company details and info' },
                    { title: 'Billing & Subscription', icon: CreditCard, description: 'Manage payment methods' },
                    { title: 'Tax Settings', icon: FileText, description: 'Tax rates and reporting' },
                    { title: 'Notifications', icon: Smartphone, description: 'Alert preferences' },
                    { title: 'Data Management', icon: Settings, description: 'Import and export data' },
                  ].map((setting, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => handleSettingClick(setting.title)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <setting.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{setting.title}</h4>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-xl border shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Expense Policy</CardTitle>
                  <CardDescription>Set guidelines for expense submissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Approval Workflow</h4>
                    <div className="space-y-2">
                      {[
                        { role: 'Team Members', action: 'Submit expenses' },
                        { role: 'Managers', action: 'First level approval for their team' },
                        { role: 'Finance Team', action: 'Final approval and processing' },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            {i+1}
                          </div>
                          <div>
                            <p className="font-medium">{step.role}</p>
                            <p className="text-xs text-muted-foreground">{step.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Spending Limits</h4>
                    <div className="space-y-2">
                      {[
                        { category: 'Meals (per person)', limit: '₹1,200.00' },
                        { category: 'Accommodation (per night)', limit: '₹4,000.00' },
                        { category: 'Air Travel', limit: 'Economy Class' },
                        { category: 'Software Purchases', limit: 'Manager Approval' },
                      ].map((limit, i) => (
                        <div key={i} className="flex justify-between items-center p-2 rounded border">
                          <span className="text-sm">{limit.category}</span>
                          <Badge variant="secondary">{limit.limit}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required Documentation</h4>
                    <div className="space-y-2">
                      {[
                        'Receipts required for all expenses over ₹500',
                        'Itemized receipts for meals and entertainment',
                        'Purpose of expense must be documented',
                        'Client name required for business development expenses'
                      ].map((rule, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full rounded-xl"
                    onClick={() => setExpensePolicyModalOpen(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Edit Expense Policy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <Card className="rounded-xl border shadow-sm w-full md:w-auto">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Expense Claims</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold">14</span>
                        <span className="text-sm text-muted-foreground">pending</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => {
                    toast({
                      title: "Import Expenses",
                      description: "Import functionality opened.",
                    });
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => {
                    toast({
                      title: "Export Expenses",
                      description: "Export functionality opened.",
                    });
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                  onClick={() => {
                    setSelectedExpense(null);
                    setExpenseModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Expense
                </Button>
              </div>
            </div>

            <Card className="rounded-xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Business Expenses</CardTitle>
                <CardDescription>Manage and track all business expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-6 p-3 border-b font-medium text-sm">
                      <div className="col-span-2">Description</div>
                      <div>Category</div>
                      <div>Employee</div>
                      <div>Date</div>
                      <div className="text-right">Amount</div>
                    </div>
                    
                    {[...RECENT_EXPENSES, ...RECENT_EXPENSES].slice((currentPage - 1) * 4, currentPage * 4).map((expense, i) => (
                      <div 
                        key={i} 
                        className="grid grid-cols-6 p-3 border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedExpense(expense);
                          setExpenseModalOpen(true);
                        }}
                      >
                        <div className="col-span-2 font-medium">{expense.title}</div>
                        <div>{expense.category}</div>
                        <div>{expense.employee}</div>
                        <div>{new Date(expense.date).toLocaleDateString()}</div>
                        <div className="text-right font-semibold">{CURRENCY.format(expense.amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing page {currentPage} of 3 ({(currentPage - 1) * 4 + 1}-{Math.min(currentPage * 4, 12)} of 12 expenses)
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        toast({
                          title: "Page changed",
                          description: `Viewing page ${currentPage - 1}`
                        });
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      toast({
                        title: "Page changed",
                        description: `Viewing page ${currentPage + 1}`
                      });
                    }}
                  >
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-xl border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Expense Categories</CardTitle>
                  <CardDescription>Manage business expense categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.name} className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span>{category.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoryModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full rounded-xl"
                    onClick={() => {
                      setSelectedCategory(null);
                      setCategoryModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardFooter>
              </Card>

              <Card className="rounded-xl border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Approval Status</CardTitle>
                  <CardDescription>Track approval workflows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: 'Awaiting Manager Approval', count: 8, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
                    { title: 'Awaiting Finance Review', count: 6, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
                    { title: 'Approved', count: 42, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
                    { title: 'Rejected', count: 3, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
                    { title: 'Reimbursed', count: 37, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
                  ].map((status, i) => (
                    <div 
                      key={i} 
                      className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedStatus(status);
                        setApprovalModalOpen(true);
                      }}
                    >
                      <span>{status.title}</span>
                      <Badge className={status.color}>
                        {status.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Expense Management Modals */}
      <BusinessExpenseModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        onSave={handleAddExpense}
        selectedExpense={selectedExpense}
      />
      
      <CategoryModal 
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        categories={categories}
        selectedCategory={selectedCategory}
        onSave={(category) => {
          if (selectedCategory) {
            setCategories(categories.map(c => c.name === selectedCategory.name ? category : c));
          } else {
            setCategories([...categories, category]);
          }
          toast({
            title: selectedCategory ? "Category updated" : "Category added",
            description: `${category.name} has been ${selectedCategory ? "updated" : "added"} successfully.`,
          });
          setCategoryModalOpen(false);
        }}
      />
      
      <ApprovalStatusModal 
        open={approvalModalOpen}
        onOpenChange={setApprovalModalOpen}
        selectedStatus={selectedStatus}
        onSave={(status) => {
          toast({
            title: "Status updated",
            description: `${status.title} status has been updated.`,
          });
          setApprovalModalOpen(false);
        }}
      />
      
      {/* Premium Modal */}
      <PremiumUpgradeModal
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
      />
      
      {/* Team Management Modals */}
      <TeamMemberModal
        open={teamMemberModalOpen}
        onOpenChange={setTeamMemberModalOpen}
        onSave={handleAddTeamMember}
        selectedMember={selectedMember}
      />
      
      <RoleSettingsModal
        open={roleSettingsModalOpen}
        onOpenChange={setRoleSettingsModalOpen}
        selectedRole={selectedRole}
        onSave={handleRoleSettingsSave}
      />
      
      <MemberSettingsModal
        open={memberSettingsModalOpen}
        onOpenChange={setMemberSettingsModalOpen}
        selectedMember={selectedMember}
        onSave={handleMemberSettingsSave}
      />
      
      {/* Reports Modals */}
      <ReportViewModal
        open={reportViewModalOpen}
        onOpenChange={setReportViewModalOpen}
        reportType={selectedReport}
      />
      
      <ReportScheduleModal
        open={reportScheduleModalOpen}
        onOpenChange={setReportScheduleModalOpen}
        selectedReport={selectedScheduledReport}
        onSave={handleReportScheduleSave}
      />
      
      <SendReportsModal
        open={sendReportsModalOpen}
        onOpenChange={setSendReportsModalOpen}
        onSend={handleSendReports}
      />
      
      {/* Settings Section Modals */}
      <BusinessProfileModal
        isOpen={businessProfileModalOpen}
        onClose={() => setBusinessProfileModalOpen(false)}
        onSave={handleBusinessProfileSave}
      />
      
      <BillingSubscriptionModal
        isOpen={billingSubscriptionModalOpen}
        onClose={() => setBillingSubscriptionModalOpen(false)}
        onSave={handleBillingSubscriptionSave}
      />
      
      <TaxSettingsModal
        isOpen={taxSettingsModalOpen}
        onClose={() => setTaxSettingsModalOpen(false)}
        onSave={handleTaxSettingsSave}
      />
      
      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        onSave={handleNotificationSettingsSave}
      />
      
      <DataManagementModal
        isOpen={dataManagementModalOpen}
        onClose={() => setDataManagementModalOpen(false)}
        onSave={handleDataManagementSave}
        onExport={handleDataExport}
        onImport={handleDataImport}
      />
      
      <ExpensePolicyModal
        isOpen={expensePolicyModalOpen}
        onClose={() => setExpensePolicyModalOpen(false)}
        onSave={handleExpensePolicySave}
      />
    </div>
  );
}