import React, { useState } from 'react';
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';
import { FirebaseSetup } from '@/components/FirebaseSetup';
import { isConfigured } from '@/config/firebase';
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  // Show setup screen if Firebase is not configured
  if (!isConfigured) {
    return <FirebaseSetup />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {/* Left side branding */}
      <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center mb-8 md:mb-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">DTS</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            SUMMIT SAVE
          </h1>
          <p className="text-xl mb-6 text-muted-foreground">
            By HEMAVATHI from Dream Team Services
          </p>
          <p className="text-muted-foreground max-w-md">
            Track expenses, manage budgets, and analyze your spending patterns with 
            our intuitive expense management platform.
          </p>
        </motion.div>
      </div>

      {/* Right side auth form */}
      <div className="w-full md:w-1/2 max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? 'signin' : 'signup'}
            initial={{ opacity: 0, x: isSignIn ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignIn ? 100 : -100 }}
            transition={{ duration: 0.3 }}
          >
            {isSignIn ? (
              <SignIn onSwitchToSignUp={() => setIsSignIn(false)} />
            ) : (
              <SignUp onSwitchToSignIn={() => setIsSignIn(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}