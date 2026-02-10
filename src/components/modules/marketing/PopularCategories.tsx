'use client';

import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetCategoriesQuery,
  useGetMyFavoriteProductsQuery,
  useGetProductsQuery,
  useToggleFavoriteMutation,
} from '@/store/apis/productApi';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function PopularCategories() {
  const { isAuthenticated } = useAuth();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery({
    mostPopular: true,
    limit: 8,
  });
  const categories = categoriesData?.data?.categories || [];
  const [selectedSlug, setSelectedSlug] = useState<string>('');

  useEffect(() => {
    if (!selectedSlug && categories.length > 0) {
      setSelectedSlug(categories[0]?.slug || categories[0]?.id || '');
    }
  }, [categories, selectedSlug]);

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetProductsQuery(
    {
      page: 1,
      limit: 6,
      categorySlug: selectedSlug || undefined,
    },
    { skip: !selectedSlug },
  );

  const { data: favoritesData } = useGetMyFavoriteProductsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation();
  const products = productsData?.data?.result || [];
  const favoriteIds = useMemo(
    () => new Set(favoritesData?.data?.map((item) => item.product.id) || []),
    [favoritesData],
  );

  const isLoading = isCategoriesLoading || isProductsLoading || isProductsFetching;
  const categoryLink = selectedSlug ? `/product?category=${selectedSlug}` : '/product';

  return (
    <section className="app-container w-full py-10">
      {/* Title */}
      <h2 className="text-primary mb-6 text-xl font-semibold">Most popular categories</h2>

      {/* Category Pills */}
      <div className="mb-10 flex flex-wrap gap-3">
        {isCategoriesLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={`category-skeleton-${index}`} className="h-8 w-32 rounded-full" />
          ))}
        {!isCategoriesLoading &&
          categories.map((item) => {
            const slug = item.slug || item.id;
            const isActive = slug === selectedSlug;

            return (
              <button
                key={slug}
                onClick={() => setSelectedSlug(slug)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  isActive
                    ? 'border-primary bg-brand-50 text-primary'
                    : 'border-brand-100 hover:bg-brand-50 text-slate-500'
                }`}
              >
                {item.title || 'Category'}
              </button>
            );
          })}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`popular-product-skeleton-${index}`}
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
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={favoriteIds.has(product.id) || product.isFavorite}
              onLike={() => {
                if (!isToggling) {
                  toggleFavorite(product.id);
                }
              }}
            />
          ))}
      </div>

      {/* See all */}
      <div className="mt-10 flex justify-center">
        <Link href={categoryLink}>
          <Button size="lg">See all items</Button>
        </Link>
      </div>
    </section>
  );
}
