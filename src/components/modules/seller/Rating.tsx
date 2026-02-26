'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetReviewsQuery } from '@/store/apis/orderApi';

export default function Rating() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetReviewsQuery({ page, limit });

  const reviews = data?.data?.data || [];
  const meta = data?.data?.meta;

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 md:flex-row md:gap-5 md:p-5"
          >
            <Skeleton className="aspect-video w-full rounded-lg sm:aspect-square sm:h-32 sm:w-32 md:h-28 md:w-28 lg:h-32 lg:w-32" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mb-4 size-12 text-red-600" />
        <h3 className="mb-2 text-lg font-semibold text-red-900">Failed to Load Reviews</h3>
        <p className="mb-4 text-sm text-red-700">
          {(error as any)?.data?.message || 'Something went wrong. Please try again.'}
        </p>
        <Button variant="outline" onClick={() => refetch()} className="border-red-600 text-red-600">
          Retry
        </Button>
      </div>
    );
  }

  // ── Empty State ──
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-4">
          <Star className="size-8 text-slate-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">No Reviews Yet</h3>
        <p className="text-sm text-slate-600">
          You haven't received any reviews yet. Complete sales to get buyer feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review List */}
      <div className="space-y-4 lg:space-y-5">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-brand-100 group flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row md:gap-5 md:p-5"
          >
            {/* Image */}
            <Image
              src={review.product.photos[0] || '/images/banner.png'}
              alt={review.product.title}
              width={500}
              height={500}
              className="aspect-video w-full rounded-lg object-cover shadow-sm transition-transform group-hover:scale-[1.02] sm:aspect-square sm:h-32 sm:w-32 md:h-28 md:w-28 lg:h-32 lg:w-32"
            />

            {/* Content */}
            <div className="flex-1 space-y-2.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-800 sm:text-lg md:text-xl">
                    {review.product.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Buyer: <span className="font-semibold text-slate-700">{review.buyer.name}</span>
                  </p>
                </div>

                {review.createdAt && (
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 transition-all sm:h-5 sm:w-5 ${
                        i < Math.floor(review.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">{review.rating}</span>
              </div>

              {review.review && (
                <div className="rounded-lg bg-slate-50 p-3.5 md:p-4">
                  <p className="text-sm leading-relaxed text-slate-700 md:text-base">
                    &ldquo;{review.review}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-600">
            Page {meta.page} of {meta.totalPage} ({meta.total} reviews)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              disabled={page >= meta.totalPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
