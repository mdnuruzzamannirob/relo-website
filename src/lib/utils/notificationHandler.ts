import { Notification } from '@/types/notification';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Handles notification click action
 * - Marks notification as read (fire and forget)
 * - Routes to appropriate page based on notification type
 *
 * @param notification - The notification object
 * @param markAsRead - RTK Query mutation trigger function
 * @param router - Next.js router instance
 */
export function handleNotificationClick(
  notification: Notification,
  markAsRead: (id: string) => void,
  router: AppRouterInstance,
) {
  // Mark as read (fire and forget - don't await)
  markAsRead(notification.id);

  // Route based on notification type
  const routeMap: Record<string, string> = {
    order_placed: '/buyer/my-orders',
    completed: '/buyer/my-orders',
    shipping: '/buyer/my-orders',
    pickup: '/buyer/my-orders',
    offer: '/buyer/offers',
    payment: '/buyer/my-orders',
    reminder: '/buyer/notifications',
    NEW_SERVICE: '/buyer/notifications',
  };

  const route = routeMap[notification.type] || '/buyer/my-orders';
  router.push(route);
}

// Alternative hook version for use in components
export function createNotificationClickHandler(
  markAsReadMutation: (id: string) => void,
  router: AppRouterInstance,
) {
  return (notification: Notification) => {
    // Fire mark as read without awaiting
    markAsReadMutation(notification.id);

    // Route based on type
    const routeMap: Record<string, string> = {
      order_placed: '/buyer/my-orders',
      completed: '/buyer/my-orders',
      shipping: '/buyer/my-orders',
      pickup: '/buyer/my-orders',
      offer: '/buyer/offers',
      payment: '/buyer/my-orders',
      reminder: '/buyer/notifications',
      NEW_SERVICE: '/buyer/notifications',
    };

    const route = routeMap[notification.type] || '/buyer/my-orders';
    router.push(route);
  };
}
