'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (token) {
      // Redirect to dashboard if authenticated
      router.replace('/dashboard');
    } else {
      // Redirect to sign in page if not authenticated
      router.replace('/auth/signin');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
    </div>
  );
};

export default HomePage;