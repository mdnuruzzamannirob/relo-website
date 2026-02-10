'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetCategoriesQuery,
  useGetMyFavoriteProductsQuery,
  useGetProductsQuery,
  useToggleFavoriteMutation,
} from '@/store/apis/productApi';
import { useAuth } from '@/hooks/useAuth';

const ProductPage = () => {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  useEffect(() => {
    const initialCategory = searchParams.get('category');
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [searchParams]);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data?.categories || [];

  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery({
    page: 1,
    limit: 12,
    searchTerm: debouncedSearch || undefined,
    categorySlug: category === 'all' ? undefined : category,
    sortOrder,
  });

  const { data: favoritesData } = useGetMyFavoriteProductsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation();

  const products = data?.data?.result || [];
  const totalCount = data?.data?.meta?.total ?? products.length;
  const favoriteIds = useMemo(
    () => new Set(favoritesData?.data?.map((item) => item.product.id) || []),
    [favoritesData],
  );

  return (
    <section className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-primary text-2xl font-semibold">Our Collection</h1>
        <p className="text-sm text-slate-500">Showing {totalCount} items</p>
      </div>

      <div className="border-brand-100 mb-8 grid grid-cols-1 gap-4 rounded-2xl border bg-white p-4 md:grid-cols-[1.4fr_1fr_0.8fr]">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Search</label>
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title or brand"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {isCategoriesLoading && (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              )}
              {!isCategoriesLoading &&
                categories.map((item) => (
                  <SelectItem key={item.id} value={item.slug || item.id}>
                    {item.title || 'Category'}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Sort</label>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(isLoading || isFetching) &&
            Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`products-skeleton-${index}`}
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
            !isFetching &&
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
      )}
    </section>
  );
};

export default ProductPage;
