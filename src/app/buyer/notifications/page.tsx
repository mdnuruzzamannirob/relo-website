'use client';

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from '@/store/apis/dashboardApi';
import HeaderBar from '@/components/shared/HeaderBar';
import Notification from '@/components/modules/buyer/Notification';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { NotificationItemSkeleton } from '@/components/shared/SkeletonLoaders';
import { Bell, Trash2 } from 'lucide-react';

const NotificationsPage = () => {
  const { user } = useAuth();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch notifications with pagination
  const {
    data: notificationsData,
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

  const [markAsRead] = useMarkNotificationAsReadMutation();

  // Transform notifications data
  const notifications = useMemo(() => {
    if (!notificationsData?.data.result) return [];
    return notificationsData.data.result.map((notif) => ({
      id: notif.id,
      type: notif.type as any,
      title: notif.title,
      description: notif.body,
      time: getRelativeTime(notif.createdAt),
      isRead: notif.isRead,
    }));
  }, [notificationsData]);

  const hasMore =
    (notificationsData?.data.meta.page ?? 1) < (notificationsData?.data.meta.totalPage ?? 1);

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

  // Handle mark as read
  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      markAsRead(notificationId);
    },
    [markAsRead],
  );

  // Handle notification click
  const handleNotificationClick = useCallback(
    (notificationId: string, isRead: boolean) => {
      if (!isRead) {
        handleMarkAsRead(notificationId);
      }
    },
    [handleMarkAsRead],
  );

  if (error && currentPage === 1) {
    return (
      <section className="space-y-6">
        <HeaderBar
          title="Notifications"
          description="Stay updated with your orders and activities"
        />
        <div className="border-brand-100 rounded-lg border bg-red-50 p-4 text-red-700">
          Failed to load notifications. Please refresh the page.
        </div>
      </section>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <HeaderBar title="Notifications" description="Stay updated with your orders and activities" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="text-primary" size={20} />
          <h3 className="text-lg font-semibold text-slate-900">
            All Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </h3>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 && !isFetching && currentPage === 1 ? (
          <div className="border-brand-100 flex flex-col items-center justify-center rounded-lg border bg-slate-50 p-12 text-center">
            <Bell className="mb-3 text-slate-400" size={40} />
            <p className="font-medium text-slate-600">No notifications yet</p>
            <p className="mt-1 text-sm text-slate-500">
              You&apos;ll receive notifications about your orders and activities
            </p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                className="hover:bg-brand-50 cursor-pointer transition-all duration-200"
              >
                <Notification
                  active={!notification.isRead}
                  type={notification.type}
                  title={notification.title}
                  description={notification.description}
                  time={notification.time}
                />
              </div>
            ))}

            {/* Loading indicator for next batch */}
            {isFetching && currentPage > 1 && (
              <div className="space-y-2">
                <NotificationItemSkeleton />
                <NotificationItemSkeleton />
                <NotificationItemSkeleton />
              </div>
            )}

            {/* Initial loading */}
            {initialLoading && currentPage === 1 && (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <NotificationItemSkeleton key={i} />
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
            {!hasMore && notifications.length > 0 && currentPage > 1 && (
              <div className="py-8 text-center text-sm text-slate-500">
                All notifications loaded
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer actions */}
      {notifications.length > 0 && (
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

export default NotificationsPage;
