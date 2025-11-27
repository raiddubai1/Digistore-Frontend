'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('CUSTOMER' | 'VENDOR' | 'ADMIN')[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const getCurrentLocale = () => {
    const localeMatch = pathname?.match(/^\/([a-z]{2})\//);
    return localeMatch ? localeMatch[1] : 'en';
  };

  useEffect(() => {
    if (!loading) {
      const locale = getCurrentLocale();

      // Not authenticated
      if (!user) {
        const loginPath = redirectTo || `/${locale}/login`;
        router.push(loginPath);
        return;
      }

      // Check role authorization
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push(`/${locale}/unauthorized`);
      }
    }
  }, [user, loading, allowedRoles, redirectTo, router, pathname]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

