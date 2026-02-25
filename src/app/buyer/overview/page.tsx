'use client';

import Notification from '@/components/modules/buyer/Notification';
import OrderItem, { type OrderItemData } from '@/components/modules/buyer/OrderItem';
import HeaderBar from '@/components/shared/HeaderBar';
import StatCard from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Bell, CheckCircle, Clock, Package } from 'lucide-react';

// This data can come from API/Backend
const notifications = [
  {
    id: 1,
    type: 'pickup' as const,
    title: 'Order ready for pickup',
    description: 'Ray-Ban Aviator Sunglasses is ready at Locker L-15. Pickup code: QR-9283',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'order_placed' as const,
    title: 'New order placed',
    description: 'Your order for Nike Air Max has been confirmed and is being processed',
    time: '5 hours ago',
    isRead: true,
  },
  {
    id: 3,
    type: 'shipping' as const,
    title: 'Order shipped',
    description: 'Your Adidas Sports Watch is on the way to the pickup location',
    time: '1 day ago',
    isRead: false,
  },
  {
    id: 4,
    type: 'completed' as const,
    title: 'Order completed',
    description: 'Thank you for your purchase! Please leave a review',
    time: '2 days ago',
    isRead: true,
  },
  {
    id: 5,
    type: 'reminder' as const,
    title: 'Payment reminder',
    description: 'Your payment for Apple AirPods Pro is pending. Complete it within 24 hours',
    time: '3 days ago',
    isRead: true,
  },
];

const orders: OrderItemData[] = [
  {
    title: 'Woman Bag',
    price: '$89.99',
    status: 'Completed',
    color: 'green',
    seller: 'Sarah Johnson',
    orderDate: '2025-01-02',
  },
  {
    title: 'Woman Shirt',
    price: '$36.00',
    status: 'Ready for Pickup',
    color: 'orange',
    seller: 'Michael Brown',
    orderDate: '2025-01-03',
  },
  {
    title: 'Men t-shirt',
    price: '$30.00',
    status: 'Processing',
    color: 'blue',
    seller: 'David Smith',
    orderDate: '2025-01-04',
  },
];

const OverviewPage = () => {
  const { user } = useAuth();

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
          value="2"
        />
        <StatCard
          icon={<CheckCircle className="text-green-600" />}
          iconClassname="bg-green-50"
          label="Completed"
          value="1"
        />
        <StatCard
          icon={<Clock className="text-orange-500" />}
          iconClassname="bg-orange-50"
          label="Awaiting Pickup"
          value="1"
        />
      </div>

      {/* Notifications */}
      <div className="border-brand-100 space-y-3 rounded-xl border bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h3 className="text-primary font-medium">Recent Notification</h3>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {notifications.filter((n) => !n.isRead).length} New
              </span>
            )}
          </div>
          <Button size="sm" variant="link">
            View All <ArrowRight />
          </Button>
        </div>

        {notifications.slice(0, 3).map((notification) => (
          <Notification
            key={notification.id}
            active={!notification.isRead}
            type={notification.type}
            title={notification.title}
            description={notification.description}
            time={notification.time}
          />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="border-brand-100 space-y-3 rounded-xl border bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary font-medium">Recent Orders</h3>
          <Button size="sm" variant="link">
            View All <ArrowRight />
          </Button>
        </div>

        {orders.map((order) => (
          <OrderItem key={order.title} order={order} />
        ))}
      </div>
    </section>
  );
};

export default OverviewPage;
