'use client';

import { useCallback, useMemo, useState } from 'react';
import { useGetDashboardStatsQuery } from '@/store/apis/dashboardApi';
import HeaderBar from '@/components/shared/HeaderBar';
import ActivityItem from '@/components/modules/seller/ActivityItem';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ActivityItemSkeleton } from '@/components/shared/SkeletonLoaders';
import { Activity, RefreshCw } from 'lucide-react';

const ActivitiesPage = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch overview data which includes recent activities
  const {
    data: overviewData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDashboardStatsQuery(undefined, {
    skip: !user,
  });

  const activities = useMemo(() => {
    // Recent activities not available in the overview endpoint
    // This page shows activities data, which should be fetched from a dedicated endpoint
    return [] as Array<{
      color: 'green' | 'blue' | 'orange';
      title: string;
      description: string;
      time: string;
    }>;
  }, [overviewData]);

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setRefreshKey((prev) => prev + 1);
    await refetch();
  }, [refetch]);

  if (error) {
    return (
      <section className="space-y-6">
        <HeaderBar title="Recent Activity" description="Track all your sales and activities" />
        <div className="border-brand-100 rounded-lg border bg-red-50 p-4 text-red-700">
          Failed to load activities. Please refresh the page.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <HeaderBar title="Recent Activity" description="Track all your sales and activities" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-primary" size={20} />
          <h3 className="text-lg font-semibold text-slate-900">
            All Activities ({activities.length})
          </h3>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isFetching}
          className="text-primary"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {activities.length === 0 && !isLoading ? (
          <div className="border-brand-100 flex flex-col items-center justify-center rounded-lg border bg-slate-50 p-12 text-center">
            <Activity className="mb-3 text-slate-400" size={40} />
            <p className="font-medium text-slate-600">No activities yet</p>
            <p className="mt-1 text-sm text-slate-500">Your recent activities will appear here</p>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <ActivityItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              activities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  color={activity.color}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                />
              ))
            )}

            {isFetching && !isLoading && (
              <div className="py-4 text-center text-sm text-slate-500">Updating activities...</div>
            )}
          </>
        )}
      </div>

      {/* Footer info */}
      {activities.length > 0 && (
        <div className="border-t-brand-100 border-t py-6 text-center text-sm text-slate-500">
          Showing {activities.length} activities
          {activities.length >= 10 && ' (most recent)'}
        </div>
      )}
    </section>
  );
};

function getActivityColor(type: string): 'green' | 'blue' | 'orange' | 'purple' | 'red' {
  const colorMap: Record<string, 'green' | 'blue' | 'orange' | 'purple' | 'red'> = {
    order: 'green',
    locker: 'blue',
    offer: 'orange',
    payment: 'purple',
    listing: 'blue',
    review: 'orange',
    dispute: 'red',
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
