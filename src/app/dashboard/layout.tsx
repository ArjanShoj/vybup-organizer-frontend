'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import Sidebar from '@/components/dashboard/sidebar';
import { apiClient } from '@/lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        
        if (!token) {
          router.push('/auth/signin');
          return;
        }

        // Verify token by attempting to fetch profile
        await apiClient.getProfile();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, redirect to signin
        apiClient.clearToken();
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Sidebar />
      
      {/* Main content */}
      <div className="lg:pl-64 min-h-screen">
        <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default DashboardLayout;