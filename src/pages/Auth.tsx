import React, { useState } from 'react';
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';
import { FirebaseSetup } from '@/components/FirebaseSetup';
import { isConfigured } from '@/config/firebase';

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  // Show setup screen if Firebase is not configured
  if (!isConfigured) {
    return <FirebaseSetup />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {isSignIn ? (
          <SignIn onSwitchToSignUp={() => setIsSignIn(false)} />
        ) : (
          <SignUp onSwitchToSignIn={() => setIsSignIn(true)} />
        )}
      </div>
    </div>
  );
}