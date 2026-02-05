'use client';

import { useAppSelector } from '@/store/hook';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.user);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
