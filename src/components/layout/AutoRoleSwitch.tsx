'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hook';
import { useSwitchUserMutation, authApi } from '@/store/apis/authApi';
import { productApi } from '@/store/apis/productApi';
import { offerApi } from '@/store/apis/offerApi';
import { orderApi } from '@/store/apis/orderApi';
import { setUser } from '@/store/slices/userSlice';
import { useAuth } from '@/hooks/useAuth';

/**
 * AutoRoleSwitch Component
 *
 * Automatically switches user role based on current route:
 * - If on /seller/* routes → ensure SELLER role
 * - If on any other route → ensure BUYER role
 *
 * Prevents duplicate API calls and only switches when necessary.
 */
export default function AutoRoleSwitch() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [switchUser] = useSwitchUserMutation();
  const switchingRef = useRef(false);
  const lastRoleRef = useRef<string | null>(null);
  const lastPathRef = useRef<string | null>(null);

  const performRoleSwitch = useCallback(
    async (targetRole: 'BUYER' | 'SELLER') => {
      // Prevent duplicate calls
      if (switchingRef.current) return;

      // Don't switch if already correct role
      if (user?.type === targetRole) {
        lastRoleRef.current = targetRole;
        return;
      }

      // Don't switch if we just switched to this role (local state check)
      if (lastRoleRef.current === targetRole) return;

      switchingRef.current = true;

      try {
        // 1. Call switch-role API
        const switchResult = await switchUser().unwrap();
        const newToken = switchResult?.data?.token;
        const newType = switchResult?.data?.type;

        if (!newToken || !newType) {
          throw new Error('Invalid switch response');
        }

        // 2. Update token in localStorage
        localStorage.setItem('authToken', newToken);

        // 3. Fetch updated user data with forced refresh
        const getMeResult = await dispatch(
          authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }),
        ).unwrap();

        if (getMeResult?.data) {
          dispatch(setUser(getMeResult.data));
          localStorage.setItem('userData', JSON.stringify(getMeResult.data));
          lastRoleRef.current = getMeResult.data.type;
        }

        // 4. Invalidate role-specific cached data
        dispatch(productApi.util.invalidateTags(['Product', 'ProductList', 'FavoriteProducts']));
        dispatch(offerApi.util.invalidateTags(['OfferList']));
        dispatch(orderApi.util.invalidateTags(['BuyerOrders', 'SellerOrders', 'Reviews']));
      } catch (error) {
        // console.error('Auto role switch failed:', error);
      } finally {
        switchingRef.current = false;
      }
    },
    [user?.type, switchUser, dispatch],
  );

  useEffect(() => {
    // Don't run if not authenticated or still loading
    if (!isAuthenticated || isAuthLoading || !user) return;

    // Determine required role based on pathname
    const isSellerRoute = pathname?.startsWith('/seller');
    const requiredRole = isSellerRoute ? 'SELLER' : 'BUYER';

    // Only switch if path changed AND current role doesn't match required role
    if (pathname !== lastPathRef.current) {
      lastPathRef.current = pathname;
      if (user.type !== requiredRole) {
        performRoleSwitch(requiredRole);
      } else {
        lastRoleRef.current = requiredRole;
      }
    }
  }, [pathname, user, isAuthenticated, isAuthLoading, performRoleSwitch]);

  // This component doesn't render anything
  return null;
}
