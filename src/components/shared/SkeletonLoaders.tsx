'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function StatCardSkeleton() {
  return (
    <div className="border-brand-100 rounded-lg border bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export function OrderItemSkeleton() {
  return (
    <div className="border-brand-100 flex items-center justify-between rounded-lg border p-3">
      <div className="flex flex-1 items-center gap-3">
        <Skeleton className="h-14 w-14 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="border-brand-100 flex items-start gap-3 rounded-lg border p-3">
      <Skeleton className="mt-2 h-2 w-2 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full max-w-sm" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function NotificationItemSkeleton() {
  return (
    <div className="border-brand-100 mb-3 flex items-start gap-3 rounded-lg border p-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function BuyerOverviewPageSkeleton() {
  return (
    <section className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Notifications Section Skeleton */}
      <div className="border-brand-100 rounded-xl border bg-white p-4">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-3">
          <NotificationItemSkeleton />
          <NotificationItemSkeleton />
          <NotificationItemSkeleton />
        </div>
      </div>

      {/* Recent Orders Section Skeleton */}
      <div className="border-brand-100 rounded-xl border bg-white p-4">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-3">
          <OrderItemSkeleton />
          <OrderItemSkeleton />
          <OrderItemSkeleton />
        </div>
      </div>
    </section>
  );
}

export function SellerOverviewPageSkeleton() {
  return (
    <section className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Recent Activity Section Skeleton */}
      <div className="border-brand-100 rounded-xl border bg-white p-4">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-3">
          <ActivityItemSkeleton />
          <ActivityItemSkeleton />
          <ActivityItemSkeleton />
        </div>
      </div>

      {/* Bottom Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </section>
  );
}
