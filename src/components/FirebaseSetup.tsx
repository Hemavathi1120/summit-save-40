import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, Settings } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export function FirebaseSetup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Theme toggle button */}
      <div className="fixed top-0 right-0 m-4 z-50">
        <div className="backdrop-blur-sm bg-background/30 p-1.5 rounded-full shadow-sm hover:shadow-md transition-all">
          <ThemeToggle />
        </div>
      </div>
      
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Firebase Setup Required</CardTitle>
          <CardDescription className="text-base">
            To use authentication features, you need to configure Firebase for your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                  Configuration Needed
                </h3>
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  The Firebase configuration contains placeholder values. Please follow the setup steps below.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Setup Steps:</h3>
            <ol className="space-y-3 list-decimal list-inside text-sm">
              <li>
                <span className="font-medium">Create a Firebase Project</span>
                <p className="text-muted-foreground ml-4">
                  Go to the Firebase Console and create a new project.
                </p>
              </li>
              <li>
                <span className="font-medium">Enable Authentication</span>
                <p className="text-muted-foreground ml-4">
                  In your Firebase project, go to Authentication → Sign-in method → Enable Email/Password.
                </p>
              </li>
              <li>
                <span className="font-medium">Create Firestore Database</span>
                <p className="text-muted-foreground ml-4">
                  Go to Firestore Database and create a database in production mode.
                </p>
              </li>
              <li>
                <span className="font-medium">Get Configuration</span>
                <p className="text-muted-foreground ml-4">
                  In Project Settings → General → Your apps, copy the Firebase config object.
                </p>
              </li>
              <li>
                <span className="font-medium">Update Code</span>
                <p className="text-muted-foreground ml-4">
                  Replace the placeholder values in <code className="bg-muted px-1 rounded">src/config/firebase.ts</code> with your actual Firebase configuration.
                </p>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={() => window.open('https://console.firebase.google.com', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Firebase Console
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open('https://firebase.google.com/docs/web/setup', '_blank')}
            >
              View Documentation
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Need Help?
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Firebase configuration keys are public and safe to include in your frontend code. 
              They identify your Firebase project but don't provide administrative access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}