'use client';

import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  useGetMyFavoriteProductsQuery,
  useGetProductsQuery,
  useToggleFavoriteMutation,
} from '@/store/apis/productApi';
import { useAuth } from '@/hooks/useAuth';

interface ProductGridProps {
  title?: string;
  description?: string;
  limit?: number;
  showCount?: boolean;
  categorySlug?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const ProductGrid = ({
  title = 'Our Collection',
  description,
  limit = 6,
  showCount = false,
  categorySlug,
  ctaLabel,
  ctaHref,
}: ProductGridProps) => {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    page: 1,
    limit,
    categorySlug,
  });
  const { data: favoritesData } = useGetMyFavoriteProductsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation();

  const products = data?.data?.result || [];
  const totalCount = data?.data?.meta?.total ?? products.length;
  const favoriteIds = new Set(favoritesData?.data?.map((item) => item.product.id) || []);

  return (
    <section className="bg-brand-50 min-h-[70vh] py-10">
      <div className="app-container">
        <div className="mb-8 flex flex-col gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div className="space-y-1">
            <h2 className="text-primary text-3xl font-semibold">{title}</h2>
            {description && <p className="text-sm text-slate-500">{description}</p>}
            {showCount && <p className="text-sm text-slate-500">Showing {totalCount} items</p>}
          </div>
          {ctaHref && ctaLabel && (
            <Link href={ctaHref} className="flex justify-center md:justify-end">
              <Button variant="outline">{ctaLabel}</Button>
            </Link>
          )}
        </div>

        {isError && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            <p>Failed to load products.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        )}

        {!isError && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: limit }).map((_, index) => (
                <div
                  key={`product-skeleton-${index}`}
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

            {!isLoading &&
              products.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  isLiked={favoriteIds.has(item.id) || item.isFavorite}
                  onLike={() => {
                    if (!isToggling) {
                      toggleFavorite(item.id);
                    }
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
