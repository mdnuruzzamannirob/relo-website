'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  clearAuthTokenFromCurrentUrl,
  getGoogleAuthErrorFromCurrentUrl,
} from '@/lib/utils/authClient';
import { toast } from 'sonner';

const GoogleAuthFailPage = () => {
  const router = useRouter();

  useEffect(() => {
    const errorMessage = getGoogleAuthErrorFromCurrentUrl() || 'Google sign in failed';
    clearAuthTokenFromCurrentUrl();
    toast.error(errorMessage);
    router.replace('/sign-in');
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-78px)] items-center justify-center px-4">
      <p className="text-sm text-slate-500">Redirecting to sign in...</p>
    </div>
  );
};

export default GoogleAuthFailPage;
