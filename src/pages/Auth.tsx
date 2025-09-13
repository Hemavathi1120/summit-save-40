import React, { useState, useEffect } from 'react';
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';
import { FirebaseSetup } from '@/components/FirebaseSetup';
import { isConfigured } from '@/config/firebase';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect to home if user is already logged in - with replace:true for cleaner history
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  // Show setup screen if Firebase is not configured
  if (!isConfigured) {
    return <FirebaseSetup />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white p-4">
      {/* Theme toggle button */}
      <div className="fixed top-0 right-0 m-4 z-50">
        <div className="backdrop-blur-sm bg-background/30 p-1.5 rounded-full shadow-sm hover:shadow-md transition-all">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Left side branding */}
      <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center mb-8 md:mb-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">DTS</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">
            EXPENSE MANAGER
          </h1>
          <p className="text-xl mb-6 text-muted-foreground">
            By HEMAVATHI from Dream Team Services
          </p>
          <p className="text-muted-foreground max-w-md">
            Track expenses, manage budgets, and analyze your 
            spending patterns with our intuitive expense management
            platform.
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