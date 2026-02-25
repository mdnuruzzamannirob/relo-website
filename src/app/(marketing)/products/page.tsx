'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';
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
import { Product } from '@/types/product';

const PRODUCT_PAGE_SIZE = 12;
const CATEGORY_PAGE_SIZE = 20;
const DEBOUNCE_MS = 300;

type SortOrder = 'asc' | 'desc';

type CategoryOption = {
  id: string;
  slug?: string | null;
  title?: string | null;
};

function useDebouncedValue<T>(value: T, delay = DEBOUNCE_MS) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function mergeUniqueById<T extends { id: string }>(prev: T[], next: T[]) {
  const map = new Map(prev.map((item) => [item.id, item]));
  for (const item of next) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

function computeHasMore(params: {
  currentCount: number;
  lastBatchSize: number;
  total?: number;
  pageSize: number;
}) {
  const { currentCount, lastBatchSize, total, pageSize } = params;

  // Prefer server total if available
  if (typeof total === 'number' && total >= 0) {
    return currentCount < total;
  }

  // Fallback heuristic
  return lastBatchSize === pageSize;
}

function ProductCardSkeleton() {
  return (
    <div className="border-brand-100 flex h-full flex-col overflow-hidden rounded-xl border bg-white">
      <Skeleton className="h-64 w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

function ProductPageLoadingFallback() {
  return (
    <section className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
        <Skeleton className="h-11 w-full" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Skeleton className="h-11 w-full sm:w-56" />
          <Skeleton className="h-11 w-full sm:w-40" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PRODUCT_PAGE_SIZE }).map((_, index) => (
          <ProductCardSkeleton key={`initial-fallback-${index}`} />
        ))}
      </div>
    </section>
  );
}

function ProductPageContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  // -----------------------------
  // Product filters / listing state
  // -----------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm.trim());

  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const productSentinelRef = useRef<HTMLDivElement | null>(null);

  // -----------------------------
  // Category dropdown state (search + infinite scroll)
  // -----------------------------
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const debouncedCategorySearch = useDebouncedValue(categorySearch.trim());

  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const categorySentinelRef = useRef<HTMLDivElement | null>(null);

  // Read initial category from URL once it becomes available
  useEffect(() => {
    const initialCategory = searchParams.get('category');
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [searchParams]);

  // Reset product list when filters change
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
  }, [debouncedSearch, category, sortOrder]);

  // Reset category dropdown pagination when category search changes
  useEffect(() => {
    setCategoryPage(1);
    setCategoryOptions([]);
    setCategoryHasMore(true);
  }, [debouncedCategorySearch]);

  const productQueryArgs = useMemo(
    () => ({
      page,
      limit: PRODUCT_PAGE_SIZE,
      searchTerm: debouncedSearch || undefined,
      categorySlug: category === 'all' ? undefined : category,
      sortOrder,
    }),
    [page, debouncedSearch, category, sortOrder],
  );

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetProductsQuery(productQueryArgs);

  // NOTE: Assumes backend supports paginated categories query:
  // { page, limit, searchTerm } -> { data: { categories: [], meta: { total } } }
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
  } = useGetCategoriesQuery({
    page: categoryPage,
    limit: CATEGORY_PAGE_SIZE,
    searchTerm: debouncedCategorySearch || undefined,
  });

  const categoriesBatch: CategoryOption[] = categoriesData?.data?.categories || [];
  const categoriesTotal: number | undefined = categoriesData?.data?.meta?.total;

  useEffect(() => {
    if (!categoriesData) return;

    setCategoryOptions((prev) => {
      if (categoryPage === 1) {
        const next = categoriesBatch;
        setCategoryHasMore(
          computeHasMore({
            currentCount: next.length,
            lastBatchSize: categoriesBatch.length,
            total: categoriesTotal,
            pageSize: CATEGORY_PAGE_SIZE,
          }),
        );
        return next;
      }

      const merged = mergeUniqueById(prev, categoriesBatch);
      setCategoryHasMore(
        computeHasMore({
          currentCount: merged.length,
          lastBatchSize: categoriesBatch.length,
          total: categoriesTotal,
          pageSize: CATEGORY_PAGE_SIZE,
        }),
      );
      return merged;
    });
  }, [categoriesData, categoryPage, categoriesBatch, categoriesTotal]);

  // Merge product pages
  useEffect(() => {
    if (!productsData) return;

    const nextItems = productsData?.data?.result || [];
    const total: number | undefined = productsData?.data?.meta?.total;

    setItems((prev) => {
      if (page === 1) {
        setHasMore(
          computeHasMore({
            currentCount: nextItems.length,
            lastBatchSize: nextItems.length,
            total,
            pageSize: PRODUCT_PAGE_SIZE,
          }),
        );
        return nextItems;
      }

      const merged = mergeUniqueById(prev, nextItems);
      setHasMore(
        computeHasMore({
          currentCount: merged.length,
          lastBatchSize: nextItems.length,
          total,
          pageSize: PRODUCT_PAGE_SIZE,
        }),
      );
      return merged;
    });
  }, [productsData, page]);

  // Products infinite scroll observer
  useEffect(() => {
    const target = productSentinelRef.current;
    if (!target || !hasMore || isProductsFetching || isProductsError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isProductsFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isProductsFetching, isProductsError, items.length]);

  // Category dropdown infinite scroll observer
  useEffect(() => {
    const target = categorySentinelRef.current;

    if (
      !isCategoryOpen ||
      !target ||
      !categoryHasMore ||
      isCategoriesFetching ||
      isCategoriesLoading
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isCategoriesFetching) {
          setCategoryPage((prev) => prev + 1);
        }
      },
      { rootMargin: '100px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    isCategoryOpen,
    categoryHasMore,
    isCategoriesFetching,
    isCategoriesLoading,
    categoryOptions.length,
  ]);

  // Favorites
  const { data: favoritesData } = useGetMyFavoriteProductsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleFavorite, { isLoading: isTogglingFavorite }] = useToggleFavoriteMutation();

  const favoriteIds = useMemo(
    () => new Set(favoritesData?.data?.map((item) => item.product.id) || []),
    [favoritesData],
  );

  // UI states
  const isCategorySearchDebouncing = categorySearch.trim() !== debouncedCategorySearch;

  const showEmptyProducts =
    !isProductsLoading && !isProductsError && !isProductsFetching && items.length === 0;

  const showInitialProductSkeleton =
    !isProductsError && isProductsLoading && page === 1 && items.length === 0;

  const showPaginationSkeleton =
    !isProductsError && isProductsFetching && !isProductsLoading && items.length > 0;

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setSortOrder('asc');
  };

  return (
    <section className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end">
        {/* Search input with icon + spinner */}
        <div className="relative w-full">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title or brand"
            className="h-11 w-full pr-10 pl-9"
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-end">
          {/* Category Select with search + infinite scroll */}
          <Select
            value={category}
            onValueChange={setCategory}
            open={isCategoryOpen}
            onOpenChange={(open) => {
              setIsCategoryOpen(open);
              if (!open) {
                setCategorySearch('');
              }
            }}
          >
            <SelectTrigger className="h-11 gap-1 whitespace-nowrap">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>

            <SelectContent position="popper" className="p-0 max-sm:w-(--radix-popper-anchor-width)">
              {/* Sticky searchbar inside dropdown */}
              <div className="bg-popover sticky top-0 z-10 border-b p-2">
                <div className="relative">
                  <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    onKeyDown={(e) => {
                      // Prevent Radix Select typeahead from hijacking input keys
                      e.stopPropagation();
                    }}
                    placeholder="Search category..."
                    className="h-9 pr-8 pl-8"
                  />
                  {(isCategorySearchDebouncing || (isCategoriesFetching && categoryPage === 1)) && (
                    <Loader2 className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 animate-spin" />
                  )}
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto pt-2">
                <SelectItem value="all">All categories</SelectItem>

                {/* Initial loading */}
                {isCategoriesLoading && categoryOptions.length === 0 && (
                  <div className="text-muted-foreground flex items-center justify-center gap-2 px-2 py-4 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading categories...
                  </div>
                )}

                {/* Category options */}
                {!isCategoriesLoading &&
                  categoryOptions.map((item) => (
                    <SelectItem key={item.id} value={item.slug || item.id}>
                      {item.title || 'Category'}
                    </SelectItem>
                  ))}

                {/* Empty categories state */}
                {!isCategoriesLoading && !isCategoriesFetching && categoryOptions.length === 0 && (
                  <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                    No category found.
                  </div>
                )}

                {/* Sentinel + loader for dropdown infinite scroll */}
                {!isCategoriesLoading && categoryHasMore && categoryOptions.length > 0 && (
                  <div ref={categorySentinelRef} className="flex items-center justify-center py-3">
                    {isCategoriesFetching && categoryPage > 1 ? (
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more...
                      </div>
                    ) : (
                      <span className="sr-only">Load more categories</span>
                    )}
                  </div>
                )}

                {!isCategoriesLoading && !categoryHasMore && categoryOptions.length > 0 && (
                  <div className="text-muted-foreground py-2 text-center text-xs">
                    End of categories
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <SelectTrigger className="h-11 gap-1">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-sm:w-(--radix-popper-anchor-width)">
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error state */}
      {isProductsError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          <p>Failed to load products.</p>
          <Button variant="outline" size="sm" onClick={() => refetchProducts()}>
            Try again
          </Button>
        </div>
      )}

      {/* Product list / skeleton / empty */}
      {!isProductsError && (
        <>
          {showInitialProductSkeleton && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PRODUCT_PAGE_SIZE }).map((_, index) => (
                <ProductCardSkeleton key={`products-skeleton-${index}`} />
              ))}
            </div>
          )}

          {!showInitialProductSkeleton && showEmptyProducts && (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-8 text-center">
              <div className="mb-2 text-lg font-semibold">No products found</div>
              <p className="text-muted-foreground mb-4 max-w-md text-sm">
                We couldn’t find any product for your current search/filter. Try changing the search
                text, category, or sort order.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear filters
              </Button>
            </div>
          )}

          {!showInitialProductSkeleton && !showEmptyProducts && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isLiked={favoriteIds.has(product.id) || product.isFavorite}
                    onLike={() => {
                      if (!isTogglingFavorite) {
                        void toggleFavorite(product.id);
                      }
                    }}
                  />
                ))}

                {showPaginationSkeleton &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <ProductCardSkeleton key={`products-loading-${index}`} />
                  ))}
              </div>

              {/* Bottom sentinel + loading indicator */}
              <div ref={productSentinelRef} className="flex h-10 items-center justify-center">
                {showPaginationSkeleton && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more products...
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

const ProductPage = () => {
  return (
    <Suspense fallback={<ProductPageLoadingFallback />}>
      <ProductPageContent />
    </Suspense>
  );
};

export default ProductPage;
