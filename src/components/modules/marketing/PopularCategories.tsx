'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetCategoriesQuery } from '@/store/apis/productApi';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PopularCategories() {
  const [selectedSlug, setSelectedSlug] = useState<string>('');

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery({
    mostPopular: true,
    limit: 12,
  });

  const categories = categoriesData?.data?.categories || [];
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

  return (
    <section className="app-container w-full py-10">
      {/* Title */}
      <h2 className="text-primary mb-6 text-3xl font-semibold">Most popular categories</h2>

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
                href={`/products?category=${slug}`}
                className="border-brand-100 hover:bg-brand-50 rounded-full border px-4 py-1.5 text-sm text-slate-500 transition"
              >
                {item.title || 'Category'}
              </Link>
            );
          })}
      </div>
    </section>
  );
}
