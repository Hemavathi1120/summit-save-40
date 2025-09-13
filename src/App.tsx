import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Auth from './pages/Auth';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import Expenses from './pages/Expenses';
import Index from './pages/Index';
import SimplifiedHome from './pages/SimplifiedHome';
import Wallets from './pages/Wallets';
import BusinessPage from './pages/Business';
import { ProfilePage } from './components/profile/ProfilePage';
import { Layout } from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';

function AuthRedirect() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return null;
}

function AuthProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-pulse rounded-full bg-gradient-primary" />
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<AuthProtectedRoute />}>
        <Route path="/" element={<SimplifiedHome />} />
        <Route path="/personal" element={<Index />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/business" element={<BusinessPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <ScrollToTop />
          <AppRoutes />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
