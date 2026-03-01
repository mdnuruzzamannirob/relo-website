'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  clearAuthTokenFromCurrentUrl,
  getAuthTokenFromCurrentUrl,
  getGoogleAuthDataFromCurrentUrl,
} from '@/lib/utils/authClient';

const GoogleAuthSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    const authData = getGoogleAuthDataFromCurrentUrl();
    const token = getAuthTokenFromCurrentUrl();

    if (token) {
      localStorage.setItem('authToken', token);
    }

    if (authData?.userData) {
      localStorage.setItem('userData', JSON.stringify(authData.userData));
    }

    if (token) {
      clearAuthTokenFromCurrentUrl();
      router.replace('/');
      return;
    }

    router.replace('/auth/google/fail?message=Google%20login%20failed');
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-78px)] items-center justify-center px-4">
      <p className="text-sm text-slate-500">Completing Google sign in...</p>
    </div>
  );
};

export default GoogleAuthSuccessPage;
