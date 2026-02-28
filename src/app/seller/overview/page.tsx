'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { DollarSign, Boxes, Clock, Package, Activity, ArrowRight } from 'lucide-react';

import { useGetDashboardStatsQuery, useGetNotificationsQuery } from '@/store/apis/dashboardApi';
import HeaderBar from '@/components/shared/HeaderBar';
import StatCard from '@/components/shared/StatCard';
import ActivityItem from '@/components/modules/seller/ActivityItem';
import { Button } from '@/components/ui/button';
import { SellerOverviewPageSkeleton } from '@/components/shared/SkeletonLoaders';
import { useAuth } from '@/hooks/useAuth';
import { useRequestPayoutMutation } from '@/store/apis/earningsApi';
import ButtonComp from '@/components/shared/ButtonComp';

type ActivityColor = 'green' | 'blue' | 'orange';

const SellerOverviewPage = () => {
  const { user } = useAuth();

  const [requestPayout, { isLoading: payoutLoading }] = useRequestPayoutMutation();

  // Overview stats
  const {
    data: overviewData,
    isLoading: overviewLoading,
    isFetching: overviewFetching,
    error: overviewError,
  } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 300000, // 5 min
  });

  // Notifications / activities
  const { data: activitiesData, isLoading: activitiesLoading } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    {
      // Don’t block on overviewData — activities are independent.
      // If your API truly depends on overview, put skip back.
      skip: false,
    },
  );

  const stats = useMemo(() => {
    const seller = overviewData?.data?.sellerResponse;
    if (!seller) return null;

    return {
      totalEarning: formatMoney(seller.totalEarning),
      activeProducts: String(seller.activeProducts ?? 0),
      pendingOrders: String(seller.pendingOrders ?? 0),
      productSold: String(seller.productSold ?? 0),
      availableWithdrawal: formatMoney(seller.availableWithdrawal),
    };
  }, [overviewData]);

  const recentActivities = useMemo(() => {
    const list = activitiesData?.data?.result ?? [];
    return list.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      description: activity.body,
      time: getRelativeTime(activity.createdAt),
      color: getActivityColor(activity.type),
    }));
  }, [activitiesData]);

  if (overviewLoading) return <SellerOverviewPageSkeleton />;

  if (overviewError) {
    return (
      <section className="space-y-6">
        <HeaderBar
          title={`Welcome back, ${user?.name ?? ''}!`}
          description="Track your sales and manage your listings"
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load dashboard data. Please refresh the page.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-50 space-y-6">
      {/* Header */}
      <HeaderBar
        title={`Welcome back, ${user?.name ?? ''}!`}
        description="Track your sales and manage your listings"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<DollarSign className="text-green-600" />}
          iconClassname="bg-green-50"
          label="Total Earnings"
          value={stats?.totalEarning ?? '$0.00'}
          isLoading={overviewFetching}
        />

        <StatCard
          icon={<Boxes className="text-blue-600" />}
          iconClassname="bg-blue-50"
          label="Active Products"
          value={stats?.activeProducts ?? '0'}
          isLoading={overviewFetching}
        />

        <StatCard
          icon={<Clock className="text-orange-600" />}
          iconClassname="bg-orange-50"
          label="Pending Orders"
          value={stats?.pendingOrders ?? '0'}
          isLoading={overviewFetching}
        />

        <StatCard
          icon={<Package className="text-purple-600" />}
          iconClassname="bg-purple-50"
          label="Items Sold"
          value={stats?.productSold ?? '0'}
          isLoading={overviewFetching}
        />
      </div>

      {/* Recent Activities */}
      <div className="border-brand-100 rounded-xl border bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-primary" size={20} />
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          </div>

          <Link href="/seller/activities" className="inline-block">
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View All
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          {activitiesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            recentActivities.map((a) => (
              <ActivityItem
                key={a.id}
                title={a.title}
                description={a.description}
                time={a.time}
                color={a.color}
              />
            ))
          ) : (
            <div className="rounded-lg bg-slate-50 py-8 text-center">
              <Activity className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-sm text-slate-600">No recent activities yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: CTA + Payout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* CTA */}
        <div className="bg-primary rounded-xl p-6 text-white">
          <h4 className="text-lg font-semibold">Ready to sell more?</h4>
          <p className="mt-1 text-sm text-slate-200">
            List a new item and reach thousands of buyers
          </p>

          <Link href="/seller/my-listings" className="inline-block">
            <Button className="mt-4 bg-white text-slate-900 hover:bg-slate-100">
              Create New Listing
            </Button>
          </Link>
        </div>

        {/* Payout */}
        <div className="border-brand-100 rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Available to Withdraw</p>
          <p className="text-primary mt-2 text-2xl font-semibold">
            {stats?.availableWithdrawal ?? '$0.00'}
          </p>
          <ButtonComp
            className="mt-4 bg-green-600 hover:bg-green-700"
            loading={payoutLoading}
            disabled={payoutLoading || Number(stats?.availableWithdrawal ?? 0) <= 0}
            loadingText="Requesting..."
            onClick={() => requestPayout()}
          >
            Request Payout
          </ButtonComp>
        </div>
      </div>
    </section>
  );
};

// Helpers

function formatMoney(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return `$${safe.toFixed(2)}`;
}

function getActivityColor(type: string): ActivityColor {
  // Keep this strictly aligned with ActivityItem props
  const colorMap: Record<string, ActivityColor> = {
    order: 'green',
    order_accepted: 'green',
    order_completed: 'green',
    payment: 'green',

    listing: 'blue',
    order_placed: 'blue',
    locker: 'blue',

    offer: 'orange',
    order_cancelled: 'orange',
  };

  return colorMap[type] ?? 'blue';
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (!Number.isFinite(seconds)) return '';

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

export default SellerOverviewPage;
