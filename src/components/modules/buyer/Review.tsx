'use client';

import { useState } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetReviewsQuery } from '@/store/apis/orderApi';

export default function Reviews() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetReviewsQuery({ page, limit });

  const reviews = data?.data?.data || [];
  const meta = data?.data?.meta;

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border-brand-100 flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:gap-4 sm:p-4"
          >
            <Skeleton className="h-32 w-full sm:size-20 sm:min-w-20" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
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
          You haven't written any reviews yet. Complete orders to leave reviews!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review List */}
      <div className="space-y-3 sm:space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-brand-100 flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:gap-4 sm:p-4"
          >
            <div className="bg-brand-50 relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:size-20 sm:min-w-20">
              <Image
                src={review.product.photos[0] || '/images/banner.png'}
                alt={review.product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 space-y-1.5 sm:space-y-1">
              <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
                {review.product.title}
              </h3>

              <p className="text-xs text-slate-500 sm:text-sm">Brand: {review.product.brandName}</p>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-1">
                {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 sm:h-5 sm:w-5" />
                ))}
                <span className="ml-2 text-xs font-medium text-slate-600">{review.rating} / 5</span>
                {review.createdAt && (
                  <span className="ml-2 text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              {review.review && (
                <p className="pt-1 text-sm text-slate-700 sm:text-base">{review.review}</p>
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
