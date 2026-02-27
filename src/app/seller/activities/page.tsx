'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { useGetNotificationsQuery } from '@/store/apis/dashboardApi';
import HeaderBar from '@/components/shared/HeaderBar';
import ActivityItem from '@/components/modules/seller/ActivityItem';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ActivityItemSkeleton } from '@/components/shared/SkeletonLoaders';
import { Activity } from 'lucide-react';

const ActivitiesPage = () => {
  const { user } = useAuth();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch activities with pagination
  const {
    data: activitiesData,
    isLoading: initialLoading,
    isFetching,
    error,
  } = useGetNotificationsQuery(
    { page: currentPage, limit: 10 },
    {
      // Skip initial load if no user
      skip: !user,
    },
  );

  // Transform activities data
  const activities = useMemo(() => {
    if (!activitiesData?.data.result) return [];
    return activitiesData.data.result.map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.body,
      time: getRelativeTime(activity.createdAt),
      color: getActivityColor(activity.type) as 'green' | 'blue' | 'orange',
    }));
  }, [activitiesData]);

  const hasMore =
    (activitiesData?.data.meta.page ?? 1) < (activitiesData?.data.meta.totalPage ?? 1);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerTarget.current || initialLoading || isFetching || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching, initialLoading]);

  if (error && currentPage === 1) {
    return (
      <section className="space-y-6">
        <HeaderBar title="Your Activity" description="Track all your sales and activities" />
        <div className="border-brand-100 rounded-lg border bg-red-50 p-4 text-red-700">
          Failed to load activities. Please refresh the page.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <HeaderBar title="Your Activity" description="Track all your sales and activities" />

      {/* Toolbar */}
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-primary" size={20} />
          <h3 className="text-lg font-semibold text-slate-900">All Activities</h3>
        </div>
      </div> */}

      {/* Activities List */}
      <div className="space-y-3">
        {activities.length === 0 && !isFetching && currentPage === 1 ? (
          <div className="border-brand-100 flex flex-col items-center justify-center rounded-lg border bg-slate-50 p-12 text-center">
            <Activity className="mb-3 text-slate-400" size={40} />
            <p className="font-medium text-slate-600">No activities yet</p>
            <p className="mt-1 text-sm text-slate-500">
              You&apos;ll see your sales and activities here
            </p>
          </div>
        ) : (
          <>
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                title={activity.title}
                description={activity.description}
                time={activity.time}
                color={activity.color}
              />
            ))}

            {/* Loading indicator for next batch */}
            {isFetching && currentPage > 1 && (
              <div className="space-y-2">
                <ActivityItemSkeleton />
                <ActivityItemSkeleton />
                <ActivityItemSkeleton />
              </div>
            )}

            {/* Initial loading */}
            {initialLoading && currentPage === 1 && (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <ActivityItemSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Intersection observer target */}
            {hasMore && (
              <div ref={observerTarget} className="flex touch-none justify-center py-8">
                {isFetching && <div className="text-sm text-slate-500">Loading more...</div>}
              </div>
            )}

            {/* No more items message */}
            {!hasMore && activities.length > 0 && currentPage > 1 && (
              <div className="py-8 text-center text-sm text-slate-500">All activities loaded</div>
            )}
          </>
        )}
      </div>

      {/* Footer actions */}
      {activities.length > 0 && (
        <div className="border-t-brand-100 flex justify-center gap-3 border-t pt-6">
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600"
            onClick={() => setCurrentPage(1)}
          >
            Refresh
          </Button>
        </div>
      )}
    </section>
  );
};

function getActivityColor(type: string): string {
  const colorMap: Record<string, 'green' | 'blue' | 'orange'> = {
    order: 'green',
    locker: 'blue',
    offer: 'orange',
    payment: 'green',
    listing: 'blue',
    order_placed: 'blue',
    order_accepted: 'green',
    order_completed: 'green',
    order_cancelled: 'orange',
  };
  return colorMap[type] || 'blue';
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

export default ActivitiesPage;
