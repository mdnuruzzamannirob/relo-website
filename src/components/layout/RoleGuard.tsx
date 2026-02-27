'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hook';
import { useSwitchUserMutation, authApi } from '@/store/apis/authApi';
import { productApi } from '@/store/apis/productApi';
import { offerApi } from '@/store/apis/offerApi';
import { orderApi } from '@/store/apis/orderApi';
import { setUser } from '@/store/slices/userSlice';
import { resetChat } from '@/store/slices/chatSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

type RoleType = 'BUYER' | 'SELLER';

interface RoleGuardProps {
  requiredRole: RoleType;
  redirectTo?: string;
  children: React.ReactNode;
}

export default function RoleGuard({ requiredRole, redirectTo = '/', children }: RoleGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [switchUser] = useSwitchUserMutation();
  const [isSwitching, setIsSwitching] = useState(false);
  const switchRef = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // ---- The single role-switch + getMe pipeline ----
  const performRoleSwitch = useCallback(async () => {
    if (switchRef.current) return; // already in progress
    switchRef.current = true;
    setIsSwitching(true);

    try {
      // 1. Call switch-role PUT -> get new token + type
      const switchResult = await switchUser().unwrap();
      const newToken = switchResult?.data?.token;
      const newType = switchResult?.data?.type;

      if (!newToken || !newType) {
        throw new Error('Invalid switch response');
      }

      // 2. Update token in localStorage so subsequent API calls use it
      localStorage.setItem('authToken', newToken);

      // 3. Call getMe with the NEW token to get full user data
      const getMeResult = await dispatch(
        authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }),
      ).unwrap();

      if (getMeResult?.data) {
        dispatch(setUser(getMeResult.data));
        localStorage.setItem('userData', JSON.stringify(getMeResult.data));
      }

      // 4. Invalidate role-specific cached data so dashboards refetch
      dispatch(productApi.util.invalidateTags(['Product', 'ProductList', 'FavoriteProducts']));
      dispatch(offerApi.util.invalidateTags(['OfferList']));
      dispatch(orderApi.util.invalidateTags(['BuyerOrders', 'SellerOrders', 'Reviews']));
      dispatch(resetChat()); // Reset chat state so it reconnects with correct role

      // 5. Check if the switch actually gave us the right role
      if (getMeResult?.data?.type !== requiredRole) {
        router.push(redirectTo);
      }
    } catch {
      // Switch failed -> redirect away
      router.push(redirectTo);
    } finally {
      setIsSwitching(false);
      switchRef.current = false;
    }
  }, [switchUser, dispatch, requiredRole, redirectTo, router]);

  // ---- Main guard logic ----
  useEffect(() => {
    if (!hydrated || isAuthLoading) return;

    // Not authenticated -> check token, else redirect
    if (!isAuthenticated) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push(redirectTo);
      }
      // If token exists, AuthInitializer will hydrate -> re-run this effect
      return;
    }

    // Already correct role -> done
    if (user?.type === requiredRole) return;

    // Wrong role -> switch
    performRoleSwitch();
  }, [
    hydrated,
    isAuthLoading,
    isAuthenticated,
    user?.type,
    requiredRole,
    redirectTo,
    router,
    performRoleSwitch,
  ]);

  // ---- Render ----
  const showSkeleton =
    !hydrated || isAuthLoading || isSwitching || (isAuthenticated && user?.type !== requiredRole);

  if (showSkeleton) {
    return (
      <div className="bg-brand-50">
        <div className="app-container flex min-h-[calc(100vh-78px)] gap-8 pt-8 pb-14">
          <aside className="hidden h-fit w-72 shrink-0 rounded-xl bg-white p-5 lg:block">
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </aside>

          <main className="w-full flex-1 space-y-6 pt-8 lg:pt-0">
            <Skeleton className="h-10 w-60 rounded-lg bg-white" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-32 w-full rounded-xl bg-white" />
              <Skeleton className="h-32 w-full rounded-xl bg-white" />
              <Skeleton className="h-32 w-full rounded-xl bg-white" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl bg-white" />
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
