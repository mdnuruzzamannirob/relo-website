'use client';

import BuyerOfferCard from '@/components/modules/buyer/BuyerOfferCard';
import HeaderBar from '@/components/shared/HeaderBar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetOffersQuery } from '@/store/apis/offerApi';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const BuyerOffersPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetOffersQuery({ page, limit: 6 });

  const offers = data?.data?.data?.flat() || [];
  const meta = data?.data?.meta;

  return (
    <section className="space-y-6">
      <HeaderBar title="My Offers" description="Track your offers and negotiations" />

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-brand-100 rounded-xl border bg-white p-5">
              <div className="flex gap-5">
                <Skeleton className="h-28 w-28 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">
          <p>Failed to load offers.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && offers.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
          <Inbox className="size-12 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No offers yet</p>
          <p className="text-xs text-slate-400">
            When you make offers on products, they will appear here.
          </p>
        </div>
      )}

      {!isLoading && !isError && offers.length > 0 && (
        <>
          <div className="space-y-4">
            {offers.map((offer) => (
              <BuyerOfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>

              <span className="text-sm text-slate-500">
                Page {meta.page} of {meta.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BuyerOffersPage;
