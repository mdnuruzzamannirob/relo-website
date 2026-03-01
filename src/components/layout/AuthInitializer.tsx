'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hook';
import { setUser, clearUser, setIsLoading } from '@/store/slices/userSlice';
import { authApi } from '@/store/apis/authApi';
import { jwtDecode } from 'jwt-decode';
import { clearAuthTokenFromCurrentUrl, getAuthTokenFromCurrentUrl } from '@/lib/utils/authClient';

interface JwtPayload {
  exp: number;
}

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      dispatch(setIsLoading(true));

      const tokenFromUrl = getAuthTokenFromCurrentUrl();

      if (tokenFromUrl) {
        localStorage.setItem('authToken', tokenFromUrl);
        clearAuthTokenFromCurrentUrl();
      }

      const token = localStorage.getItem('authToken');

      // No token → logout
      if (!token) {
        cleanup();
        return;
      }

      // Check expiry
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.exp * 1000 < Date.now()) {
          cleanup();
          return;
        }
      } catch {
        cleanup();
        return;
      }

      // Restore local user (fast UI)
      const stored = localStorage.getItem('userData');

      if (stored) {
        try {
          dispatch(setUser(JSON.parse(stored)));
          dispatch(setIsLoading(false));
        } catch {
          localStorage.removeItem('userData');
        }
      }

      // Sync with backend
      dispatch(authApi.endpoints.getMe.initiate());
    };

    const cleanup = () => {
      dispatch(clearUser());

      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      sessionStorage.clear();

      dispatch(authApi.util.resetApiState());
      dispatch(setIsLoading(false));
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
