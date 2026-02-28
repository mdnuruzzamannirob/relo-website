'use client';

import Favorites from '@/components/modules/buyer/Favorites';
import HeaderBar from '@/components/shared/HeaderBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMyFavoriteProductsQuery, useToggleFavoriteMutation } from '@/store/apis/productApi';
import { Heart } from 'lucide-react';

const FavoritesView = () => {
  const { data, isLoading, isError, refetch } = useGetMyFavoriteProductsQuery();
  const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation();

  const favorites = data?.data?.map((item) => item.product) || [];

  return (
    <section className="space-y-6">
      <HeaderBar title="Favorites" description="Items you're following" />

      <div className="space-y-4">
        <h3 className="text-primary font-medium">Saved Items ({favorites.length || 0})</h3>

        {isError && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            <p>Failed to load favorites.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`favorites-skeleton-${index}`}
                className="border-brand-100 flex h-full flex-col overflow-hidden rounded-xl border bg-white"
              >
                <Skeleton className="h-64 w-full" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <Favorites
            favorites={favorites}
            onToggleFavorite={(id) => {
              if (!isToggling) {
                toggleFavorite(id);
              }
            }}
          />
        )}

        {!isLoading && !isError && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <Heart className="size-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">No Favorites Yet</h3>
            <p className="text-sm text-slate-600">
              You haven&apos;t saved any items yet. Start adding items to your favorites!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoritesView;
