'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GoogleAuthCallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    const search = window.location.search;
    const hash = window.location.hash;
    router.replace(`/auth/google/success${search}${hash}`);
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-78px)] items-center justify-center px-4">
      <p className="text-sm text-slate-500">Signing you in with Google...</p>
    </div>
  );
};

export default GoogleAuthCallbackPage;
