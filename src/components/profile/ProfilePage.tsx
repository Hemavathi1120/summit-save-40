import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Phone, FileText, LogOut, Save, ArrowLeft } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userProfile?.displayName || '',
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      phoneNumber: userProfile?.phoneNumber || '',
      bio: userProfile?.bio || '',
    },
  });

  async function onSubmit(data: ProfileForm) {
    setIsLoading(true);
    try {
      await updateUserProfile(data);
      toast({
        title: 'Profile updated!',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (!currentUser || !userProfile) {
    return null;
  }

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
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow float">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Profile Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="btn-premium rounded-xl border-2 hover:border-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card className="card-glass rounded-2xl p-8 border-2 border-border/20 hover-glow">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-hero flex items-center justify-center shadow-glow">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{userProfile.displayName || 'User'}</h2>
                  <p className="text-muted-foreground text-sm break-all">{currentUser.email}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Active Member
                  </div>
                </div>

                <div className="pt-4 border-t border-border/30">
                  <div className="text-xs text-muted-foreground">
                    Member since {userProfile.createdAt instanceof Date 
                      ? userProfile.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    }
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="card-glass rounded-2xl border-2 border-border/20">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  Personal Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Display Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Your display name" 
                              disabled={isLoading}
                              className="input-premium rounded-xl h-12 px-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Your first name" 
                                disabled={isLoading}
                                className="input-premium rounded-xl h-12 px-4"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Your last name" 
                                disabled={isLoading}
                                className="input-premium rounded-xl h-12 px-4"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="Your phone number"
                                className="input-premium rounded-xl h-12 pl-12 pr-4"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell us a little about yourself..."
                              className="input-premium rounded-xl min-h-[120px] p-4 resize-none"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-6 border-t border-border/30">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="btn-premium btn-glow bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 h-12 rounded-xl w-full md:w-auto"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving Changes...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}