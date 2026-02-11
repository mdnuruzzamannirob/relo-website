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
    limit: 10,
  });
  const categories = categoriesData?.data?.categories || [];
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const fallbackSlug = categories[0]?.slug || categories[0]?.id || '';

  useEffect(() => {
    if (!selectedSlug && fallbackSlug) {
      setSelectedSlug(fallbackSlug);
      return;
    }

    if (selectedSlug && categories.length > 0) {
      const stillExists = categories.some((item) => (item.slug || item.id) === selectedSlug);
      if (!stillExists && fallbackSlug) {
        setSelectedSlug(fallbackSlug);
      }
    }
  }, [categories, fallbackSlug, selectedSlug]);

  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({
    page: 1,
    limit: 9,
  });

  const { data: favoritesData } = useGetMyFavoriteProductsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation();
  const products = productsData?.data?.result || [];
  const favoriteIds = useMemo(
    () => new Set(favoritesData?.data?.map((item) => item.product.id) || []),
    [favoritesData],
  );

  const isLoading = isCategoriesLoading || isProductsLoading;

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

            return (
              <Link
                key={slug}
                href={`/product?category=${slug}`}
                className="border-brand-100 hover:bg-brand-50 rounded-full border px-4 py-1.5 text-sm text-slate-500 transition"
              >
                {item.title || 'Category'}
              </Link>
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
    </section>
  );
}
