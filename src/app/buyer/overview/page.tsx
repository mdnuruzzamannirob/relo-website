'use client';

import { useMemo } from 'react';
import { useGetDashboardStatsQuery } from '@/store/apis/dashboardApi';
import { useGetNotificationsQuery } from '@/store/apis/dashboardApi';
import HeaderBar from '@/components/shared/HeaderBar';
import StatCard from '@/components/shared/StatCard';
import OrderItem from '@/components/modules/buyer/OrderItem';
import Notification from '@/components/modules/buyer/Notification';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BuyerOverviewPageSkeleton } from '@/components/shared/SkeletonLoaders';
import { ArrowRight, Bell, CheckCircle, Clock, Package } from 'lucide-react';
import Link from 'next/link';

const BuyerOverviewPage = () => {
  const { user } = useAuth();

  // Fetch overview data
  const {
    data: overviewData,
    isLoading: overviewLoading,
    isFetching: overviewFetching,
    error: overviewError,
  } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 300000, // Refetch every 5 minutes
  });

  // Fetch notifications for display
  const { data: notificationsData, isLoading: notificationsLoading } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    {
      skip: !overviewData, // Skip until overview data is loaded
    },
  );

  // Extract buyer data from the overview response
  const buyerStats = useMemo(() => {
    if (!overviewData?.data.buyerResponse) return null;

    const buyer = overviewData.data.buyerResponse;
    return {
      activeOrders: buyer.activeOrders,
      completedOrders: buyer.completedOrders,
      awaitOrders: buyer.awaitOrders,
    };
  }, [overviewData]);

  const recentOrders = useMemo(() => {
    // Recent orders not available in overview, return empty
    return [];
  }, []);

  const notifications = useMemo(() => {
    if (!notificationsData?.data.result) return [];
    return notificationsData.data.result.map((notification) => ({
      id: notification.id,
      type: notification.type as any,
      title: notification.title,
      description: notification.body,
      time: getRelativeTime(notification.createdAt),
      isRead: notification.isRead,
    }));
  }, [notificationsData]);

  if (overviewLoading) {
    return <BuyerOverviewPageSkeleton />;
  }

  if (overviewError) {
    return (
      <section className="space-y-6">
        <HeaderBar
          title={`Welcome back, ${user?.name}!`}
          description="Track your orders and manage your purchases"
        />
        <div className="border-brand-100 rounded-lg border bg-red-50 p-4 text-red-700">
          Failed to load dashboard data. Please refresh the page.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <HeaderBar
        title={`Welcome back, ${user?.name}!`}
        description="Track your orders and manage your purchases"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Package className="text-blue-600" />}
          iconClassname="bg-blue-50"
          label="Active Orders"
          value={buyerStats?.activeOrders?.toString() || '0'}
          isLoading={overviewFetching}
        />
        <StatCard
          icon={<CheckCircle className="text-green-600" />}
          iconClassname="bg-green-50"
          label="Completed Orders"
          value={buyerStats?.completedOrders?.toString() || '0'}
          isLoading={overviewFetching}
        />
        <StatCard
          icon={<Clock className="text-purple-600" />}
          iconClassname="bg-purple-50"
          label="Awaiting Orders"
          value={buyerStats?.awaitOrders?.toString() || '0'}
          isLoading={overviewFetching}
        />
      </div>

      {/* Notifications Section */}
      <div className="border-brand-100 space-y-3 rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-primary mb-2 flex items-center gap-2 font-medium">
            <Bell size={18} className="text-primary" /> Latest Notifications
          </h3>
          <Link href="/buyer/notifications">
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>

        {notificationsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-brand-50 h-16 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          notifications
            .slice(0, 3)
            .map((notification) => (
              <Notification
                key={notification.id}
                active={!notification.isRead}
                type={notification.type}
                title={notification.title}
                description={notification.description}
                time={notification.time}
              />
            ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Bell className="mb-3 text-slate-400" size={40} />
            <p className="font-medium text-slate-600">No notifications yet</p>
            <p className="mt-1 text-sm text-slate-500">
              You&apos;ll receive notifications about your orders and activities
            </p>
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="border-brand-100 space-y-3 rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-primary mb-2 flex items-center gap-2 font-medium">
            <Package size={18} className="text-primary" /> Recent Orders
          </h3>
          <Link href="/buyer/my-orders">
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>

        {overviewFetching ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-brand-50 h-20 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          recentOrders.map((order, index) => <OrderItem key={index} order={order} />)
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="mb-3 text-slate-400" size={40} />
            <p className="font-medium text-slate-600">No recent orders</p>
            <p className="mt-1 text-sm text-slate-500">You haven&apos;t placed any orders yet</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      {recentOrders.length === 0 && (
        <div className="bg-brand-50 border-brand-100 rounded-xl border p-6 text-center">
          <p className="mb-4 text-slate-600">Ready to find your next item?</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90">Start Shopping</Button>
          </Link>
        </div>
      )}
    </section>
  );
};

// Helper functions
function getOrderStatusColor(status: string): 'green' | 'orange' | 'blue' | 'purple' | 'red' {
  const statusMap: Record<string, 'green' | 'orange' | 'blue' | 'purple' | 'red'> = {
    COMPLETE: 'green',
    PICKUP: 'orange',
    PENDING: 'blue',
    ACCEPT: 'blue',
    CONFIRM: 'purple',
  };
  return statusMap[status] || 'blue';
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

export default BuyerOverviewPage;
