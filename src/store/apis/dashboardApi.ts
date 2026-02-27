import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';
import {
  NotificationListResponse,
  NotificationsParams,
  DashboardStatsResponse,
} from '@/types/notification';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  tagTypes: ['Notifications', 'DashboardStats'],
  endpoints: (builder) => ({
    // Get notifications with pagination
    getNotifications: builder.query<NotificationListResponse, NotificationsParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.set('page', String(params.page));
        if (params?.limit) qp.set('limit', String(params.limit));
        return {
          url: `/notifications/me?${qp.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Notifications'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Transform data for cursor-based infinite scroll
      merge: (currentCache, newItems, { arg }) => {
        if (arg?.page === 1) {
          currentCache.data.result = newItems.data.result;
        } else {
          currentCache.data.result.push(...newItems.data.result);
        }
        currentCache.data.meta.total = newItems.data.meta.total;
        currentCache.data.meta.page = newItems.data.meta.page;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get dashboard stats (combined buyer + seller overview)
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: '/users/my-overview',
        method: 'GET',
      }),
      providesTags: ['DashboardStats'],
    }),

    // Mark notification as read
    markNotificationAsRead: builder.mutation<{ success: boolean; message: string }, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'PUT',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        dispatch(
          dashboardApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            const notification = draft.data.result.find((n) => n.id === id);
            if (notification) {
              notification.isRead = true;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert on error
          dispatch(dashboardApi.util.invalidateTags(['Notifications']));
        }
      },
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetDashboardStatsQuery,
  useMarkNotificationAsReadMutation,
} = dashboardApi;
