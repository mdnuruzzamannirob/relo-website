'use client';

import { useMemo } from 'react';
import { useGetDashboardStatsQuery } from '@/store/apis/dashboardApi';
import StatCard from '@/components/shared/StatCard';
import ActivityItem from '@/components/modules/seller/ActivityItem';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import HeaderBar from '@/components/shared/HeaderBar';
import { SellerOverviewPageSkeleton } from '@/components/shared/SkeletonLoaders';
import { DollarSign, Package, Clock, Boxes, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SellerOverviewPage = () => {
  const { user } = useAuth();

  // Fetch overview data - RTK Query handles caching automatically
  const {
    data: overviewData,
    isLoading: overviewLoading,
    isFetching: overviewFetching,
    error: overviewError,
  } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 300000, // Refetch every 5 minutes
  });

  // Extract seller data from the overview response
  const stats = useMemo(() => {
    if (!overviewData?.data.sellerResponse) return null;

    const seller = overviewData.data.sellerResponse;
    return {
      totalEarning: `$${seller.totalEarning.toFixed(2)}`,
      activeProducts: seller.activeProducts.toString(),
      pendingOrders: seller.pendingOrders.toString(),
      productSold: seller.productSold.toString(),
      availableWithdrawal: `$${seller.availableWithdrawal.toFixed(2)}`,
    };
  }, [overviewData]);

  const recentOrders = useMemo(() => {
    // Recent orders not available in overview, return empty
    return [];
  }, []);

  const recentActivities = useMemo(() => {
    // Recent activities not available in overview, return empty
    return [];
  }, []);

  if (overviewLoading) {
    return <SellerOverviewPageSkeleton />;
  }

  if (overviewError) {
    return (
      <section className="space-y-6">
        <HeaderBar
          title={`Welcome back, ${user?.name}!`}
          description="Track your sales and manage your listings"
        />
        <div className="border-brand-100 rounded-lg border bg-red-50 p-4 text-red-700">
          Failed to load dashboard data. Please refresh the page.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-50 space-y-6">
      {/* Header */}
      <HeaderBar
        title={`Welcome back, ${user?.name}!`}
        description="Track your sales and manage your listings"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<DollarSign className="text-green-600" />}
          iconClassname="bg-green-50"
          label="Total Earnings"
          value={stats?.totalEarning || '$0.00'}
          isLoading={overviewFetching}
        />

        <StatCard
          icon={<Boxes className="text-blue-600" />}
          iconClassname="bg-blue-50"
          label="Active Products"
          value={stats?.activeProducts || '0'}
          isLoading={overviewFetching}
        />

        <StatCard
          icon={<Clock className="text-orange-600" />}
          iconClassname="bg-orange-50"
          label="Pending Orders"
          value={stats?.pendingOrders || '0'}
          isLoading={overviewFetching}
        />

        <StatCard
          icon={<Package className="text-purple-600" />}
          iconClassname="bg-purple-50"
          label="Items Sold"
          value={stats?.productSold || '0'}
          isLoading={overviewFetching}
        />
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* CTA */}
        <div className="bg-primary rounded-xl p-6 text-white">
          <h4 className="text-lg font-semibold">Ready to sell more?</h4>
          <p className="mt-1 text-sm text-slate-300">
            List a new item and reach thousands of buyers
          </p>
          <Link href="/seller/my-listings">
            <Button className="mt-4 bg-white text-slate-900 hover:bg-slate-100">
              Create New Listing
            </Button>
          </Link>
        </div>

        {/* Payout */}
        <div className="border-brand-100 rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Available to Withdraw</p>
          <p className="text-primary mt-2 text-2xl font-semibold">
            {stats?.availableWithdrawal || '$0.00'}
          </p>
          <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">Request Payout</Button>
        </div>
      </div>
    </section>
  );
};

// Helper functions
function getActivityColor(type: string): 'green' | 'blue' | 'orange' | 'purple' | 'red' {
  const colorMap: Record<string, 'green' | 'blue' | 'orange' | 'purple' | 'red'> = {
    order: 'green',
    locker: 'blue',
    offer: 'orange',
    payment: 'purple',
    listing: 'blue',
  };
  return colorMap[type] || 'blue';
}

function getOrderStatusBadgeColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-blue-50 text-blue-700',
    ACCEPT: 'bg-green-50 text-green-700',
    CONFIRM: 'bg-purple-50 text-purple-700',
    PICKUP: 'bg-orange-50 text-orange-700',
    COMPLETE: 'bg-green-100 text-green-800',
    DECLINE: 'bg-red-50 text-red-700',
  };
  return colorMap[status] || 'bg-slate-50 text-slate-700';
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

export default SellerOverviewPage;
