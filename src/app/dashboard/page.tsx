'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect based on user role
    if (user.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (user.role === 'event_organizer') {
      router.push('/dashboard/organizer');
    } else {
      router.push('/unauthorized');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-white mt-4">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}