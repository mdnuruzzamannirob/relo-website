'use client';

import React from 'react';
import ScrollableTabs from '@/components/shared/ScrollableTabs';
import BuyerOrderCard from './BuyerOrderCard';
import { useGetBuyerOrdersQuery } from '@/store/apis/orderApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

const tabs = [
  { value: 'ALL', label: 'All Orders' },
  { value: 'PROCESSING', label: 'Processing' },
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'CONFIRM', label: 'Confirmed' },
  { value: 'PICKUP', label: 'Ready for Pickup' },
  { value: 'COMPLETED', label: 'Completed' },
  //   { value: 'DECLINE', label: 'Declined' },
];

export default function BuyerMyOrders() {
  const [activeTab, setActiveTab] = React.useState('ALL');
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useGetBuyerOrdersQuery({
    page,
    limit: 10,
    status: activeTab,
  });

  const orders = data?.data?.data ?? [];
  const totalPages = data?.data?.meta?.totalPage ?? 1;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <ScrollableTabs tabs={tabs} value={activeTab} onChange={handleTabChange} />

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row"
            >
              <Skeleton className="aspect-video w-full rounded-md sm:h-20 sm:w-20" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <Skeleton className="h-9 w-full rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">
          <p>Failed to load orders.</p>
          <button
            onClick={() => refetch()}
            className="rounded-md bg-red-100 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* Order list */}
      {!isLoading && !isError && (
        <>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
              <Package className="size-12 text-slate-300" />
              <p className="text-sm font-medium">No orders found</p>
              <p className="text-xs">Orders matching this filter will appear here.</p>
            </div>
          ) : (
            <div className="relative space-y-4">
              {/* Fetching overlay */}
              {isFetching && !isLoading && (
                <div className="absolute inset-0 z-10 flex items-start justify-center rounded-xl bg-white/60 pt-12">
                  <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                </div>
              )}

              {orders?.map((order) => (
                <BuyerOrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
