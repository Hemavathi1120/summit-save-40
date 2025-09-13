import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import {
  Receipt,
  Calendar as CalendarIcon,
  CreditCard,

  FilePlus,
  Loader2,
  Tag,
  User,
  FileText,
  Building,
  Check,
  X,
  ChevronRight,
  FileCheck,
  Users,
  Paperclip,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { TEXT, CURRENCY, BUSINESS } from '@/config/text.constants';

// Mock team members data
const TEAM_MEMBERS = [
  { id: 1, name: 'John Doe', role: 'Admin', avatar: '/avatars/01.png' },
  { id: 2, name: 'Sarah Smith', role: 'Manager', avatar: '/avatars/02.png' },
  { id: 3, name: 'Mike Johnson', role: 'Member', avatar: '/avatars/03.png' },
];

// Form schema with business-specific fields
const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.date({
    required_error: 'Date is required',
  }),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  expenseType: z.string().min(1, 'Expense type is required'),
  billable: z.boolean().default(false),
  projectCode: z.string().optional(),
  merchant: z.string().min(1, 'Merchant name is required'),
  submittedBy: z.string().min(1, 'Submitter is required'),
  approver: z.string().optional(),
  receiptAttached: z.boolean().default(false),
  taxDeductible: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function BusinessExpenseForm({ onSubmit, onClose }: { onSubmit: (data: any) => void, onClose: () => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const availableTags = BUSINESS.tags;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      title: '',
      description: '',
      category: '',
      date: new Date(),
      paymentMethod: '',
      expenseType: 'regular',
      billable: false,
      projectCode: '',
      merchant: '',
      submittedBy: TEAM_MEMBERS[0].id.toString(),
      receiptAttached: false,
      taxDeductible: true,
      tags: [],
    },
  });
  
  const handleNext = () => {
    if (step === 1) {
      form.trigger(['amount', 'title', 'category', 'date', 'merchant']);
      const hasErrors = !!form.formState.errors.amount || 
                       !!form.formState.errors.title || 
                       !!form.formState.errors.category || 
                       !!form.formState.errors.date ||
                       !!form.formState.errors.merchant;
      
      if (!hasErrors) {
        setStep(2);
      }
    } else if (step === 2) {
      form.trigger(['submittedBy', 'paymentMethod', 'expenseType']);
      const hasErrors = !!form.formState.errors.submittedBy || 
                       !!form.formState.errors.paymentMethod || 
                       !!form.formState.errors.expenseType;
      
      if (!hasErrors) {
        setStep(3);
      }
    }
  };
  
  const handlePrevious = () => {
    setStep(Math.max(1, step - 1));
  };
  
  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Add selected tags to the form data
    data.tags = selectedTags;
    
    try {
      await onSubmit(data);
      toast({
        title: BUSINESS.expenseForm.success,
        description: BUSINESS.expenseForm.successDescription,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting expense:", error);
      toast({
        title: BUSINESS.expenseForm.error,
        description: BUSINESS.expenseForm.errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto rounded-xl border-2 border-border/20 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border-b">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <Receipt className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">{BUSINESS.expenseForm.title}</CardTitle>
            <CardDescription>{BUSINESS.expenseForm.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      {/* Step Indicators */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center w-full">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <div 
              className={`h-1 flex-1 ${
                step > 1 ? 'bg-blue-600' : 'bg-muted'
              }`}
            ></div>
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
            <div 
              className={`h-1 flex-1 ${
                step > 2 ? 'bg-blue-600' : 'bg-muted'
              }`}
            ></div>
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              3
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground mb-8">
          <div className={`text-center flex-1 ${step === 1 ? 'text-primary font-medium' : ''}`}>Basic Info</div>
          <div className={`text-center flex-1 ${step === 2 ? 'text-primary font-medium' : ''}`}>Business Details</div>
          <div className={`text-center flex-1 ${step === 3 ? 'text-primary font-medium' : ''}`}>Review</div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-6 px-6">
            {/* Step 1: Basic Expense Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Expense Title</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter expense title"
                              className="pl-10 h-11 rounded-xl"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                            <Input
                              placeholder="0.00"
                              className="pl-10 h-11 rounded-xl"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="office">Office Supplies</SelectItem>
                            <SelectItem value="software">Software & Subscriptions</SelectItem>
                            <SelectItem value="travel">Travel & Accommodation</SelectItem>
                            <SelectItem value="meals">Meals & Entertainment</SelectItem>
                            <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                            <SelectItem value="services">Professional Services</SelectItem>
                            <SelectItem value="equipment">Equipment & Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal h-11 rounded-xl",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="merchant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Merchant/Vendor</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Enter merchant name"
                            className="pl-10 h-11 rounded-xl"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter detailed description"
                          className="resize-none min-h-[100px] rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
            
            {/* Step 2: Business-specific fields */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="submittedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Submitted By</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl">
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TEAM_MEMBERS.map(member => (
                            <SelectItem key={member.id} value={member.id.toString()} className="flex items-center">
                              {member.name} - {member.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="corporate_card">Corporate Card</SelectItem>
                            <SelectItem value="personal_card">Personal Card (Reimbursement)</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="company_account">Company Account</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Project Code (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter project code"
                            className="h-11 rounded-xl"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="expenseType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">Expense Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value="regular" id="regular" />
                            <label htmlFor="regular" className="flex flex-1 cursor-pointer items-center justify-between">
                              <div>
                                <p className="font-medium">Regular Expense</p>
                                <p className="text-sm text-muted-foreground">Standard business expense</p>
                              </div>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value="recurring" id="recurring" />
                            <label htmlFor="recurring" className="flex flex-1 cursor-pointer items-center justify-between">
                              <div>
                                <p className="font-medium">Recurring Expense</p>
                                <p className="text-sm text-muted-foreground">Repeats on a regular schedule</p>
                              </div>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value="advance" id="advance" />
                            <label htmlFor="advance" className="flex flex-1 cursor-pointer items-center justify-between">
                              <div>
                                <p className="font-medium">Advance Payment</p>
                                <p className="text-sm text-muted-foreground">Prepayment for future expense</p>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="billable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Client Billable</FormLabel>
                          <FormDescription>
                            This expense can be billed to a client
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxDeductible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tax Deductible</FormLabel>
                          <FormDescription>
                            This expense is tax deductible
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormLabel className="text-sm font-medium block mb-2">Tags</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedTags.includes(tag) 
                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800' 
                            : 'hover:bg-accent'
                        } transition-colors`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <Check className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="receiptAttached"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none flex-1">
                        <FormLabel>Receipt Attached</FormLabel>
                        <FormDescription>
                          Mark if you have a receipt for this expense
                        </FormDescription>
                      </div>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        className="text-xs flex items-center gap-1"
                      >
                        <Paperclip className="h-3 w-3" />
                        Upload
                      </Button>
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
            
            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-muted/30 border rounded-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Expense Summary</CardTitle>
                    <CardDescription>Review your expense details before submitting</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Title</p>
                          <p className="font-medium">{form.getValues('title') || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-medium text-lg">{CURRENCY.format(parseFloat(form.getValues('amount') || '0'))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {form.getValues('date') 
                              ? format(form.getValues('date'), 'PPP') 
                              : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Merchant</p>
                          <p className="font-medium">{form.getValues('merchant') || '—'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium capitalize">{form.getValues('category') || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Method</p>
                          <p className="font-medium capitalize">
                            {form.getValues('paymentMethod')?.replace('_', ' ') || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Submitted By</p>
                          <p className="font-medium">
                            {TEAM_MEMBERS.find(
                              m => m.id.toString() === form.getValues('submittedBy')
                            )?.name || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Project Code</p>
                          <p className="font-medium">{form.getValues('projectCode') || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm border rounded-md p-3 bg-background">
                        {form.getValues('description') || 'No description provided.'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Additional Information</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                          {form.getValues('expenseType') === 'regular' ? 'Regular Expense' : 
                           form.getValues('expenseType') === 'recurring' ? 'Recurring Expense' : 
                           'Advance Payment'}
                        </Badge>
                        
                        {form.getValues('billable') && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Client Billable
                          </Badge>
                        )}
                        
                        {form.getValues('taxDeductible') && (
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                            Tax Deductible
                          </Badge>
                        )}
                        
                        {form.getValues('receiptAttached') && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            Receipt Attached
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {selectedTags.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-accent">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Expense Policy Compliance</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        This expense complies with the company expense policy. It will be routed to your manager for approval.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-muted/30 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? onClose : handlePrevious}
              className="rounded-xl"
            >
              {step === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <div className="flex gap-2">
              {step < 3 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>Submit Expense</>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}