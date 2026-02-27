'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hook';
import { useSwitchUserMutation, authApi } from '@/store/apis/authApi';
import { productApi } from '@/store/apis/productApi';
import { offerApi } from '@/store/apis/offerApi';
import { orderApi } from '@/store/apis/orderApi';
import { setUser } from '@/store/slices/userSlice';
import { resetChat } from '@/store/slices/chatSlice';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const dispatch = useAppDispatch();
  const [switchUser] = useSwitchUserMutation();
  const switchingRef = useRef(false);

  // Auto-switch back to BUYER when on marketing pages with SELLER type
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    if (user.type !== 'SELLER') return; // Already BUYER, skip
    if (switchingRef.current) return; // Already switching

    const switchToBuyer = async () => {
      switchingRef.current = true;
      try {
        const result = await switchUser().unwrap();
        const newToken = result?.data?.token;
        if (!newToken) return;

        localStorage.setItem('authToken', newToken);

        const getMeResult = await dispatch(
          authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }),
        ).unwrap();

        if (getMeResult?.data) {
          dispatch(setUser(getMeResult.data));
          localStorage.setItem('userData', JSON.stringify(getMeResult.data));
        }

        // Invalidate role-specific caches
        dispatch(productApi.util.invalidateTags(['Product', 'ProductList', 'FavoriteProducts']));
        dispatch(offerApi.util.invalidateTags(['OfferList']));
        dispatch(orderApi.util.invalidateTags(['BuyerOrders', 'SellerOrders', 'Reviews']));
        dispatch(resetChat());
      } catch {
        // Silent fail - marketing pages still work
      } finally {
        switchingRef.current = false;
      }
    };

    switchToBuyer();
  }, [user?.type, isAuthenticated, isLoading, dispatch, switchUser]);

  return <>{children}</>;
}
