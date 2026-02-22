'use client';

import { useAuth } from '@/core/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AuthGuard = ({ children, requiredPermissions = [] }: { children: React.ReactNode, requiredPermissions?: string[] }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  // Check dynamic permissions
  if (requiredPermissions.length > 0) {
    // Note: In real app, you might want to fetch permissions in useAuth or a separate hook
    // For now, assume user object might have role/permissions or we fetch them
    const userPermissions = user.permissions || []; // Simplified
    const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
    if (!hasPermission) return <div>Forbidden</div>;
  }

  return <>{children}</>;
};
