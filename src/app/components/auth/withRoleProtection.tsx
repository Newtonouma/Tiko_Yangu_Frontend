import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

interface WithRoleProtectionProps {
  allowedRoles: string[];
  fallbackPath?: string;
}

export function withRoleProtection<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  { allowedRoles, fallbackPath = '/login' }: WithRoleProtectionProps
) {
  return function ProtectedComponent(props: T) {
    const { user, isLoading: loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (loading) {
        return; // Still loading auth state
      }

      if (!user) {
        // Not authenticated, redirect to login
        router.push(fallbackPath);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        // User doesn't have required role, redirect to unauthorized page
        router.push('/unauthorized');
        return;
      }

      // User is authorized
      setIsAuthorized(true);
      setIsLoading(false);
    }, [user, loading, router]);

    if (isLoading || loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthorized) {
      return null; // Will redirect
    }

    return <WrappedComponent {...props} />;
  };
}

// Convenience wrappers for specific roles
export const withAdminProtection = <T extends object>(
  component: React.ComponentType<T>
) => withRoleProtection(component, { allowedRoles: ['admin'] });

export const withOrganizerProtection = <T extends object>(
  component: React.ComponentType<T>
) => withRoleProtection(component, { allowedRoles: ['event_organizer'] });

export const withDashboardProtection = <T extends object>(
  component: React.ComponentType<T>
) => withRoleProtection(component, { allowedRoles: ['admin', 'event_organizer'] });