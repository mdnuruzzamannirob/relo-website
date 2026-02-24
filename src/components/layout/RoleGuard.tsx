'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSwitchUserMutation } from '@/store/apis/authApi';
import { Skeleton } from '@/components/ui/skeleton';

type RoleType = 'BUYER' | 'SELLER';

interface RoleGuardProps {
  requiredRole: RoleType;
  redirectTo?: string;
  children: React.ReactNode;
}

export default function RoleGuard({ requiredRole, redirectTo = '/', children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [switchUser, { isLoading: isSwitchLoading, isSuccess, isError, data }] =
    useSwitchUserMutation();
  const hasTriggeredRef = useRef(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const roleSwitchTarget = hasHydrated ? sessionStorage.getItem('roleSwitchTarget') : null;
  const isRoleSwitching = !!roleSwitchTarget;

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || isLoading) return;

    if (!isAuthenticated) {
      const token = localStorage.getItem('authToken');

      if (!token) {
        router.push(redirectTo);
      }
    }
  }, [hasHydrated, isLoading, isAuthenticated, redirectTo, router]);

  useEffect(() => {
    if (!hasHydrated || isLoading || isSwitchLoading || !isAuthenticated) return;

    if (user?.type === requiredRole) {
      hasTriggeredRef.current = false;
      return;
    }

    if (!hasTriggeredRef.current && !isRoleSwitching) {
      sessionStorage.setItem('roleSwitchTarget', requiredRole);
      hasTriggeredRef.current = true;
      switchUser();
    }
  }, [
    hasHydrated,
    isLoading,
    isSwitchLoading,
    isAuthenticated,
    requiredRole,
    switchUser,
    user?.type,
    isRoleSwitching,
  ]);

  useEffect(() => {
    if (!isSuccess) return;

    if (data?.data?.type !== requiredRole) {
      sessionStorage.removeItem('roleSwitchTarget');
      router.push(redirectTo);
      return;
    }

    sessionStorage.removeItem('roleSwitchTarget');
  }, [isSuccess, data, requiredRole, redirectTo, router]);

  useEffect(() => {
    if (isError) {
      sessionStorage.removeItem('roleSwitchTarget');
      router.push(redirectTo);
    }
  }, [isError, redirectTo, router]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (user?.type === requiredRole && roleSwitchTarget === requiredRole) {
      sessionStorage.removeItem('roleSwitchTarget');
    }
  }, [hasHydrated, user?.type, requiredRole, roleSwitchTarget]);

  if (!hasHydrated || isLoading || isSwitchLoading || isRoleSwitching) {
    return (
      <div className="bg-brand-50">
        <div className="app-container flex min-h-[calc(100vh-78px)] gap-8 pt-8 pb-14">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </aside>

          <main className="w-full flex-1 space-y-6 pt-8 lg:pt-0">
            <Skeleton className="h-10 w-60" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;
  if (user?.type !== requiredRole) return null;

  return <>{children}</>;
}
